/** IDB Wrapper — isolated IndexedDB per area (Invariant #3) */
// D6 fix 2026-06-23 (V0.7.6) : module-level singleton cache so multiple DomainDB instances
// share the same IDBDatabase connection. Without this, HMR Vite rebuild creates orphan
// instances with stale `this.db` references → transaction() throws InvalidStateError →
// empty IDB at hydrate time. Shared promise cache = atomic init, immune to HMR.
const dbCache: Map<string, Promise<IDBDatabase>> = new Map();

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

    let dbPromise = dbCache.get(this.dbName);
    if (!dbPromise) {
      dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // D6 fix V0.7.8 (2026-06-23) : add 'items' + 'metrics' + 'overview' stores.
          // Root cause V0.7.7 smoke test (Playwright 2026-06-23 20:35 UTC) :
          // 9 NotFoundError console errors from readFromLD(ld, 'overview'/'metrics'/'items')
          // because LDStore type union declared 7 stores but init() only created 5.
          // Result: V0.7.6/V0.7.7 auto-seed never triggered → "No items identified".
          const stores = ['projects', 'areas', 'resources', 'archives', 'metadata', 'items', 'metrics', 'overview'];
          stores.forEach(s => {
            if (!db.objectStoreNames.contains(s)) {
              db.createObjectStore(s, { keyPath: s === 'metadata' ? 'key' : 'id' });
            }
          });
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // D6 fix V0.7.6 : close handler so cache stays fresh if browser closes connection
          db.onclose = () => {
            dbCache.delete(this.dbName);
          };
          resolve(db);
        };

        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error(`IDB open blocked for ${this.dbName}`));
      });
      dbCache.set(this.dbName, dbPromise);
    }

    this.db = await dbPromise;
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
// D6 fix V0.7.8 (2026-06-23) : bump version 1 → 2 to force onupgradeneeded
// on browsers that already have v1 IDB open (without 'items'/'metrics'/'overview' stores).
export const ld01DB = new DomainDB('aspace_ld01_business', 2);
export const ld02DB = new DomainDB('aspace_ld02_finance', 2);
export const ld03DB = new DomainDB('aspace_ld03_health', 2);
export const ld04DB = new DomainDB('aspace_ld04_cognition', 2);
export const ld05DB = new DomainDB('aspace_ld05_relations', 2);
export const ld06DB = new DomainDB('aspace_ld06_habitat', 2);
export const ld07DB = new DomainDB('aspace_ld07_creativity', 2);
export const ld08DB = new DomainDB('aspace_ld08_impact', 2);

export const ldDBs: Record<string, DomainDB> = {
  ld01: ld01DB, ld02: ld02DB, ld03: ld03DB, ld04: ld04DB,
  ld05: ld05DB, ld06: ld06DB, ld07: ld07DB, ld08: ld08DB
};
