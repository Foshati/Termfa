import "@/App.css";
import { useEffect, useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "xterm/css/xterm.css";
import SettingsModal from "@/components/SettingsModal";
import Sidebar from "@/components/Sidebar";
import HostList from "@/components/HostList";
import TabBar from "@/components/TabBar";
import LayoutRenderer from "@/components/LayoutRenderer";
import { Host, Tab, TerminalSession, LayoutNode } from "@/types";
import { themes } from "@/themes";
import { saveTabState, getSettings, saveSettings } from "@/utils/storage";
import { Wifi } from "lucide-react";

function App() {
  // Settings State
  const [currentTheme, setCurrentTheme] = useState("default");
  const [fontSize, setFontSize] = useState(14);
  const [cursorStyle, setCursorStyle] = useState<"block" | "underline" | "bar">("block");
  
  // UI State
  const [activeView, setActiveView] = useState<"terminal" | "hosts">("terminal");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Multi-tab State
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [sessions, setSessions] = useState<Map<string, TerminalSession>>(new Map());

  // Load settings on mount
  useEffect(() => {
    const settings = getSettings();
    setCurrentTheme(settings.theme);
    setFontSize(settings.fontSize);
    setCursorStyle(settings.cursorStyle);
  }, []);

  // Save settings when they change
  useEffect(() => {
    saveSettings({ theme: currentTheme, fontSize, cursorStyle });
  }, [currentTheme, fontSize, cursorStyle]);

  // Create a new session
  const createSession = useCallback(async (host?: Host): Promise<string> => {
    try {
      let program: string | undefined;
      let args: string[] | undefined;

      if (host) {
        program = "ssh";
        args = [host.username + "@" + host.hostname, "-p", host.port.toString()];
        if (host.authType === "key" && host.keyPath) {
          args.push("-i", host.keyPath);
        }
      }

      const result = await invoke<{ session_id: string }>("create_session", {
        program,
        args,
      });

      const session: TerminalSession = {
        id: result.session_id,
        host,
        title: host ? `${host.label}` : "Local",
        createdAt: Date.now(),
      };

      setSessions((prev) => new Map(prev).set(result.session_id, session));
      return result.session_id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }, []);

  // Destroy a session
  const destroySession = useCallback(async (sessionId: string) => {
    try {
      await invoke("destroy_session", { sessionId });
      setSessions((prev) => {
        const next = new Map(prev);
        next.delete(sessionId);
        return next;
      });
    } catch (error) {
      console.error("Error destroying session:", error);
    }
  }, []);

  // Get all session IDs from a layout
  const getSessionIdsFromLayout = useCallback((node: LayoutNode): string[] => {
    if (node.type === "terminal") {
      return node.sessionId ? [node.sessionId] : [];
    }
    return [
      ...getSessionIdsFromLayout(node.first),
      ...getSessionIdsFromLayout(node.second),
    ];
  }, []);

  // Create a new tab
  const handleNewTab = useCallback(async () => {
    const sessionId = await createSession();
    const newTab: Tab = {
      id: `tab_${Date.now()}`,
      title: "Terminal",
      layout: { type: "terminal", sessionId },
      activeSessionId: sessionId,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [createSession]);

  // Close a tab
  const handleCloseTab = useCallback(
    async (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return;

      // Destroy all sessions in the tab
      const sessionIds = getSessionIdsFromLayout(tab.layout);
      for (const sessionId of sessionIds) {
        await destroySession(sessionId);
      }

      setTabs((prev) => {
        const newTabs = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId && newTabs.length > 0) {
          setActiveTabId(newTabs[0].id);
        }
        return newTabs;
      });
    },
    [tabs, activeTabId, getSessionIdsFromLayout, destroySession]
  );

  // Rename a tab
  const handleTabRename = useCallback((tabId: string, newTitle: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, title: newTitle } : tab))
    );
  }, []);

  // Update layout for active tab
  const handleLayoutChange = useCallback((updatedLayout: LayoutNode) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, layout: updatedLayout } : tab
      )
    );
  }, [activeTabId]);

  // Focus on a session
  const handleSessionFocus = useCallback((sessionId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, activeSessionId: sessionId } : tab
      )
    );
  }, [activeTabId]);

  // Split current pane
  const splitPane = useCallback(
    async (direction: "horizontal" | "vertical") => {
      const activeTab = tabs.find((t) => t.id === activeTabId);
      if (!activeTab) return;

      const newSessionId = await createSession();

      const splitNode = (node: LayoutNode): LayoutNode => {
        if (node.type === "terminal" && node.sessionId === activeTab.activeSessionId) {
          return {
            type: "split",
            direction,
            ratio: 0.5,
            first: node,
            second: { type: "terminal", sessionId: newSessionId },
          };
        }
        if (node.type === "split") {
          return {
            ...node,
            first: splitNode(node.first),
            second: splitNode(node.second),
          };
        }
        return node;
      };

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? { ...tab, layout: splitNode(tab.layout), activeSessionId: newSessionId }
            : tab
        )
      );
    },
    [tabs, activeTabId, createSession]
  );

  // Initialize first tab
  useEffect(() => {
    if (tabs.length === 0) {
      handleNewTab();
    }
  }, [tabs.length, handleNewTab]);

  // Save tab state periodically
  useEffect(() => {
    if (tabs.length > 0) {
      saveTabState({
        tabs,
        activeTabId,
        sessions: Array.from(sessions.values()),
      });
    }
  }, [tabs, activeTabId, sessions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd+T: New tab
      if (isMod && e.key === "t") {
        e.preventDefault();
        handleNewTab();
      }
      // Cmd+W: Close tab
      else if (isMod && e.key === "w") {
        e.preventDefault();
        if (tabs.length > 1 && activeTabId) {
          handleCloseTab(activeTabId);
        }
      }
      // Cmd+D: Split vertical
      else if (isMod && e.key === "d" && !e.shiftKey) {
        e.preventDefault();
        splitPane("vertical");
      }
      // Cmd+Shift+D: Split horizontal
      else if (isMod && e.shiftKey && e.key === "D") {
        e.preventDefault();
        splitPane("horizontal");
      }
      // Cmd+[ or Cmd+]: Switch tabs
      else if (isMod && (e.key === "[" || e.key === "]")) {
        e.preventDefault();
        const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
        const newIndex =
          e.key === "["
            ? (currentIndex - 1 + tabs.length) % tabs.length
            : (currentIndex + 1) % tabs.length;
        setActiveTabId(tabs[newIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, activeTabId, handleNewTab, handleCloseTab, splitPane]);

  // Handle connecting to a host from hosts list
  const handleConnect = useCallback(
    async (host: Host) => {
      setActiveView("terminal");
      const sessionId = await createSession(host);
      const newTab: Tab = {
        id: `tab_${Date.now()}`,
        title: host.label,
        layout: { type: "terminal", sessionId },
        activeSessionId: sessionId,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    },
    [createSession]
  );

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="dark flex bg-zinc-950 h-screen text-white overflow-hidden font-sans">
      <Sidebar
        activeTab={activeView}
        onTabChange={(tab) => {
          if (tab === "settings") {
            setIsSettingsOpen(true);
          } else {
            setActiveView(tab as "terminal" | "hosts");
          }
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Terminal View */}
        <div
          className={`flex-1 flex flex-col min-h-0 transition-opacity duration-200 ${
            activeView === "terminal"
              ? "opacity-100 z-10"
              : "opacity-0 absolute inset-0 pointer-events-none"
          }`}
        >
          {/* Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onNewTab={handleNewTab}
            onCloseTab={handleCloseTab}
            onTabRename={handleTabRename}
          />

          {/* Terminal Content */}
          <div className="flex-1 bg-zinc-950 overflow-hidden relative">
            {activeTab && (
              <LayoutRenderer
                node={activeTab.layout}
                activeSessionId={activeTab.activeSessionId}
                onSessionFocus={handleSessionFocus}
                onLayoutChange={handleLayoutChange}
                theme={themes[currentTheme]}
                fontSize={fontSize}
                cursorStyle={cursorStyle}
              />
            )}
          </div>
        </div>

        {/* Hosts View */}
        {activeView === "hosts" && (
          <div className="h-full flex">
            <HostList onConnect={handleConnect} />
            <div className="flex-1 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900 flex items-center justify-center ring-1 ring-zinc-700/30 shadow-2xl">
                  <Wifi className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm">Select a host to connect</p>
                <p className="text-zinc-600 text-xs mt-1">or create a new one</p>
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
