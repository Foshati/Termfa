import React from "react";

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
  onTabRename,
}) => {
  const [editingTabId, setEditingTabId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const handleDoubleClick = (tab: { id: string; title: string }) => {
    setEditingTabId(tab.id);
    setEditValue(tab.title);
  };

  const handleRenameSubmit = (tabId: string) => {
    if (editValue.trim()) {
      onTabRename(tabId, editValue.trim());
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter") {
      handleRenameSubmit(tabId);
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  return (
    <div className="flex items-center bg-neutral-900 border-b border-neutral-800 h-10 px-2 gap-1 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          onDoubleClick={() => handleDoubleClick(tab)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all select-none min-w-[100px] max-w-[180px] ${
            activeTabId === tab.id
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
          }`}
        >
          {/* Terminal Icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>

          {/* Tab Title */}
          {editingTabId === tab.id ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleRenameSubmit(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              autoFocus
              className="bg-transparent border-none outline-none text-sm w-full text-white"
            />
          ) : (
            <span className="text-sm truncate">{tab.title}</span>
          )}

          {/* Close Button */}
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-700 rounded transition-all flex-shrink-0"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      ))}

      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all flex-shrink-0"
        title="New Tab (⌘T)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default TabBar;
