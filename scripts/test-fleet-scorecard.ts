import 'fake-indexeddb/auto';
import { useFleetStore } from '../src/stores/fleet.store.js';

async function runTest() {
  console.log('--- Starting Fleet Scorecard Telementry Test ---');

  // Mock blackboard events
  const mockEvents = [
    {
      id: 'e1',
      workspace_id: 'w1',
      actor_id: 'A0',
      actor_layer: 'A3',
      event_type: 'agent_start_task',
      payload_json: '{}',
      timestamp: Date.now() - 10000
    },
    {
      id: 'e2',
      workspace_id: 'w1',
      actor_id: 'A1-Beth',
      actor_layer: 'A1',
      event_type: 'agent_block_task',
      payload_json: '{}',
      timestamp: Date.now() - 5000
    },
    {
      id: 'e3',
      workspace_id: 'w1',
      actor_id: 'A2-Morty',
      actor_layer: 'A2',
      event_type: 'agent_complete_task',
      payload_json: '{}',
      timestamp: Date.now()
    }
  ];

  // Override global fetch
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('/events')) {
      return {
        ok: true,
        json: async () => mockEvents,
      } as Response;
    }
    return originalFetch(url, options);
  };

  const store = useFleetStore.getState();

  console.log('Fetching telemetry...');
  await store.fetchTelemetry();

  const updatedAgents = useFleetStore.getState().agents;

  console.log('Validating Agent States:');
  const a0 = updatedAgents.find(a => a.id === 'A0');
  const a1 = updatedAgents.find(a => a.id === 'A1-Beth');
  const a2 = updatedAgents.find(a => a.id === 'A2-Morty');

  if (!a0 || a0.status !== 'ACTIVE') throw new Error('A0 status should be ACTIVE');
  if (a0.activeTasks !== 1) throw new Error('A0 active tasks should be 1');
  console.log('✓ A0 state correct (ACTIVE, 1 active task)');

  if (!a1 || a1.status !== 'BLOCKED') throw new Error('A1 status should be BLOCKED');
  console.log('✓ A1 state correct (BLOCKED)');

  if (!a2 || a2.status !== 'IDLE') throw new Error('A2 status should be IDLE');
  if (a2.completedTasks !== 1) throw new Error('A2 completed tasks should be 1');
  console.log('✓ A2 state correct (IDLE, 1 completed task)');

  console.log('--- Fleet Telemetry Tests Passed! ---');
  process.exit(0);
}

runTest().catch(e => {
  console.error('Test Failed:', e);
  process.exit(1);
});
