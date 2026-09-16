/** IDB Wrapper — isolated IndexedDB per area (Invariant #3) */
import { supabase } from './supabase';

export class DomainDB {
  private dbName: string;
  private tableName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, version: number = 2) {
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
        const stores = ['projects', 'areas', 'resources', 'archives', 'metadata', 'items'];
        stores.forEach(s => {
          if (!db.objectStoreNames.contains(s)) {
            db.createObjectStore(s, { keyPath: s === 'metadata' ? 'key' : 'id' });
          }
        });
        if (!db.objectStoreNames.contains('outbox')) {
          db.createObjectStore('outbox', { keyPath: 'idempotencyKey' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init();
    
    // Background sync with Supabase
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        let query = supabase.from(this.tableName).select('*');
        if (storeName && storeName !== 'items') {
          query = query.or(`type.eq.${storeName},type.is.null`);
        }
        if (userId && userId !== 'amadeus-admiral') {
          query = query.or(`user_id.eq.${userId},user_id.is.null`);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          const transaction = this.db!.transaction([storeName, 'outbox'], 'readwrite');
          const store = transaction.objectStore(storeName);
          const outboxStore = transaction.objectStore('outbox');

          // Check outbox entries to avoid overwriting pending local changes
          const pendingEntriesRequest = outboxStore.getAll();

          pendingEntriesRequest.onsuccess = () => {
            const pending = pendingEntriesRequest.result as any[];
            // Only apply server data if there isn't a pending local outbox entry for that item
            // or if the server version is strictly greater.
            for (const item of data) {
               const hasPendingLocal = pending.find(p => p.payload.id === item.id && p.storeName === storeName);

               if (!hasPendingLocal) {
                 // Even without a pending local queue, do not blindly overwrite if local DB has a HIGHER version (e.g. outbox cleared but sync delay, or older server snapshot replayed)
                 const req = store.get(item.id);
                 req.onsuccess = () => {
                    const localItem = req.result;
                    if (!localItem || item.version >= (localItem.version || 0)) {
                      store.put(item);
                    }
                 };
               }
            }
          };
        }
      } catch (e) {
        console.warn(`Sync failed for ${this.tableName}, deferred.`, e);
      }
    })();

    // Always attempt outbox sync in the background
    (async () => {
       try {
         const { data: { session } } = await supabase.auth.getSession();
         const userId = session?.user?.id;
         if (userId && this.db) {
            const { processOutbox } = await import('./outbox/sync');
            await processOutbox(this.db, this.tableName, userId);
         }
       } catch (e) {}
    })();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result as any[];
        // Filter out tombstones
        resolve(results.filter(item => !item._deleted) as T[]);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async put<T extends { id?: string, version?: number }>(storeName: string, data: T): Promise<void> {
    await this.init();
    
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const id = data.id || crypto.randomUUID();
    const existing = await this.get<any>(storeName, id);
    const version = (existing?.version || 0) + 1;
    const finalData = { ...data, id, version };

    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName, 'outbox'], 'readwrite');

      const store = transaction.objectStore(storeName);
      const storeRequest = store.put(finalData);

      if (userId) {
        const outboxStore = transaction.objectStore('outbox');
        const entry = {
           idempotencyKey: crypto.randomUUID(),
           storeName,
           operation: 'put',
           payload: finalData,
           userId,
           version,
           status: 'pending',
           retryCount: 0,
           createdAt: Date.now()
        };
        outboxStore.put(entry);
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    if (userId && this.db) {
      const { processOutbox } = await import('./outbox/sync');
      processOutbox(this.db, this.tableName, userId).catch(() => {});
    }
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const existing = await this.get<any>(storeName, id);
    if (!existing) return; // Nothing to delete

    const version = (existing.version || 0) + 1;
    const tombstoneData = { ...existing, _deleted: true, version };


    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName, 'outbox'], 'readwrite');

      // We do a logical delete (tombstone) locally
      const store = transaction.objectStore(storeName);
      store.put(tombstoneData);

      if (userId) {
        const outboxStore = transaction.objectStore('outbox');
        const entry = {
           idempotencyKey: crypto.randomUUID(),
           storeName,
           operation: 'delete', // Or put, since syncToSupabase treats them the same for upserting tombstones
           payload: tombstoneData,
           userId,
           version,
           status: 'pending',
           retryCount: 0,
           createdAt: Date.now()
        };
        outboxStore.put(entry);
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    if (userId && this.db) {
      const { processOutbox } = await import('./outbox/sync');
      processOutbox(this.db, this.tableName, userId).catch(() => {});
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
