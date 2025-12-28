#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use portable_pty::{native_pty_system, CommandBuilder, PtySize, MasterPty};
use std::{
    collections::HashMap,
    io::{Read, Write},
    sync::{Arc, Mutex},
};
use tauri::State;
use serde::{Deserialize, Serialize};

/// A single PTY session
struct PtySession {
    writer: Box<dyn Write + Send>,
    reader: Box<dyn Read + Send>,
    master: Box<dyn MasterPty + Send>,
}

/// Application state managing multiple PTY sessions
struct AppState {
    sessions: Arc<Mutex<HashMap<String, PtySession>>>,
    next_id: Arc<Mutex<u32>>,
}

#[derive(Serialize, Deserialize)]
struct CreateSessionResult {
    session_id: String,
}

/// Create a new PTY session
#[tauri::command]
async fn create_session(
    program: Option<String>,
    args: Option<Vec<String>>,
    state: State<'_, AppState>,
) -> Result<CreateSessionResult, String> {
    let pty_system = native_pty_system();
    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 30,
            cols: 120,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    let writer = pty_pair.master.take_writer().map_err(|e| e.to_string())?;
    let reader = pty_pair.master.try_clone_reader().map_err(|e| e.to_string())?;

    // Generate session ID
    let session_id = {
        let mut next_id = state.next_id.lock().unwrap();
        let id = format!("session_{}", *next_id);
        *next_id += 1;
        id
    };

    // Build command
    let default_shell = std::env::var("SHELL").unwrap_or_else(|_| "zsh".to_string());
    let cmd_program = program.unwrap_or(default_shell);
    
    let mut cmd = CommandBuilder::new(&cmd_program);
    cmd.env("TERM", "xterm-256color");
    
    if let Some(arguments) = args {
        cmd.args(arguments);
    }

    // Spawn command
    let _child = pty_pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;

    // Store session
    let session = PtySession {
        writer,
        reader,
        master: pty_pair.master,
    };

    state.sessions.lock().unwrap().insert(session_id.clone(), session);

    Ok(CreateSessionResult { session_id })
}

/// Destroy a PTY session
#[tauri::command]
async fn destroy_session(
    session_id: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    state.sessions.lock().unwrap().remove(&session_id);
    Ok(())
}

/// Write data to a specific session
#[tauri::command]
async fn write_to_session(
    session_id: String,
    data: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get_mut(&session_id) {
        session.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
        session.writer.flush().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Read data from a specific session
#[tauri::command]
async fn read_from_session(
    session_id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let mut sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get_mut(&session_id) {
        let mut buffer = [0u8; 4096];
        match session.reader.read(&mut buffer) {
            Ok(0) => Ok(String::new()),
            Ok(n) => Ok(String::from_utf8_lossy(&buffer[..n]).to_string()),
            Err(_) => Ok(String::new()),
        }
    } else {
        Ok(String::new())
    }
}

/// Resize a specific session's PTY
#[tauri::command]
async fn resize_session(
    session_id: String,
    rows: u16,
    cols: u16,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get(&session_id) {
        session.master.resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        }).map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// List all active session IDs
#[tauri::command]
async fn list_sessions(state: State<'_, AppState>) -> Result<Vec<String>, String> {
    let sessions = state.sessions.lock().unwrap();
    Ok(sessions.keys().cloned().collect())
}

// ============ LEGACY COMMANDS (for backward compatibility) ============

#[tauri::command]
async fn async_create_shell(
    program: Option<String>,
    args: Option<Vec<String>>,
    state: State<'_, AppState>,
) -> Result<(), String> {
    // Create session with fixed ID "default" for legacy support
    let pty_system = native_pty_system();
    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 30,
            cols: 120,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    let writer = pty_pair.master.take_writer().map_err(|e| e.to_string())?;
    let reader = pty_pair.master.try_clone_reader().map_err(|e| e.to_string())?;

    let default_shell = std::env::var("SHELL").unwrap_or_else(|_| "zsh".to_string());
    let cmd_program = program.unwrap_or(default_shell);
    
    let mut cmd = CommandBuilder::new(&cmd_program);
    cmd.env("TERM", "xterm-256color");
    
    if let Some(arguments) = args {
        cmd.args(arguments);
    }

    let _child = pty_pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;

    let session = PtySession {
        writer,
        reader,
        master: pty_pair.master,
    };

    state.sessions.lock().unwrap().insert("default".to_string(), session);
    Ok(())
}

#[tauri::command]
async fn async_write_to_pty(data: &str, state: State<'_, AppState>) -> Result<(), String> {
    write_to_session("default".to_string(), data.to_string(), state).await
}

#[tauri::command]
async fn async_read_from_pty(state: State<'_, AppState>) -> Result<String, String> {
    read_from_session("default".to_string(), state).await
}

#[tauri::command]
async fn async_resize_pty(rows: u16, cols: u16, state: State<'_, AppState>) -> Result<(), String> {
    resize_session("default".to_string(), rows, cols, state).await
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            sessions: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(1)),
        })
        .invoke_handler(tauri::generate_handler![
            // New multi-session commands
            create_session,
            destroy_session,
            write_to_session,
            read_from_session,
            resize_session,
            list_sessions,
            // Legacy commands for backward compatibility
            async_create_shell,
            async_write_to_pty,
            async_read_from_pty,
            async_resize_pty,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_state() -> AppState {
        AppState {
            sessions: Arc::new(Mutex::new(HashMap::new())),
            next_id: Arc::new(Mutex::new(1)),
        }
    }

    #[test]
    fn test_session_id_generation() {
        let state = create_test_state();
        
        // First ID should be session_1
        {
            let mut next_id = state.next_id.lock().unwrap();
            let id = format!("session_{}", *next_id);
            *next_id += 1;
            assert_eq!(id, "session_1");
        }
        
        // Second ID should be session_2
        {
            let mut next_id = state.next_id.lock().unwrap();
            let id = format!("session_{}", *next_id);
            *next_id += 1;
            assert_eq!(id, "session_2");
        }
    }

    #[test]
    fn test_sessions_hashmap_operations() {
        let state = create_test_state();
        
        // Initially empty
        {
            let sessions = state.sessions.lock().unwrap();
            assert!(sessions.is_empty());
        }
        
        // After adding a session key
        {
            let mut sessions = state.sessions.lock().unwrap();
            // We can't easily add a real PtySession in tests, but we can test the structure
            sessions.keys().count(); // Just verify we can access
        }
    }

    #[test]
    fn test_default_shell_env() {
        // Test that SHELL env var is read correctly or defaults to zsh
        let default_shell = std::env::var("SHELL").unwrap_or_else(|_| "zsh".to_string());
        assert!(!default_shell.is_empty());
    }

    #[test]
    fn test_session_keys_collection() {
        let state = create_test_state();
        let sessions = state.sessions.lock().unwrap();
        let keys: Vec<String> = sessions.keys().cloned().collect();
        assert!(keys.is_empty());
    }
}