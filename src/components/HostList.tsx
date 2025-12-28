import React, { useState, useEffect } from "react";
import { Host } from "@/types/index";
import { getHosts, saveHosts } from "@/utils/storage";
import HostForm from "./HostForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Pencil, Trash2, Server, Wifi } from "lucide-react";

interface HostListProps {
  onConnect: (host: Host) => void;
}

const HostList: React.FC<HostListProps> = ({ onConnect }) => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHosts(getHosts());
  }, []);

  const handleSave = (host: Host) => {
    const newHosts = editingHost
      ? hosts.map((h) => (h.id === host.id ? host : h))
      : [...hosts, host];

    setHosts(newHosts);
    saveHosts(newHosts);
    setIsEditing(false);
    setEditingHost(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this host?")) {
      const newHosts = hosts.filter((h) => h.id !== id);
      setHosts(newHosts);
      saveHosts(newHosts);
    }
  };

  const handleEdit = (e: React.MouseEvent, host: Host) => {
    e.stopPropagation();
    setEditingHost(host);
    setIsEditing(true);
  };

  const filteredHosts = hosts.filter(
    (h) =>
      h.label.toLowerCase().includes(search.toLowerCase()) ||
      h.hostname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800/50 flex flex-col h-full overflow-hidden shadow-xl">
      {isEditing ? (
        <div className="p-4 h-full overflow-y-auto">
          <HostForm
            initialData={editingHost}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditingHost(null);
            }}
          />
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-zinc-800/50 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-emerald-400" />
                Hosts
              </h2>
              <Button 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/20 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search hosts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500/50"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {filteredHosts.length === 0 ? (
              <div className="text-center mt-8 p-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center ring-1 ring-zinc-700/50">
                  <Server className="h-10 w-10 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm mb-3">No hosts found</p>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first host
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredHosts.map((host) => (
                  <div
                    key={host.id}
                    onClick={() => onConnect(host)}
                    className="group p-3 rounded-xl cursor-pointer transition-all duration-200 bg-zinc-800/30 hover:bg-gradient-to-br hover:from-zinc-800/50 hover:to-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700/50 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20">
                          <Wifi className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm text-white truncate">
                            {host.label}
                          </h3>
                          <p className="text-xs text-zinc-500 font-mono truncate">
                            {host.username}@{host.hostname}
                          </p>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                          onClick={(e) => handleEdit(e, host)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => handleDelete(e, host.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5 pl-13">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md ring-1 ring-emerald-500/20">
                        SSH
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Port {host.port}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default HostList;
