import { mapScoreCardTaskToLinearIssue, mapWyTacticToLinearIssue, mapParaProjectToLinearIssue } from '../src/lib/linear/adapter';
import { syncIssue } from '../src/lib/linear/client';
import * as bbClient from '../src/lib/blackboard/client';
import type { WyTactic } from '../src/stores/fw-12wy.store';
import type { Project } from '../src/stores/fw-para.store';

// We must mock the fetch globally since we cannot mutate the ESM module exports directly in ts-node/tsx easily
const originalFetch = global.fetch;

let queuedEvents: any[] = [];

(global as any).fetch = async (url: string, options: any) => {
  if (url.includes('/api/bridge/linear/sync')) {
    // Simulate failure
    throw new Error('Network offline');
  }

  if (url.includes('/api/blackboard/events') && options?.method === 'POST') {
    // Intercept the appendEvent fetch!
    const body = JSON.parse(options.body);
    queuedEvents.push(body);
    return { ok: true, json: async () => body } as any;
  }

  return originalFetch(url, options);
};


async function runTests() {
  console.log('--- RUNNING LINEAR SYNC TESTS ---');

  // 1. Test ScoreCard Mapping
  console.log('\n1. Testing ScoreCard Mapping...');
  const mockTask = {
    id: 'TASK-123',
    title: 'Deploy Matrix',
    status: 'in-progress',
    label: 'BUSINESS'
  };
  const scPayload = mapScoreCardTaskToLinearIssue(mockTask);
  console.assert(scPayload.title === 'Deploy Matrix', 'Title mismatch');
  console.assert(scPayload.teamId === 'team-business', `Team ID mismatch: ${scPayload.teamId}`);
  console.assert(scPayload._mappedFromType === 'scorecard-task', 'Type mismatch');
  console.log('✅ ScoreCard mapping passed.');

  // 2. Test 12WY Mapping
  console.log('\n2. Testing 12WY Mapping...');
  const mockTactic: WyTactic = {
    id: 'WY-TAC-999',
    type: 'wy-tactic',
    goalId: 'GOAL-1',
    title: 'Write test suite',
    week: 2,
    status: 'pending',
    description: '',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const wyPayload = mapWyTacticToLinearIssue(mockTactic, 'finance');
  console.assert(wyPayload.title === 'Write test suite', 'Title mismatch');
  console.assert(wyPayload.teamId === 'team-finance', `Team ID mismatch: ${wyPayload.teamId}`);
  console.assert(wyPayload._mappedFromType === 'wy-tactic', 'Type mismatch');
  console.log('✅ 12WY mapping passed.');

  // 3. Test PARA Mapping
  console.log('\n3. Testing PARA Mapping...');
  const mockProject: Project = {
    id: 'PRJ-444',
    title: 'Build Sync Engine',
    status: 'active',
    domain: 'impact',
    pillars: [],
    resources: [],
    progress: 50
  };
  const paraPayload = mapParaProjectToLinearIssue(mockProject);
  console.assert(paraPayload.title === 'Build Sync Engine', 'Title mismatch');
  console.assert(paraPayload.teamId === 'team-impact', `Team ID mismatch: ${paraPayload.teamId}`);
  console.assert(paraPayload._mappedFromType === 'para-project', 'Type mismatch');
  console.log('✅ PARA mapping passed.');

  // 4. Test Offline Queueing
  console.log('\n4. Testing Offline Sync & Queueing...');
  queuedEvents = []; // reset
  const result = await syncIssue(paraPayload);

  console.assert(result.success === false, 'Result should be failure due to offline');
  console.assert(result.queued === true, 'Payload should be queued');
  console.assert(queuedEvents.length === 1, 'Should have exactly 1 event in queue');
  console.assert(queuedEvents[0].event_type === 'linear_sync_issue', 'Event type mismatch');

  const payloadFromEvent = JSON.parse(queuedEvents[0].payload_json);
  console.assert(payloadFromEvent._mappedFromId === 'PRJ-444', 'Queued payload ID mismatch');

  console.log('✅ Offline queueing passed.');
  console.log('\n--- ALL TESTS PASSED ---');
}

runTests().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
