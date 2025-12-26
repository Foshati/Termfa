import { Host, Folder } from "../types";

const HOSTS_KEY = "termfa_hosts";
const FOLDERS_KEY = "termfa_folders";

export const getHosts = (): Host[] => {
  const data = localStorage.getItem(HOSTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveHosts = (hosts: Host[]) => {
  localStorage.setItem(HOSTS_KEY, JSON.stringify(hosts));
};

export const getFolders = (): Folder[] => {
  const data = localStorage.getItem(FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFolders = (folders: Folder[]) => {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};
