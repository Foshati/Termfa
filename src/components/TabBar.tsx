import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Terminal } from "lucide-react";

interface TabBarProps {
  tabs: Array<{ id: string; title: string }>;
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
  onTabRename: (tabId: string, newTitle: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onNewTab,
  onCloseTab,
}) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/95 border-b border-zinc-800/50 h-11 px-2 gap-1 shadow-lg">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex items-center gap-2 h-8 px-4 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-br from-cyan-500/15 to-blue-600/15 text-white ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/5"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Terminal className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : ""}`} />
            <span className="max-w-[100px] truncate text-xs font-medium">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded p-0.5 transition-all duration-150"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            )}
          </button>
        );
      })}

      <Button
        variant="ghost"
        size="icon"
        onClick={onNewTab}
        className="h-8 w-8 shrink-0 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TabBar;
