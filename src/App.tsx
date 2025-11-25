import "./App.css";
import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "xterm/css/xterm.css";

function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const isReadingRef = useRef(false);
  const [isMaximized, setIsMaximized] = useState(false);

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

  useEffect(() => {
    const initTerminal = async () => {
      const term = new Terminal({
        fontFamily: "'MesloLGS NF', 'Hack Nerd Font', 'JetBrainsMono Nerd Font', 'FiraCode Nerd Font', monospace",
        fontSize: 14,
        lineHeight: 1.2,
        letterSpacing: 0,
        cursorStyle: "block",
        cursorBlink: true,
        theme: {
          background: "#0a0e14",
          foreground: "#e6edf3",
          cursor: "#58d1eb",
          cursorAccent: "#0a0e14",
          selectionBackground: "#264f78",
          black: "#484f58",
          red: "#ff7b72",
          green: "#3fb950",
          yellow: "#d29922",
          blue: "#58a6ff",
          magenta: "#bc8cff",
          cyan: "#39c5cf",
          white: "#b1bac4",
          brightBlack: "#6e7681",
          brightRed: "#ffa198",
          brightGreen: "#56d364",
          brightYellow: "#e3b341",
          brightBlue: "#79c0ff",
          brightMagenta: "#d2a8ff",
          brightCyan: "#56d4dd",
          brightWhite: "#f0f6fc",
        },
        allowTransparency: false,
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
        term.open(terminalRef.current);
        terminalInstanceRef.current = term;
        fitAddonRef.current = fitAddon;
        
        term.onData(writeToPty);
        
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
  }, [readFromPty]);

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
    </div>
  );
}

export default App;
