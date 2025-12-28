import { Host, Folder, Tab, LayoutPreset, TerminalSession } from "../types";

const HOSTS_KEY = "termfa_hosts";
const FOLDERS_KEY = "termfa_folders";
const TABS_KEY = "termfa_tabs";
const LAYOUTS_KEY = "termfa_layouts";
const SETTINGS_KEY = "termfa_settings";

// ============ Hosts ============

export const getHosts = (): Host[] => {
  const data = localStorage.getItem(HOSTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveHosts = (hosts: Host[]) => {
  localStorage.setItem(HOSTS_KEY, JSON.stringify(hosts));
};

// ============ Folders ============

export const getFolders = (): Folder[] => {
  const data = localStorage.getItem(FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFolders = (folders: Folder[]) => {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

// ============ Tabs & Sessions ============

export interface SavedTabState {
  tabs: Tab[];
  activeTabId: string;
  sessions: TerminalSession[];
}

export const getTabState = (): SavedTabState | null => {
  const data = localStorage.getItem(TABS_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveTabState = (state: SavedTabState) => {
  localStorage.setItem(TABS_KEY, JSON.stringify(state));
};

export const clearTabState = () => {
  localStorage.removeItem(TABS_KEY);
};

// ============ Layout Presets ============

export const getLayoutPresets = (): LayoutPreset[] => {
  const data = localStorage.getItem(LAYOUTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLayoutPresets = (presets: LayoutPreset[]) => {
  localStorage.setItem(LAYOUTS_KEY, JSON.stringify(presets));
};

export const addLayoutPreset = (preset: LayoutPreset) => {
  const presets = getLayoutPresets();
  presets.push(preset);
  saveLayoutPresets(presets);
};

export const deleteLayoutPreset = (id: string) => {
  const presets = getLayoutPresets().filter((p) => p.id !== id);
  saveLayoutPresets(presets);
};

// ============ Settings ============

export interface AppSettings {
  theme: string;
  fontSize: number;
  cursorStyle: "block" | "underline" | "bar";
  restoreTabsOnStart: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "default",
  fontSize: 14,
  cursorStyle: "block",
  restoreTabsOnStart: true,
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<AppSettings>) => {
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
};
