/** IDB Wrapper — isolated IndexedDB per area (Invariant #3) */
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
        const stores = ['projects', 'areas', 'resources', 'archives', 'metadata'];
        stores.forEach(s => {
          if (!db.objectStoreNames.contains(s)) {
            db.createObjectStore(s, { keyPath: s === 'metadata' ? 'key' : 'id' });
          }
        });
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
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) throw new Error('Unauthenticated access');

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('type', storeName);
      
      if (!error && data) {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        for (const item of data) {
          store.put(item);
        }
        return data as T[];
      }
    } catch (e) {
      console.warn(`Sync failed for ${this.tableName}, falling back to local`, e);
    }

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
    
    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        await supabase
          .from(this.tableName)
          .upsert({ ...(data as any), user_id: userId, type: storeName, updated_at: new Date().toISOString() });
      }
    } catch (e) {
      console.warn(`Supabase sync deferred for ${this.tableName}`, e);
    }
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    
    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.warn(`Delete sync deferred for ${this.tableName}`, e);
    }
  }

  async wipe(): Promise<void> {
    await this.init();
    const stores = Array.from(this.db!.objectStoreNames);
    if (stores.length === 0) return;
    
    const transaction = this.db!.transaction(stores, 'readwrite');
    stores.forEach(s => transaction.objectStore(s).clear());
    return new Promise((resolve) => {
      transaction.oncomplete = () => resolve();
    });
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

export const ldDBs: Record<string, DomainDB> = {
  ld01: ld01DB, ld02: ld02DB, ld03: ld03DB, ld04: ld04DB,
  ld05: ld05DB, ld06: ld06DB, ld07: ld07DB, ld08: ld08DB
};
