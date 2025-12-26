import "./App.css";
import { useEffect, useRef, useCallback, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { invoke } from "@tauri-apps/api/core";
import "xterm/css/xterm.css";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import HostList from "./components/HostList";
import { Host } from "./types";
import { themes } from "./themes";

function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const isReadingRef = useRef(false);
  
  const [activeTab, setActiveTab] = useState<'terminal' | 'hosts' | 'settings'>('terminal');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings State
  const [currentTheme, setCurrentTheme] = useState("default");
  const [fontSize, setFontSize] = useState(14);
  const [cursorStyle, setCursorStyle] = useState<'block' | 'underline' | 'bar'>("block");

  // Session State
  const [currentHost, setCurrentHost] = useState<Host | null>(null);

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
        terminalRef.current.innerHTML = '';
        
        term.open(terminalRef.current);
        terminalInstanceRef.current = term;
        fitAddonRef.current = fitAddon;
        
        term.onData(writeToPty);
        
        // Start default shell if no host connected yet
        if (!currentHost) {
           await startShell();
        }
        
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
  }, []);

  // Update Terminal Options when settings change
  useEffect(() => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.options.theme = themes[currentTheme];
      terminalInstanceRef.current.options.fontSize = fontSize;
      terminalInstanceRef.current.options.cursorStyle = cursorStyle;
      
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
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
        // Wait a bit for layout to settle, especially when switching tabs
        setTimeout(async () => {
            fitAddonRef.current?.fit();
            try {
                if (terminalInstanceRef.current) {
                    await invoke("async_resize_pty", {
                    rows: terminalInstanceRef.current.rows,
                    cols: terminalInstanceRef.current.cols,
                    });
                }
            } catch (error) {
                console.error("Error resizing PTY:", error);
            }
        }, 100);
    }
  };

  // Re-fit when tab changes
  useEffect(() => {
      if (activeTab === 'terminal') {
          fitTerminal();
      }
  }, [activeTab]);

  const writeToPty = async (data: string) => {
    try {
      await invoke("async_write_to_pty", { data });
    } catch (error) {
      console.error("Error writing to PTY:", error);
    }
  };

  const startShell = async (host?: Host) => {
    try {
      let program = undefined;
      let args = undefined;

      if (host) {
          program = "ssh";
          args = [host.username + "@" + host.hostname, "-p", host.port.toString()];
          
          if (host.authType === "key" && host.keyPath) {
              args.push("-i");
              args.push(host.keyPath);
          }
          // Note: Password auth is interactive in SSH. xterm will handle the password prompt.
      }

      await invoke("async_create_shell", { program, args });
      
      if (terminalInstanceRef.current) {
          terminalInstanceRef.current.clear();
          terminalInstanceRef.current.reset();
      }
      setCurrentHost(host || null);
    } catch (error) {
      console.error("Error creating shell:", error);
    }
  };

  const handleConnect = async (host: Host) => {
      setActiveTab('terminal');
      await startShell(host);
  };

  return (
    <div className="flex bg-neutral-950 h-screen text-white overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab === 'settings' ? 'terminal' : activeTab} 
        onTabChange={(tab) => {
            if (tab === 'settings') {
                setIsSettingsOpen(true);
            } else {
                setActiveTab(tab);
            }
        }} 
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Terminal View */}
        <div 
            className={`flex-1 flex flex-col min-h-0 transition-opacity duration-200 ${
                activeTab === 'terminal' ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
        >
             <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between h-12">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                     <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                     {currentHost ? `${currentHost.username}@${currentHost.hostname}` : 'Local Terminal'}
                </div>
             </div>
             <div className="flex-1 bg-neutral-950 p-2 overflow-hidden relative">
                <div
                    id="terminal"
                    ref={terminalRef}
                    className="w-full h-full"
                ></div>
             </div>
        </div>

        {/* Hosts View */}
        {activeTab === 'hosts' && (
            <div className="h-full flex">
                <HostList onConnect={handleConnect} />
                {/* Could add a preview/details pane here for right side of hosts list */}
                <div className="flex-1 bg-neutral-950 flex items-center justify-center text-neutral-600">
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                             <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                            <line x1="6" y1="6" x2="6.01" y2="6"></line>
                            <line x1="6" y1="18" x2="6.01" y2="18"></line>
                        </svg>
                        <p>Select a host to connect</p>
                    </div>
                </div>
            </div>
        )}

      </div>
      
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
