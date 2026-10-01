import { JSDOM } from 'jsdom';
import 'fake-indexeddb/auto';
import assert from 'assert';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).localStorage = dom.window.localStorage;

import { DomainDB } from '../src/lib/idb.js';
import { supabase } from '../src/lib/supabase.js';

async function resetBackoff(testDb: any) {
  const txHack = testDb['db'].transaction('outbox', 'readwrite');
  const storeHack = txHack.objectStore('outbox');
  const itemsReq = storeHack.getAll();
  await new Promise((res) => {
    itemsReq.onsuccess = () => {
       const items = itemsReq.result;
       for (const item of items) {
          item.retryCount = 0;
          item.lastAttemptAt = 0;
          storeHack.put(item);
       }
       res(null);
    };
  });
}

async function runTests() {
  console.log('Starting offline sync/outbox tests...');
  
  const tables = [
    'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
    'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact'
  ];

  for (const table of tables) {
    console.log(`\n--- Testing table: ${table} ---`);

    // 1. Setup mock Supabase
    let serverDb: any[] = [];
    let simulateCloudOffline = true;
    let supabaseUpsertCalls = 0;

    // Mock supabase session and from()
    (supabase.auth as any) = {
      getSession: async () => ({
        data: { session: { user: { id: 'test-user-123' } } }
      }),
      getUser: async () => ({
        data: { user: { id: 'test-user-123' } }
      })
    };

    (supabase.from as any) = (tableName: string) => ({
      select: (cols: string) => {
         const chain: any = {
           eq: (field: string, val: string) => {
               return {
                  maybeSingle: async () => {
                    if (simulateCloudOffline) return { data: null, error: { message: 'Network offline' } };
                    const item = serverDb.find(i => i.id === val);
                    return { data: item || null, error: null };
                  }
               }
           },
           is: (field: string, val: any) => ({
               or: () => ({
                  data: serverDb, error: null
               })
           }),
           or: () => chain // stub for getAll query logic
         };
         return chain;
      },
      upsert: async (payload: any, options: any) => {
         if (simulateCloudOffline) return { error: { message: 'Network offline' } };
         supabaseUpsertCalls++;
         
         const toUpsert = Array.isArray(payload) ? payload : [payload];
         for (const item of toUpsert) {
           const existingIndex = serverDb.findIndex(i => i.id === item.id);
           if (existingIndex >= 0) {
              serverDb[existingIndex] = item;
           } else {
              serverDb.push(item);
           }
         }
         return { data: payload, error: null };
      }
    });

    const testDb = new DomainDB(`aspace_${table}_test`);
    await testDb.wipe(); // clear old IDB test state
    await testDb.init();

    // Test 1: Local write while cloud unavailable
    console.log(`[${table}] Test 1: local write while cloud unavailable...`);
    simulateCloudOffline = true;
    await testDb.put('projects', { id: 'proj-1', title: 'Offline Project', version: 0 });
    
    const projects = await testDb.getAll<any>('projects');
    assert.strictEqual(projects.length, 1);
    assert.strictEqual(projects[0].title, 'Offline Project');
    assert.strictEqual(supabaseUpsertCalls, 0); // No successful syncs yet

    // Verify it's in the outbox
    const outboxEntries = await getOutboxEntries(testDb);
    assert.strictEqual(outboxEntries.length, 1, 'Should have 1 entry in outbox');

    // Test 2: Restart / Reconnect Behavior & Outbox Replay exactly once
    console.log(`[${table}] Test 2: Reconnect and process outbox exactly once...`);
    simulateCloudOffline = false;
    
    // Need to process outbox explicitly as background async calls might not trigger synchronously
    const { processOutbox } = await import('../src/lib/outbox/sync.js');
    
    // Call process outbox (which internally checks for pending outbox items and upserts them)
    const idbInstance = testDb['db'];
    
    await resetBackoff(testDb);
    await processOutbox(idbInstance, `${table}_test`, 'test-user-123');

    // Verify the outbox is now empty
    const afterOutbox = await getOutboxEntries(testDb);
    assert.strictEqual(afterOutbox.length, 0, 'Outbox should be empty after sync');
    assert.strictEqual(supabaseUpsertCalls, 1, 'Supabase should be called exactly once');

    // Test 3: No duplicate cloud effect
    console.log(`[${table}] Test 3: No duplicate cloud effect...`);
    await resetBackoff(testDb);
    await processOutbox(idbInstance, `${table}_test`, 'test-user-123');
    assert.strictEqual(supabaseUpsertCalls, 1, 'Supabase upsert should still be 1 (idempotent outbox)');
    
    // Test 4: Tombstone is not resurrected
    console.log(`[${table}] Test 4: Tombstone is not resurrected...`);
    simulateCloudOffline = true; // Go offline
    await testDb.delete('projects', 'proj-1'); // Logical delete
    
    const currentProjects = await testDb.getAll<any>('projects');
    assert.strictEqual(currentProjects.length, 0, 'Project should be deleted locally (filtered by _deleted)');
    
    // Verify outbox has the delete intent
    const deleteOutbox = await getOutboxEntries(testDb);
    assert.strictEqual(deleteOutbox.length, 1, 'Should have delete intent in outbox');
    assert.strictEqual(deleteOutbox[0].operation, 'delete');

    simulateCloudOffline = false; // Reconnect
    await resetBackoff(testDb);
    await processOutbox(idbInstance, `${table}_test`, 'test-user-123'); // Sync delete to cloud
    
    // The serverDb should now have the _deleted: true flag
    const serverItem = serverDb.find(i => i.id === 'proj-1');
    assert.strictEqual(serverItem._deleted, true, 'Server item should be marked as tombstone');
    assert.strictEqual(serverItem.version, 2, 'Version should be bumped');

    // Now let's simulate fetching all from DB, the tombstone shouldn't be returned by getAll
    const syncedProjects = await testDb.getAll<any>('projects');
    assert.strictEqual(syncedProjects.length, 0, 'Tombstone should not resurrect in IDB');

    // Test 5: Version / conflict semantics remain explicit
    console.log(`[${table}] Test 5: Version / conflict semantics remain explicit...`);
    
    // Simulate a newer version on the server (e.g., from another device)
    serverDb.push({ id: 'proj-2', title: 'Server Project', version: 5, _deleted: false });
    
    // Try to write locally with an older version
    simulateCloudOffline = true;
    await testDb.put('projects', { id: 'proj-2', title: 'Local Overwrite Attempt', version: 0 }); // Becomes version 1
    
    const overrideOutbox = await getOutboxEntries(testDb);
    assert.strictEqual(overrideOutbox.length, 1);
    
    simulateCloudOffline = false;
    await resetBackoff(testDb);
    await processOutbox(idbInstance, `${table}_test`, 'test-user-123');
    
    // The outbox sync should have detected the conflict and updated the status to 'conflict'
    const conflictOutbox = await getOutboxEntries(testDb, true);
    assert.strictEqual(conflictOutbox.length, 1);
    assert.strictEqual(conflictOutbox[0].status, 'conflict', 'Outbox item should be marked as conflict');
  }

  console.log('\n✅ All sync tests passed deterministically for all 8 tables.');
  process.exit(0);
}

// Helper to get raw outbox entries
async function getOutboxEntries(domainDb: any, includeConflicts: boolean = false) {
  const db = domainDb.db;
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction('outbox', 'readonly');
    const store = tx.objectStore('outbox');
    const req = store.getAll();
    req.onsuccess = () => {
       const all = req.result as any[];
       if (includeConflicts) resolve(all);
       else resolve(all.filter((e: any) => e.status !== 'conflict'));
    };
    req.onerror = () => reject(req.error);
  });
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
