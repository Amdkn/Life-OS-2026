/** IDB Wrapper — isolated IndexedDB per area (D5/P3.1) */
import { supabase } from './supabase';

export class DomainDB {
  private dbName: string;
  private tableName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number = 1) {
    this.dbName = dbName;
    this.version = version;
    this.tableName = dbName.replace('aspace_', '');
  }

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Default PARA structure for LD01-LD08
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('areas'))    db.createObjectStore('areas',    { keyPath: 'id' });
        if (!db.objectStoreNames.contains('resources'))db.createObjectStore('resources',{ keyPath: 'id' });
        if (!db.objectStoreNames.contains('archives')) db.createObjectStore('archives', { keyPath: 'id' });
        
        // Universal metadata/settings
        if (!db.objectStoreNames.contains('metadata')) db.createObjectStore('metadata', { keyPath: 'key' });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init();
    
    // 1. Force pull from Supabase (Source of Truth)
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('type', storeName);
      
      if (!error && data) {
        // Sync local cache for next offline run
        for (const item of data) {
          const transaction = this.db!.transaction(storeName, 'readwrite');
          transaction.objectStore(storeName).put(item);
        }
        return data as T[];
      }
    } catch (e) {
      console.warn(`Initial pull failed for ${this.tableName}`, e);
    }

    // 2. Fallback to Local IDB
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    await this.init();
    
    // 1. Local Write (Immediate)
    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // 2. Global Sync (Fire-and-forget for UI performance)
    try {
      // In a real local-first app, we'd queue this, but for now we try directly
      const { error } = await supabase
        .from(this.tableName)
        .upsert({ 
          ...(data as any), 
          // Metadata to help routing if we use a shared table, but we use per-domain tables
          type: storeName,
          updated_at: new Date().toISOString()
        });
      
      if (error) console.error(`Sync error for ${this.tableName}:`, error);
    } catch (e) {
      console.warn(`Supabase unreachable for ${this.tableName}`, e);
    }
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    
    // 1. Local Delete
    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // 2. Global Sync
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) console.error(`Delete sync error for ${this.tableName}:`, error);
    } catch (e) {
      console.warn(`Supabase unreachable for delete on ${this.tableName}`, e);
    }
  }
}

// Global instances for Areas LD01-LD08
export const ld01DB = new DomainDB('aspace_ld01_business');
export const ld02DB = new DomainDB('aspace_ld02_finance');
export const ld03DB = new DomainDB('aspace_ld03_health');
export const ld04DB = new DomainDB('aspace_ld04_cognition');
export const ld05DB = new DomainDB('aspace_ld05_relations');
export const ld06DB = new DomainDB('aspace_ld06_habitat');
export const ld07DB = new DomainDB('aspace_ld07_creativity');
export const ld08DB = new DomainDB('aspace_ld08_impact');
