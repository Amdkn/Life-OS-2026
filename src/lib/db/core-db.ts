/** Core Database — IndexedDB initialization for aspace-ld00 (Core Meta) */

const DB_NAME = 'aspace-ld00';
const DB_VERSION = 1;

export interface CoreDB {
  id: string;
  key: string;
  value: any;
  updatedAt: number;
}

/** Initialize the Core meta database */
export async function initCoreDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("A'Space: Failed to open Core DB (LD00)");
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store for global settings and meta-states
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Store for app-specific persistent data
      if (!db.objectStoreNames.contains('appData')) {
        const appStore = db.createObjectStore('appData', { keyPath: 'id' });
        appStore.createIndex('appId', 'appId', { unique: false });
      }

      // Store for agent memory logs
      if (!db.objectStoreNames.contains('agentMemory')) {
        db.createObjectStore('agentMemory', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
