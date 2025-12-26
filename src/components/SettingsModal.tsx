import React from 'react';
import { themes } from '../themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (themeKey: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  cursorStyle: 'block' | 'underline' | 'bar';
  onCursorStyleChange: (style: 'block' | 'underline' | 'bar') => void;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div 
        className="bg-[#161b22] border border-blue-500/20 rounded-xl w-[400px] max-w-[90%] shadow-2xl flex flex-col animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-700/50">
          <h2 className="text-lg font-semibold text-neutral-100 m-0">Settings</h2>
          <button 
            className="bg-transparent border-none text-neutral-400 cursor-pointer p-1 rounded hover:bg-red-500/15 hover:text-red-400 transition-colors flex items-center justify-center" 
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-400 font-medium">Theme</label>
            <select 
              value={currentTheme} 
              onChange={(e) => onThemeChange(e.target.value)}
              className="bg-[#0d1117] border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md text-sm outline-none transition-colors cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            >
              {Object.entries(themes).map(([key, theme]) => (
                <option key={key} value={key}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-400 font-medium">Font Size ({fontSize}px)</label>
            <input 
              type="range" 
              min="10" 
              max="24" 
              step="1" 
              value={fontSize} 
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-400 font-medium">Cursor Style</label>
            <div className="flex gap-3 bg-[#0d1117] p-1 rounded-md border border-neutral-700">
              <label className={`flex-1 flex items-center justify-center p-2 cursor-pointer rounded text-[13px] text-neutral-400 transition-all relative ${cursorStyle === 'block' ? 'bg-[#21262d] text-neutral-100 font-medium' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="block" 
                  checked={cursorStyle === 'block'} 
                  onChange={() => onCursorStyleChange('block')}
                  className="hidden"
                />
                Block
              </label>
              <label className={`flex-1 flex items-center justify-center p-2 cursor-pointer rounded text-[13px] text-neutral-400 transition-all relative ${cursorStyle === 'bar' ? 'bg-[#21262d] text-neutral-100 font-medium' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="bar" 
                  checked={cursorStyle === 'bar'} 
                  onChange={() => onCursorStyleChange('bar')}
                   className="hidden"
                />
                Bar
              </label>
              <label className={`flex-1 flex items-center justify-center p-2 cursor-pointer rounded text-[13px] text-neutral-400 transition-all relative ${cursorStyle === 'underline' ? 'bg-[#21262d] text-neutral-100 font-medium' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="underline" 
                  checked={cursorStyle === 'underline'} 
                  onChange={() => onCursorStyleChange('underline')}
                   className="hidden"
                />
                Underline
              </label>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-neutral-700/50 flex justify-end">
          <button 
            className="bg-green-700 text-white border-none py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-green-600" 
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
