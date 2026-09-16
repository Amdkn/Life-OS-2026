import { supabase } from '../supabase';
import type { OutboxEntry, SyncResult } from './types';

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

export async function processOutbox(db: IDBDatabase, tableName: string, currentUserId: string | null): Promise<void> {
  if (!currentUserId) return;

  const outboxEntries = await getPendingEntries(db, currentUserId);

  if (outboxEntries.length === 0) return;

  for (const entry of outboxEntries) {
    if (shouldRetry(entry)) {
      await processEntry(db, tableName, entry);
    }
  }
}

async function getPendingEntries(db: IDBDatabase, userId: string): Promise<OutboxEntry[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('outbox', 'readonly');
    const store = transaction.objectStore('outbox');
    const request = store.getAll();

    request.onsuccess = () => {
      const allEntries = request.result as OutboxEntry[];
      // Filter by userId to ensure isolation between profiles
      resolve(allEntries.filter(entry => entry.userId === userId));
    };
    request.onerror = () => reject(request.error);
  });
}

function shouldRetry(entry: OutboxEntry): boolean {
  if (entry.status !== 'pending' && entry.status !== 'error') return false;
  if (entry.retryCount >= MAX_RETRIES) return false;

  if (entry.lastAttemptAt) {
    const backoffMs = BASE_BACKOFF_MS * Math.pow(2, entry.retryCount);
    if (Date.now() - entry.lastAttemptAt < backoffMs) {
      return false;
    }
  }
  return true;
}

async function processEntry(db: IDBDatabase, tableName: string, entry: OutboxEntry): Promise<void> {
  // Mark as syncing
  await updateEntryStatus(db, entry.idempotencyKey, {
    status: 'syncing',
    lastAttemptAt: Date.now()
  });

  try {
    const result = await syncToSupabase(tableName, entry);

    if (result.success) {
      // Remove from outbox on success
      await removeEntry(db, entry.idempotencyKey);
    } else if (result.conflict) {
      // Mark as conflict, do not retry automatically, needs manual resolution or overwrites local
      await updateEntryStatus(db, entry.idempotencyKey, { status: 'conflict' });
    } else {
      // General error, increment retry
      await updateEntryStatus(db, entry.idempotencyKey, {
        status: 'error',
        retryCount: entry.retryCount + 1,
        lastAttemptAt: Date.now()
      });
    }
  } catch (error) {
    console.error(`Failed to sync entry ${entry.idempotencyKey}`, error);
    await updateEntryStatus(db, entry.idempotencyKey, {
      status: 'error',
      retryCount: entry.retryCount + 1,
      lastAttemptAt: Date.now()
    });
  }
}

async function syncToSupabase(tableName: string, entry: OutboxEntry): Promise<SyncResult> {
  // We use updated_at as idempotency timestamp, and version for concurrency
  const payload = {
    ...entry.payload,
    user_id: entry.userId,
    type: entry.storeName,
    updated_at: new Date(entry.createdAt).toISOString() // Use creation time of operation
  };

  if (entry.operation === 'put' || entry.operation === 'delete') {
    // We treat logical deletes as puts to Supabase as well, passing the _deleted flag and version

    // First, check server version to prevent silent overwrites of newer data
    const { data: serverItem, error: fetchError } = await supabase
      .from(tableName)
      .select('version')
      .eq('id', payload.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is multiple rows or zero rows sometimes depending on Postgrest
        return { success: false, error: fetchError.message };
    }

    if (serverItem && serverItem.version > entry.version) {
       // Server has newer version. Conflict!
       return { success: false, conflict: true };
    }

    // Upsert payload (handles both inserts and updates)
    const { error } = await supabase
      .from(tableName)
      .upsert(payload, { onConflict: 'id' }); // Assuming 'id' is unique constraint

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  return { success: false, error: 'Unknown operation' };
}

async function updateEntryStatus(db: IDBDatabase, idempotencyKey: string, updates: Partial<OutboxEntry>): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('outbox', 'readwrite');
    const store = transaction.objectStore('outbox');
    const getRequest = store.get(idempotencyKey);

    getRequest.onsuccess = () => {
      const entry = getRequest.result as OutboxEntry;
      if (entry) {
        const updatedEntry = { ...entry, ...updates };
        const putRequest = store.put(updatedEntry);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve(); // Entry might have been deleted, ignore
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function removeEntry(db: IDBDatabase, idempotencyKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('outbox', 'readwrite');
    const store = transaction.objectStore('outbox');
    const request = store.delete(idempotencyKey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
