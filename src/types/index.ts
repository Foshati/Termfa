export interface Host {
  id: string;
  label: string;
  hostname: string;
  port: number;
  username: string;
  authType: "password" | "key" | "agent";
  password?: string;
  keyPath?: string;
  tags?: string[];
  group?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

// Re-export session types
export * from "./session";
