import assert from 'assert';
import { db, initDb } from '../../server/blackboard/db.js';
import { app } from '../../server/blackboard/index.js';
import { Server } from 'http';
import * as client from '../../src/lib/blackboard/client.js';

let server: Server;
const PORT = 4445;

async function runTests() {
  console.log('Starting integration tests for Blackboard...');

  // Clean db
  db.exec('DELETE FROM artifacts; DELETE FROM events; DELETE FROM workspaces; DELETE FROM locks;');

  // Start the Express server
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      resolve();
    });
  });

  try {
    // 1. Test Workspaces
    console.log('Testing Workspaces...');
    const ws: client.Workspace = {
      id: 'ws-123',
      name: 'Test Workspace',
      domain_id: 'dom-1',
      status: 'active',
      linear_team_id: 'lin-team',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await client.createWorkspace(ws);
    const workspaces = await client.getWorkspaces();
    assert.strictEqual(workspaces.length, 1);
    assert.strictEqual(workspaces[0].id, 'ws-123');

    // 2. Test Events
    console.log('Testing Events...');
    const ev: client.BlackboardEvent = {
      id: 'ev-1',
      workspace_id: 'ws-123',
      actor_id: 'a1-morty',
      actor_layer: 'A1',
      event_type: 'test_event',
      payload_json: JSON.stringify({ message: 'hello world' }),
      timestamp: Date.now(),
    };
    await client.appendEvent(ev);
    const events = await client.getEvents('ws-123');
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].id, 'ev-1');
    assert.strictEqual(JSON.parse(events[0].payload_json).message, 'hello world');

    // 3. Test Locks (Acquire & Conflict)
    console.log('Testing Locks...');
    const lock: client.Lock = {
      id: 'lock-1',
      resource_key: 'test_resource',
      locked_by: 'a1-morty',
      expires_at: Date.now() + 10000, // 10 seconds in future
    };

    const acquired = await client.acquireLock(lock);
    assert.strictEqual(acquired, true, 'Should acquire a new lock');

    // Second lock attempt on same resource
    const lock2: client.Lock = {
      id: 'lock-2',
      resource_key: 'test_resource',
      locked_by: 'a2-discovery',
      expires_at: Date.now() + 10000,
    };
    const acquired2 = await client.acquireLock(lock2);
    assert.strictEqual(acquired2, false, 'Should fail to acquire an already held lock');

    // Release lock
    const released = await client.releaseLock('test_resource', 'a1-morty');
    assert.strictEqual(released, true, 'Should successfully release lock');

    // Acquire lock again
    const acquired3 = await client.acquireLock(lock2);
    assert.strictEqual(acquired3, true, 'Should acquire lock after it was released');

    // 4. Test Lock TTL (Expiration)
    console.log('Testing Lock TTL...');
    const expiredLock: client.Lock = {
      id: 'lock-3',
      resource_key: 'ttl_resource',
      locked_by: 'a1-morty',
      expires_at: Date.now() - 1000, // Expired 1 second ago
    };
    // Direct DB insertion to bypass application time logic on insert
    db.prepare('INSERT INTO locks (id, resource_key, locked_by, expires_at) VALUES (?, ?, ?, ?)').run(
      expiredLock.id, expiredLock.resource_key, expiredLock.locked_by, expiredLock.expires_at
    );

    // Try to acquire the same resource, it should succeed because the previous one is expired
    const newLock: client.Lock = {
      id: 'lock-4',
      resource_key: 'ttl_resource',
      locked_by: 'a2-discovery',
      expires_at: Date.now() + 10000,
    };
    const acquired4 = await client.acquireLock(newLock);
    assert.strictEqual(acquired4, true, 'Should acquire lock because previous was expired');

    // 5. Test Artifacts
    console.log('Testing Artifacts...');
    const artifact: client.Artifact = {
      id: 'art-1',
      workspace_id: 'ws-123',
      name: 'Test Artifact',
      content: 'Hello, World!',
      content_type: 'text/plain',
      created_at: Date.now(),
    };
    await client.createArtifact(artifact);
    const artifacts = await client.getArtifacts('ws-123');
    assert.strictEqual(artifacts.length, 1);
    assert.strictEqual(artifacts[0].id, 'art-1');

    console.log('All tests passed successfully!');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  if (server) server.close();
  process.exit(1);
});
