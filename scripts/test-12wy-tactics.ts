import 'fake-indexeddb/auto';
import { useTwelveWeekStore } from '../src/stores/fw-12wy.store';
import { useParaStore } from '../src/stores/fw-para.store';

// Mock localStorage for Zustand persist middleware warning
if (typeof global !== 'undefined') {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}

async function runTests() {
  console.log('=== Running 12WY Tactics Test ===');

  const { addTactic, updateTacticStatus } = useTwelveWeekStore.getState();
  const paraStore = useParaStore.getState();

  // Reset stores for test isolation
  useTwelveWeekStore.setState({ tactics: [], goals: [] });
  useParaStore.setState({ projects: [] });

  // Setup Para Project
  const projectId = 'test-proj-1';
  await paraStore.addProject({
    id: projectId,
    title: 'Test Active Project',
    status: 'active',
    domain: 'business',
    pillars: [],
    resources: [],
    progress: 0,
    updatedAt: Date.now()
  } as any);

  console.log('\n1. Testing 3 states (pending, completed, failed) and historized transitions...');

  const tacticId1 = 'tac-1';
  await addTactic({
    id: tacticId1,
    type: 'wy-tactic',
    title: 'Test Tactic 1',
    goalId: 'goal-1',
    week: 1,
    status: 'pending',
    cycleId: 'cycle-1',
    projectId: projectId,
  } as any);

  let tactic = useTwelveWeekStore.getState().tactics.find(t => t.id === tacticId1);
  if (tactic?.statusHistory?.[0].status !== 'pending') {
    throw new Error('Initial status transition failed.');
  }

  await updateTacticStatus(tacticId1, 'completed');
  tactic = useTwelveWeekStore.getState().tactics.find(t => t.id === tacticId1);
  if (tactic?.status !== 'completed' || tactic?.statusHistory?.[1].status !== 'completed') {
    throw new Error('Transition to completed failed.');
  }

  await updateTacticStatus(tacticId1, 'failed');
  tactic = useTwelveWeekStore.getState().tactics.find(t => t.id === tacticId1);
  if (tactic?.status !== 'failed' || tactic?.statusHistory?.[2].status !== 'failed') {
    throw new Error('Transition to failed failed.');
  }

  console.log('✓ State transitions and history tracking are verified.');

  console.log('\n2. Testing Idempotency (Formal prevention of duplicates)...');
  const countBefore = useTwelveWeekStore.getState().tactics.length;
  await addTactic({
    id: 'tac-duplicate',
    type: 'wy-tactic',
    title: 'Test Tactic 1',
    goalId: 'goal-1',
    week: 1,
    status: 'pending',
    cycleId: 'cycle-1',
  } as any);

  const countAfter = useTwelveWeekStore.getState().tactics.length;
  if (countBefore !== countAfter) {
    throw new Error('Idempotency check failed: duplicate tactic was added.');
  }

  console.log('✓ Idempotency is working, duplicate ignored.');

  console.log('\n3. Testing Isolation by cycle...');
  await addTactic({
    id: 'tac-cycle-2',
    type: 'wy-tactic',
    title: 'Test Tactic 1',
    goalId: 'goal-1',
    week: 1,
    status: 'pending',
    cycleId: 'cycle-2',
  } as any);

  const tacticsInCycle1 = useTwelveWeekStore.getState().tactics.filter(t => t.cycleId === 'cycle-1');
  const tacticsInCycle2 = useTwelveWeekStore.getState().tactics.filter(t => t.cycleId === 'cycle-2');

  if (tacticsInCycle1.length !== 1 || tacticsInCycle2.length !== 1) {
    throw new Error('Cycle isolation failed: tactics are mixing across cycles.');
  }

  console.log('✓ Isolation by cycle is verified.');

  console.log('\n4. Testing Orphaned link preservation...');

  await paraStore.archiveProject(projectId);

  const archivedProject = useParaStore.getState().projects.find(p => p.id === projectId);
  if (archivedProject?.status !== 'archived') {
    throw new Error('Failed to archive project.');
  }

  const orphanedTactic = useTwelveWeekStore.getState().tactics.find(t => t.id === tacticId1);
  if (!orphanedTactic || orphanedTactic.projectId !== projectId) {
    throw new Error('Orphaned link preservation failed: tactic was deleted or link was lost.');
  }

  console.log('✓ Orphaned link preservation is verified. Tactic is intact with archived project ID.');

  console.log('\n=== All Tests Passed Successfully! ===');
}

runTests().catch(e => {
  console.error('\n❌ Test Failed:', e.message);
  process.exit(1);
});
