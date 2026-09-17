import { JSDOM } from 'jsdom';
import 'fake-indexeddb/auto';

// Setup Mock DOM
const dom = new JSDOM('', { url: 'http://localhost' });
(global as any).window = dom.window;
(global as any).document = dom.window.document;
Object.defineProperty((global as any).window, 'localStorage', {
  value: dom.window.localStorage,
  writable: true
});
(global as any).localStorage = dom.window.localStorage;
// Do not mock navigator to avoid TypeError in Node 22+

import { useGtdStore } from '../src/stores/fw-gtd.store';
import { useTwelveWeekStore, type WyGoal } from '../src/stores/fw-12wy.store';
import { useParaStore, type Project } from '../src/stores/fw-para.store';
import * as assert from 'assert';

async function runTests() {
  console.log("Starting GTD Inbox Gate tests...");

  // Reset stores
  useGtdStore.setState({ items: [], logs: [] });
  useTwelveWeekStore.setState({ goals: [], tactics: [] });
  useParaStore.setState({ projects: [] });

  const gtdStore = useGtdStore.getState();
  const twelveWeekStore = useTwelveWeekStore.getState();
  const paraStore = useParaStore.getState();

  // Test 1: Capture an item
  await gtdStore.addItem('New Test Idea');
  let currentItems = useGtdStore.getState().items;
  assert.strictEqual(currentItems.length, 1);
  assert.strictEqual(currentItems[0].content, 'New Test Idea');
  assert.strictEqual(currentItems[0].status, 'inbox');
  const capturedItemId = currentItems[0].id;
  console.log("✅ Capture item successful");

  // Test 2: Perform 'Do' action (completed)
  await gtdStore.processItem(capturedItemId, { status: 'completed' }, 'Did it');
  currentItems = useGtdStore.getState().items;
  assert.strictEqual(currentItems[0].status, 'completed');
  console.log("✅ 'Do' action (completed) successful");

  // Test 3: Perform 'Delegate' action
  await gtdStore.addItem('Delegate Task');
  const delegateId = useGtdStore.getState().items[0].id;
  await gtdStore.processItem(delegateId, { status: 'delegated' }, 'Delegated it');
  assert.strictEqual(useGtdStore.getState().items[0].status, 'delegated');
  console.log("✅ 'Delegate' action successful");

  // Test 4: Perform 'Defer' action
  await gtdStore.addItem('Defer Task');
  const deferId = useGtdStore.getState().items[0].id;
  await gtdStore.processItem(deferId, { status: 'deferred' }, 'Deferred it');
  assert.strictEqual(useGtdStore.getState().items[0].status, 'deferred');
  console.log("✅ 'Defer' action successful");

  // Test 5: Route to PARA Project
  const testProject: Project = {
    id: 'proj-123',
    title: 'Test Project',
    status: 'active',
    domain: 'business',
    pillars: [],
    resources: [],
    progress: 0,
    updatedAt: Date.now()
  };
  await paraStore.addProject(testProject);

  await gtdStore.addItem('Project Task');
  const projTaskId = useGtdStore.getState().items[0].id;

  // Simulate routeToParaProject from InboxGate
  await gtdStore.processItem(projTaskId, { projectId: 'proj-123', status: 'completed' }, 'Routed to PARA Project');
  const updatedProjTask = useGtdStore.getState().items.find(i => i.id === projTaskId);
  assert.strictEqual(updatedProjTask?.projectId, 'proj-123');
  assert.strictEqual(updatedProjTask?.status, 'completed');
  console.log("✅ Route to PARA project successful");

  // Test 6: Promote to 12WY Tactic
  const testGoal: WyGoal = {
    id: 'goal-123',
    type: 'wy-goal',
    title: 'Test Goal',
    visionId: 'vision-1',
    targetWeek: 12,
    status: 'pending',
    createdAt: Date.now(),
    description: 'Test Goal Description',
    updatedAt: Date.now()
  };
  await twelveWeekStore.addGoal(testGoal);

  await gtdStore.addItem('Tactic Task');
  const tacticTaskId = useGtdStore.getState().items[0].id;

  // Simulate promoteTo12WYTactic from InboxGate
  const newTacticId = 'tactic-123';
  await twelveWeekStore.addTactic({
    id: newTacticId,
    type: 'wy-tactic',
    title: 'Tactic Task',
    goalId: 'goal-123',
    week: 1,
    status: 'pending',
    createdAt: Date.now(),
    description: 'Tactic Task Description',
    updatedAt: Date.now()
  });
  await gtdStore.processItem(tacticTaskId, { tacticId: newTacticId, goalId: 'goal-123', status: 'completed' }, 'Promoted to 12WY Tactic');

  const updatedTacticTask = useGtdStore.getState().items.find(i => i.id === tacticTaskId);
  const tactics = useTwelveWeekStore.getState().tactics;

  assert.strictEqual(updatedTacticTask?.tacticId, newTacticId);
  assert.strictEqual(updatedTacticTask?.goalId, 'goal-123');
  assert.strictEqual(updatedTacticTask?.status, 'completed');
  assert.strictEqual(tactics.length, 1);
  assert.strictEqual(tactics[0].title, 'Tactic Task');
  console.log("✅ Promote to 12WY Tactic successful");

  console.log("🎉 All GTD Inbox Gate tests passed!");
}

runTests().catch(e => {
  console.error("Test failed", e);
  process.exit(1);
});
