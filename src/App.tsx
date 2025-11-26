import "./App.css";
import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "xterm/css/xterm.css";
import SettingsModal from "./components/SettingsModal";
import { themes } from "./themes";

function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const isReadingRef = useRef(false);
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings State
  const [currentTheme, setCurrentTheme] = useState("default");
  const [fontSize, setFontSize] = useState(14);
  const [cursorStyle, setCursorStyle] = useState<'block' | 'underline' | 'bar'>("block");

  const readFromPty = useCallback(async () => {
    if (isReadingRef.current) return;
    isReadingRef.current = true;
    
    try {
      const data = await invoke("async_read_from_pty") as string;
      if (data && terminalInstanceRef.current) {
        terminalInstanceRef.current.write(data);
      }
    } catch (error) {
      console.error("Error reading from PTY:", error);
    }
    
    isReadingRef.current = false;
    setTimeout(readFromPty, 50);
  }, []);

  // Initialize Terminal
  useEffect(() => {
    const initTerminal = async () => {
      const term = new Terminal({
        fontFamily: "'MesloLGS NF', 'Hack Nerd Font', 'JetBrainsMono Nerd Font', 'FiraCode Nerd Font', monospace",
        fontSize: fontSize,
        lineHeight: 1.2,
        letterSpacing: 0,
        cursorStyle: cursorStyle,
        cursorBlink: true,
        theme: themes[currentTheme],
        allowTransparency: true,
        convertEol: true,
        scrollback: 10000,
        tabStopWidth: 4,
        fastScrollModifier: 'alt',
        fastScrollSensitivity: 5,
        scrollSensitivity: 1,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      if (terminalRef.current) {
        // Clear any existing terminal
        terminalRef.current.innerHTML = '';
        
        term.open(terminalRef.current);
        terminalInstanceRef.current = term;
        fitAddonRef.current = fitAddon;
        
        term.onData(writeToPty);
        
        // Only init shell if it hasn't been initialized (this might need better handling for hot reloads)
        // For now, we assume the backend handles multiple calls gracefully or we just reconnect
        await initShell();
        fitTerminal();
        readFromPty();
      }
    };

    initTerminal();

    const handleResize = () => fitTerminal();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Update Terminal Options when settings change
  useEffect(() => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.options.theme = themes[currentTheme];
      terminalInstanceRef.current.options.fontSize = fontSize;
      terminalInstanceRef.current.options.cursorStyle = cursorStyle;
      
      // Refit after font size change
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        // Also resize PTY
        if (terminalInstanceRef.current) {
             invoke("async_resize_pty", {
              rows: terminalInstanceRef.current.rows,
              cols: terminalInstanceRef.current.cols,
            }).catch(console.error);
        }
      }
    }
  }, [currentTheme, fontSize, cursorStyle]);

  const fitTerminal = async () => {
    if (fitAddonRef.current && terminalInstanceRef.current) {
      fitAddonRef.current.fit();
      try {
        await invoke("async_resize_pty", {
          rows: terminalInstanceRef.current.rows,
          cols: terminalInstanceRef.current.cols,
        });
      } catch (error) {
        console.error("Error resizing PTY:", error);
      }
    }
  };

  const writeToPty = async (data: string) => {
    try {
      await invoke("async_write_to_pty", { data });
    } catch (error) {
      console.error("Error writing to PTY:", error);
    }
  };

  const initShell = async () => {
    try {
      await invoke("async_create_shell");
    } catch (error) {
      console.error("Error creating shell:", error);
    }
  };

  const handleMinimize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    const appWindow = getCurrentWindow();
    const maximized = await appWindow.isMaximized();
    if (maximized) {
      await appWindow.unmaximize();
      setIsMaximized(false);
    } else {
      await appWindow.maximize();
      setIsMaximized(true);
    }
  };

  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  return (
    <div className="app">
      <div className="header" data-tauri-drag-region>
        <div className="header-left">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 8L10 11L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="app-title">Termfa</span>
          <span className="version">v0.0.6</span>
        </div>
        <div className="header-right">
          <button 
            className="window-btn settings-btn" 
            onClick={() => setIsSettingsOpen(true)} 
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button className="window-btn minimize" onClick={handleMinimize} title="Minimize">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="window-btn maximize" onClick={handleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
            {isMaximized ? (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            )}
          </button>
          <button className="window-btn close" onClick={handleClose} title="Close">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </div>
      <div
        id="terminal"
        ref={terminalRef}
        className="terminal-container"
      ></div>
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        cursorStyle={cursorStyle}
        onCursorStyleChange={setCursorStyle}
      />
    </div>
  );
}

export default App;
