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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="setting-group">
            <label>Theme</label>
            <select 
              value={currentTheme} 
              onChange={(e) => onThemeChange(e.target.value)}
              className="setting-select"
            >
              {Object.entries(themes).map(([key, theme]) => (
                <option key={key} value={key}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label>Font Size ({fontSize}px)</label>
            <input 
              type="range" 
              min="10" 
              max="24" 
              step="1" 
              value={fontSize} 
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="setting-range"
            />
          </div>

          <div className="setting-group">
            <label>Cursor Style</label>
            <div className="radio-group">
              <label className={`radio-option ${cursorStyle === 'block' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="block" 
                  checked={cursorStyle === 'block'} 
                  onChange={() => onCursorStyleChange('block')}
                />
                Block
              </label>
              <label className={`radio-option ${cursorStyle === 'bar' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="bar" 
                  checked={cursorStyle === 'bar'} 
                  onChange={() => onCursorStyleChange('bar')}
                />
                Bar
              </label>
              <label className={`radio-option ${cursorStyle === 'underline' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="cursorStyle" 
                  value="underline" 
                  checked={cursorStyle === 'underline'} 
                  onChange={() => onCursorStyleChange('underline')}
                />
                Underline
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
