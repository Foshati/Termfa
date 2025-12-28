import React, { useEffect, useRef, useCallback } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { invoke } from "@tauri-apps/api/core";
import "xterm/css/xterm.css";
import { TerminalTheme } from "../themes";

interface TerminalPaneProps {
  sessionId: string;
  isActive: boolean;
  onFocus: () => void;
  theme: TerminalTheme;
  fontSize: number;
  cursorStyle: "block" | "underline" | "bar";
}

const TerminalPane: React.FC<TerminalPaneProps> = ({
  sessionId,
  isActive,
  onFocus,
  theme,
  fontSize,
  cursorStyle,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const isReadingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const readFromPty = useCallback(async () => {
    if (isReadingRef.current || !sessionId) return;
    isReadingRef.current = true;

    try {
      const data = (await invoke("read_from_session", {
        sessionId,
      })) as string;
      if (data && terminalInstanceRef.current) {
        terminalInstanceRef.current.write(data);
      }
    } catch (error) {
      console.error("Error reading from PTY:", error);
    }

    isReadingRef.current = false;
    setTimeout(readFromPty, 50);
  }, [sessionId]);

  const writeToPty = useCallback(
    async (data: string) => {
      if (!sessionId) return;
      try {
        await invoke("write_to_session", { sessionId, data });
      } catch (error) {
        console.error("Error writing to PTY:", error);
      }
    },
    [sessionId]
  );

  const fitTerminal = useCallback(async () => {
    if (fitAddonRef.current && terminalInstanceRef.current && sessionId) {
      setTimeout(async () => {
        fitAddonRef.current?.fit();
        try {
          if (terminalInstanceRef.current) {
            await invoke("resize_session", {
              sessionId,
              rows: terminalInstanceRef.current.rows,
              cols: terminalInstanceRef.current.cols,
            });
          }
        } catch (error) {
          console.error("Error resizing PTY:", error);
        }
      }, 100);
    }
  }, [sessionId]);

  // Initialize Terminal
  useEffect(() => {
    if (!sessionId || isInitializedRef.current) return;

    const initTerminal = async () => {
      const term = new Terminal({
        fontFamily:
          "'MesloLGS NF', 'Hack Nerd Font', 'JetBrainsMono Nerd Font', 'FiraCode Nerd Font', monospace",
        fontSize,
        lineHeight: 1.2,
        letterSpacing: 0,
        cursorStyle,
        cursorBlink: true,
        theme,
        allowTransparency: true,
        convertEol: true,
        scrollback: 10000,
        tabStopWidth: 4,
        fastScrollModifier: "alt",
        fastScrollSensitivity: 5,
        scrollSensitivity: 1,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      if (terminalRef.current) {
        terminalRef.current.innerHTML = "";

        term.open(terminalRef.current);
        terminalInstanceRef.current = term;
        fitAddonRef.current = fitAddon;
        isInitializedRef.current = true;

        term.onData(writeToPty);

        fitTerminal();
        readFromPty();
      }
    };

    initTerminal();

    return () => {
      if (terminalInstanceRef.current) {
        terminalInstanceRef.current.dispose();
        terminalInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [sessionId, fontSize, cursorStyle, theme, writeToPty, fitTerminal, readFromPty]);

  // Update terminal options when settings change
  useEffect(() => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.options.theme = theme;
      terminalInstanceRef.current.options.fontSize = fontSize;
      terminalInstanceRef.current.options.cursorStyle = cursorStyle;
      fitTerminal();
    }
  }, [theme, fontSize, cursorStyle, fitTerminal]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => fitTerminal();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitTerminal]);

  // Fit when becoming active
  useEffect(() => {
    if (isActive) {
      fitTerminal();
      terminalInstanceRef.current?.focus();
    }
  }, [isActive, fitTerminal]);

  return (
    <div
      className={`relative w-full h-full bg-neutral-950 ${
        isActive ? "ring-1 ring-blue-500/50" : ""
      }`}
      onClick={onFocus}
    >
      <div ref={terminalRef} className="w-full h-full p-1" />
    </div>
  );
};

export default TerminalPane;
