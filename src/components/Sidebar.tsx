import React from 'react';

interface SidebarProps {
  activeTab: 'terminal' | 'hosts' | 'settings';
  onTabChange: (tab: 'terminal' | 'hosts' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-16 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-4 gap-4 h-full">
        <div className="mb-4">
             {/* App Logo or distinct icon could go here */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                T
            </div>
        </div>

      <button
        onClick={() => onTabChange('terminal')}
        className={`p-3 rounded-xl transition-all ${
          activeTab === 'terminal' 
            ? 'bg-blue-600/20 text-blue-400' 
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
        }`}
        title="Terminal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </button>

      <button
        onClick={() => onTabChange('hosts')}
        className={`p-3 rounded-xl transition-all ${
          activeTab === 'hosts' 
            ? 'bg-blue-600/20 text-blue-400' 
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
        }`}
        title="Hosts"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
        </svg>
      </button>

      <div className="flex-1"></div>

      <button
        onClick={() => onTabChange('settings')}
        className={`p-3 rounded-xl transition-all ${
          activeTab === 'settings' 
            ? 'bg-blue-600/20 text-blue-400' 
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
        }`}
        title="Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;
