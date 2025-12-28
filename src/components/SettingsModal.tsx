import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { themes } from "@/themes";
import { Minus, Plus, Palette, Type, MousePointer2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  cursorStyle: "block" | "underline" | "bar";
  onCursorStyleChange: (style: "block" | "underline" | "bar") => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  cursorStyle,
  onCursorStyleChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Palette className="h-4 w-4 text-cyan-400" />
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => onThemeChange(key)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                    currentTheme === key
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 ring-1 ring-cyan-500/30 text-white"
                      : "bg-zinc-800/30 hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full ring-1 ring-white/20"
                    style={{ backgroundColor: theme.background }}
                  />
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-800/50" />

          {/* Font Size */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Type className="h-4 w-4 text-emerald-400" />
              Font Size
            </label>
            <div className="flex items-center gap-4 bg-zinc-800/30 rounded-xl p-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
                className="h-9 w-9 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-white">{fontSize}</span>
                <span className="text-zinc-500 text-sm ml-1">px</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
                className="h-9 w-9 rounded-lg bg-zinc-700/50 hover:bg-zinc-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-zinc-800/50" />

          {/* Cursor Style */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <MousePointer2 className="h-4 w-4 text-purple-400" />
              Cursor Style
            </label>
            <div className="flex gap-2">
              {(["block", "underline", "bar"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => onCursorStyleChange(style)}
                  className={`flex-1 py-2.5 px-4 rounded-xl transition-all duration-200 text-sm font-medium capitalize ${
                    cursorStyle === style
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-600/20 ring-1 ring-purple-500/30 text-white"
                      : "bg-zinc-800/30 hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
