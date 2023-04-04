/// <reference types="vite/client" />

interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}