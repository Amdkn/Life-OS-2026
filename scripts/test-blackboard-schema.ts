import assert from 'assert';
import { db, initDb } from '../server/blackboard/db.js';
import {
  createWorkspace,
  getWorkspaces,
  appendEvent,
  getEvents,
  acquireLock,
  releaseLock,
  createArtifact,
  getArtifactsByWorkspace,
  Workspace,
  BlackboardEvent,
  Lock,
  Artifact
} from '../server/blackboard/repository.js';
import crypto from 'crypto';

function randomUUID() {
  return crypto.randomUUID();
}

async function runTests() {
  console.log('--- Starting Blackboard SQLite Schema Tests ---');

  // Initialize Database
  initDb();

  // Clear tables for a clean slate
  db.prepare('DELETE FROM artifacts').run();
  db.prepare('DELETE FROM locks').run();
  db.prepare('DELETE FROM events').run();
  db.prepare('DELETE FROM workspaces').run();

  // Test 1: Workspace creation
  console.log('Testing Workspace creation...');
  const workspaceId = randomUUID();
  const workspace: Workspace = {
    id: workspaceId,
    name: 'Test Workspace',
    domain_id: 'domain-1',
    status: 'active',
    linear_team_id: 'TEAM-123',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  createWorkspace(workspace);
  const workspaces = getWorkspaces();
  assert(workspaces.length === 1, 'Should have 1 workspace');
  assert(workspaces[0].id === workspaceId, 'Workspace ID should match');
  console.log('✅ Workspace creation successful');

  // Test 2: Event append-only and JSON preservation
  console.log('Testing Event append-only and JSON preservation...');
  const eventId = randomUUID();
  const complexPayload = {
    action: 'test_action',
    details: { foo: 'bar', baz: 42 },
    nested: [1, 2, 3]
  };

  const event: BlackboardEvent = {
    id: eventId,
    workspace_id: workspaceId,
    actor_id: 'agent-1',
    actor_layer: 'B3',
    event_type: 'test_event',
    payload_json: JSON.stringify(complexPayload),
    timestamp: Date.now()
  };

  appendEvent(event);
  const events = getEvents();
  assert(events.length === 1, 'Should have 1 event');
  const retrievedEvent = events[0];
  assert(retrievedEvent.id === eventId, 'Event ID should match');

  // Check JSON payload integrity
  const retrievedPayload = JSON.parse(retrievedEvent.payload_json);
  assert(retrievedPayload.action === 'test_action', 'JSON payload action should match');
  assert(retrievedPayload.details.foo === 'bar', 'JSON payload nested field should match');
  console.log('✅ Event append-only and JSON preservation successful');

  // Test 3: Lock acquisition and deterministic release with TTL
  console.log('Testing Lock acquisition and deterministic release...');
  const lockId = randomUUID();
  const resourceKey = 'resource-x';
  const lock: Lock = {
    id: lockId,
    resource_key: resourceKey,
    locked_by: 'agent-1',
    expires_at: Date.now() + 10000 // 10 seconds TTL
  };

  // Acquire lock
  const lockAcquired = acquireLock(lock);
  assert(lockAcquired === true, 'Lock should be acquired successfully');

  // Try to acquire same lock (should fail)
  const lock2: Lock = {
    id: randomUUID(),
    resource_key: resourceKey,
    locked_by: 'agent-2',
    expires_at: Date.now() + 10000
  };
  const lock2Acquired = acquireLock(lock2);
  assert(lock2Acquired === false, 'Should fail to acquire an already held lock');

  // Release lock
  const lockReleased = releaseLock(resourceKey, 'agent-1');
  assert(lockReleased === true, 'Lock should be released successfully');

  // Re-acquire lock after release (should succeed)
  const lock3Acquired = acquireLock(lock2);
  assert(lock3Acquired === true, 'Should successfully acquire lock after it was released');
  console.log('✅ Lock acquisition and deterministic release successful');

  // Test 4: Artifact creation with new schema (content_path, mime_type)
  console.log('Testing Artifact creation with PRD-011 schema...');
  const artifactId = randomUUID();
  const artifact: Artifact = {
    id: artifactId,
    workspace_id: workspaceId,
    name: 'test-doc.pdf',
    mime_type: 'application/pdf',
    content_path: '/artifacts/test-doc.pdf',
    created_at: Date.now()
  };

  createArtifact(artifact);
  const artifacts = getArtifactsByWorkspace(workspaceId);
  assert(artifacts.length === 1, 'Should have 1 artifact for workspace');
  assert(artifacts[0].mime_type === 'application/pdf', 'Artifact mime_type should match');
  assert(artifacts[0].content_path === '/artifacts/test-doc.pdf', 'Artifact content_path should match');
  console.log('✅ Artifact creation successful');

  console.log('--- All Blackboard SQLite Schema Tests Passed ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
