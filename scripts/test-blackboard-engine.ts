import { blackboardEngine } from '../server/blackboard/engine/index.js';
import { db } from '../server/blackboard/db.js';
import { v4 as uuidv4 } from 'uuid';

async function runTests() {
  console.log('Testing Blackboard Engine directly...');

  try {
    console.log('Testing Lock Mechanics...');

    const resourceKey = 'test-resource-' + uuidv4();
    const agent1 = 'agent-1';
    const agent2 = 'agent-2';

    // 1. Agent 1 acquires lock
    const lockAcquired1 = blackboardEngine.acquireLock(resourceKey, agent1, 5000);
    console.log(`Agent 1 acquired lock: ${lockAcquired1}`);
    if (!lockAcquired1) throw new Error('Agent 1 should have acquired the lock');

    // 2. Agent 2 tries to acquire lock on same resource
    const lockAcquired2 = blackboardEngine.acquireLock(resourceKey, agent2, 5000);
    console.log(`Agent 2 acquired lock: ${lockAcquired2}`);
    if (lockAcquired2) throw new Error('Agent 2 should NOT have acquired the lock');

    // 3. Agent 1 releases lock
    const lockReleased = blackboardEngine.releaseLock(resourceKey, agent1);
    console.log(`Agent 1 released lock: ${lockReleased}`);
    if (!lockReleased) throw new Error('Agent 1 should have successfully released the lock');

    // 4. Agent 2 acquires lock now
    const lockAcquired3 = blackboardEngine.acquireLock(resourceKey, agent2, 5000);
    console.log(`Agent 2 acquired lock after release: ${lockAcquired3}`);
    if (!lockAcquired3) throw new Error('Agent 2 should have acquired the lock after release');

    console.log('Testing Action Receipts (Append-only) & Intentions...');
    const workspaceId = 'test-workspace-' + uuidv4();

    // Create workspace first to satisfy foreign key constraint
    db.prepare(`
      INSERT INTO workspaces (id, name, domain_id, status, linear_team_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(workspaceId, 'Test Workspace', null, 'active', null, Date.now(), Date.now());

    const receipt = blackboardEngine.recordActionReceipt(workspaceId, agent1, 'test-layer', { status: 'success' });
    console.log('Recorded Action Receipt:', receipt.id);

    const intention = blackboardEngine.recordIntention(workspaceId, agent1, 'test-layer', { action: 'do_something' });
    console.log('Recorded Intention:', intention.id);

    const events = db.prepare('SELECT * FROM events WHERE workspace_id = ?').all(workspaceId) as any[];
    if (!events.find(e => e.id === receipt.id)) throw new Error('Action receipt was not appended');
    if (!events.find(e => e.id === intention.id)) throw new Error('Intention was not appended');
    console.log('Events successfully verified in event store');

    console.log('Testing Idempotency...');
    const explicitId = uuidv4();

    // First insert
    blackboardEngine.recordActionReceipt(workspaceId, agent1, 'test-layer', { status: 'success' }, explicitId);

    // Duplicate insert should fail
    try {
      blackboardEngine.recordActionReceipt(workspaceId, agent1, 'test-layer', { status: 'success' }, explicitId);
      throw new Error('Duplicate insert should have failed due to unique ID constraint');
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        console.log('Idempotency verified: duplicate insert rejected.');
      } else {
        throw e;
      }
    }

    console.log('All tests passed successfully!');

  } catch (error) {
    console.error('Test Failed:', error);
    process.exitCode = 1;
  }
}

runTests();
