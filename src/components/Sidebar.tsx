import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Terminal, Server, Settings } from "lucide-react";

interface SidebarProps {
  activeTab: "terminal" | "hosts" | "settings";
  onTabChange: (tab: "terminal" | "hosts" | "settings") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800/50 flex flex-col items-center py-4 gap-2 h-full shadow-xl">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            T
          </div>
        </div>

        {/* Terminal Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTabChange("terminal")}
              className={`w-11 h-11 rounded-xl transition-all duration-200 ${
                activeTab === "terminal"
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Terminal className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-zinc-800 border-zinc-700 text-white">
            <p>Terminal</p>
          </TooltipContent>
        </Tooltip>

        {/* Hosts Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTabChange("hosts")}
              className={`w-11 h-11 rounded-xl transition-all duration-200 ${
                activeTab === "hosts"
                  ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20 text-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Server className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-zinc-800 border-zinc-700 text-white">
            <p>Hosts</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        {/* Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTabChange("settings")}
              className={`w-11 h-11 rounded-xl transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 text-white ring-1 ring-zinc-500/30"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-zinc-800 border-zinc-700 text-white">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
