// @ts-ignore
process.env.VITE_SUPABASE_URL = "https://test";
process.env.VITE_SUPABASE_ANON_KEY = "test";
const _global = globalThis as any;
_global.import = { meta: { env: { VITE_SUPABASE_URL: "https://test", VITE_SUPABASE_ANON_KEY: "test" } } };
import 'fake-indexeddb/auto';
import { DomainDB } from '../src/lib/idb';
import { processOutbox } from '../src/lib/outbox/sync';
import type { OutboxEntry } from '../src/lib/outbox/types';

// Mock supabase dependency
const mockSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: { user: { id: 'test-user-a' } } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({
          data: { version: 0 },
          error: null
        })
      }),
      or: () => ({
        or: async () => ({
           data: [],
           error: null
        })
      })
    }),
    upsert: async () => ({ error: null }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
};

// Override supabase module path or replace global
import * as supabaseModule from "../src/lib/supabase";
// we will overwrite methods instead
Object.assign((supabaseModule as any).supabase, mockSupabase);

// We use vitest/jest if available, but let's build a standalone script using tsx directly
const testDB = new DomainDB('aspace_ld99_test', 2);

async function runTest() {
  console.log('--- STARTING OFFLINE RECOVERY TESTS ---');

  // Test 1: Network cut -> Write -> Data & Outbox preserved
  console.log('Test 1: Writing offline data...');

  // We'll stub the fetch/network by intercepting supabase
  const originalUpsert = supabaseModule.supabase.from("test").upsert;
  let upsertCalled = false;
  supabaseModule.supabase.from = () => ({
    ...originalUpsert,
    select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { version: 0 }, error: null })
        }),
        or: () => ({
           or: async () => ({ data: [], error: null })
        })
    }),
    upsert: async (payload: any) => {
        upsertCalled = true;
        return { error: { message: 'Network offline' } }; // Simulate failure
    },
    delete: () => ({ eq: async () => ({ error: null }) })
  } as any);

  await testDB.put<any>('projects', { title: 'Offline Project', description: 'Should queue' });

  let projects = await testDB.getAll<any>('projects');
  if (projects.length !== 1 || projects[0].title !== 'Offline Project') {
      throw new Error('Test 1 Failed: Item not written locally');
  }

  // Verify outbox
  await new Promise(r => setTimeout(r, 100)); // wait for background processes
  let outbox = await getOutboxEntries();
  if (outbox.length !== 1 || outbox[0].status !== 'error') {
      console.log('Outbox state:', outbox);
      throw new Error('Test 1 Failed: Outbox entry not created or not set to error after network fail');
  }

  // Simulate restart/re-init
  console.log('Restarting DB connection...');
  await testDB.init();

  // Test 2: Network restored -> Process Outbox -> Outbox cleared
  console.log('Test 2: Restoring network and processing outbox...');
  supabaseModule.supabase.from = () => ({
    ...originalUpsert,
    select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { version: 0 }, error: null })
        }),
        or: () => ({
           or: async () => ({ data: [], error: null })
        })
    }),
    upsert: async (payload: any) => {
        return { error: null }; // Success
    },
    delete: () => ({ eq: async () => ({ error: null }) })
  } as any);

  // We manually call it to simulate the background sync picking it up, or app start
  const dbReq = indexedDB.open('aspace_ld99_test', 2);
  const db = await new Promise<IDBDatabase>((resolve) => {
      dbReq.onsuccess = () => resolve(dbReq.result);
  });

  // Fake passing time so exponential backoff allows retry
  outbox[0].lastAttemptAt = Date.now() - 5000;
  await updateOutboxEntry(db, outbox[0]);

  await processOutbox(db, 'ld99_test', 'test-user-a');
  outbox = await getOutboxEntries();

  if (outbox.length !== 0) {
      throw new Error('Test 2 Failed: Outbox not cleared after successful sync');
  }

  // Test 3: Deleted item remains deleted (tombstone)
  console.log('Test 3: Logical deletion (Tombstones)...');
  const project = (await testDB.getAll<any>('projects'))[0];
  await testDB.delete('projects', project.id);

  projects = await testDB.getAll<any>('projects');
  if (projects.length !== 0) {
      throw new Error('Test 3 Failed: Item still returned by getAll after logical delete');
  }

  // Check raw DB to ensure tombstone exists
  const rawProjects = await getRawEntries('projects');
  if (rawProjects.length !== 1 || rawProjects[0]._deleted !== true || rawProjects[0].version !== 2) {
      throw new Error('Test 3 Failed: Tombstone not created correctly');
  }

  // Test 3b: Replay old server snapshot -> Deleted item remains deleted (tombstone wins)
  console.log('Test 3b: Replaying old server snapshot...');

  // Set up the fetch to return an old version of the item that is NOT deleted
  mockSupabase.from = () => ({
    ...originalUpsert,
    select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { version: 0 }, error: null })
        }),
        or: () => ({
           or: async () => ({
             data: [{ ...rawProjects[0], _deleted: undefined, version: 1 }],
             error: null
           })
        })
    }),
    upsert: async () => ({ error: null }),
    delete: () => ({ eq: async () => ({ error: null }) })
  } as any);

  // We manually call the background sync by invoking getAll
  await testDB.getAll<any>('projects');
  await new Promise(r => setTimeout(r, 100)); // wait for background sync

  projects = await testDB.getAll<any>('projects');
  if (projects.length !== 0) {
      throw new Error('Test 3b Failed: Old server snapshot resurrected a deleted item');
  }

  // Test 4: Concurrency conflict
  console.log('Test 4: Concurrency conflict resolution...');

  // Setup conflict: server version is higher than our attempt
  supabaseModule.supabase.from = () => ({
    ...originalUpsert,
    select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { version: 99 }, error: null }) // Server has newer
        }),
        or: () => ({
           or: async () => ({ data: [], error: null })
        })
    }),
    upsert: async () => ({ error: null }),
    delete: () => ({ eq: async () => ({ error: null }) })
  } as any);

  await testDB.put<any>('projects', { title: 'Conflict Project' });

  // Wait a tick for background sync in put to finish processing
  await new Promise(r => setTimeout(r, 100));

  outbox = await getOutboxEntries();
  if (outbox.length !== 1 || outbox[0].status !== 'conflict') {
      console.log('Outbox state:', outbox);
      throw new Error('Test 4 Failed: Conflict not detected or status not set');
  }

  // Test 5: Profile switch isolation
  console.log('Test 5: Profile isolation...');
  // Current user is 'test-user-a', pending entry belongs to 'test-user-a'

  // Reset conflict entry for user A
  outbox[0].status = 'pending';
  outbox[0].userId = 'test-user-a';
  await updateOutboxEntry(db, outbox[0]);

  // Attempt to sync as User B
  await processOutbox(db, 'ld99_test', 'test-user-b');

  outbox = await getOutboxEntries();
  // Should still be pending because User B should not process User A's queues
  if (outbox[0].status !== 'pending') {
      throw new Error('Test 5 Failed: User B processed User A outbox queue');
  }

  console.log('--- ALL TESTS PASSED SUCCESSFULLY ---');
  process.exit(0);
}

// Helpers for raw indexedDB access
async function getOutboxEntries(): Promise<OutboxEntry[]> {
  return new Promise((resolve) => {
    const req = indexedDB.open('aspace_ld99_test', 2);
    req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('outbox', 'readonly');
        const store = tx.objectStore('outbox');
        const getAllReq = store.getAll();
        getAllReq.onsuccess = () => resolve(getAllReq.result as OutboxEntry[]);
    }
  });
}

async function getRawEntries(storeName: string): Promise<any[]> {
    return new Promise((resolve) => {
      const req = indexedDB.open('aspace_ld99_test', 2);
      req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const getAllReq = store.getAll();
          getAllReq.onsuccess = () => resolve(getAllReq.result as any[]);
      }
    });
}

async function updateOutboxEntry(db: IDBDatabase, entry: OutboxEntry): Promise<void> {
    return new Promise((resolve) => {
        const tx = db.transaction('outbox', 'readwrite');
        const store = tx.objectStore('outbox');
        const req = store.put(entry);
        req.onsuccess = () => resolve();
    });
}

runTest().catch(e => {
    console.error(e);
    process.exit(1);
});
