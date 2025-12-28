import React, { useState, useEffect } from 'react';
import { Host } from '../types/index';
import { getHosts, saveHosts } from '../utils/storage';
import HostForm from './HostForm';

interface HostListProps {
  onConnect: (host: Host) => void;
}

const HostList: React.FC<HostListProps> = ({ onConnect }) => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setHosts(getHosts());
  }, []);

  const handleSave = (host: Host) => {
    const newHosts = editingHost 
      ? hosts.map(h => h.id === host.id ? host : h)
      : [...hosts, host];
    
    setHosts(newHosts);
    saveHosts(newHosts);
    setIsEditing(false);
    setEditingHost(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this host?')) {
        const newHosts = hosts.filter(h => h.id !== id);
        setHosts(newHosts);
        saveHosts(newHosts);
    }
  };

  const handleEdit = (e: React.MouseEvent, host: Host) => {
      e.stopPropagation();
      setEditingHost(host);
      setIsEditing(true);
  }

  const filteredHosts = hosts.filter(h => 
    h.label.toLowerCase().includes(search.toLowerCase()) || 
    h.hostname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full overflow-hidden">
        {isEditing ? (
            <div className="p-6 h-full overflow-y-auto">
                 <HostForm 
                    initialData={editingHost} 
                    onSave={handleSave} 
                    onCancel={() => { setIsEditing(false); setEditingHost(null); }} 
                />
            </div>
           
        ) : (
            <>
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white tracking-tight">Hosts</h2>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-lg shadow-blue-900/20 transition-all"
                            title="Add Host"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        <svg className="absolute left-3 top-2.5 text-neutral-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search hosts..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-neutral-500" 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredHosts.length === 0 ? (
                         <div className="text-center text-neutral-500 mt-10 p-8 border border-dashed border-neutral-800 rounded-2xl">
                            <p>No hosts found.</p>
                            <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-400 mt-2 text-sm font-medium">Create your first host</button>
                         </div>
                    ) : (
                        filteredHosts.map(host => (
                            <div 
                                key={host.id}
                                onClick={() => onConnect(host)}
                                className="group relative bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-neutral-600 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center border border-blue-500/20">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                                <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-base leading-tight">{host.label}</h3>
                                            <p className="text-xs text-neutral-400 mt-0.5">{host.username}@{host.hostname}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                        <button 
                                            onClick={(e) => handleEdit(e, host)}
                                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                         <button 
                                            onClick={(e) => handleDelete(e, host.id)}
                                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">SSH</span>
                                    <span className="text-[10px] font-mono text-neutral-500">{host.hostname}:{host.port}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
        )}
    </div>
  );
};

export default HostList;
