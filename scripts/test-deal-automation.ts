import 'fake-indexeddb/auto';
import { JSDOM } from 'jsdom';

// 1. Init JSDOM for global window/document mock
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
});
(global as any).window = dom.window;
(global as any).document = dom.window.document;
Object.defineProperty(dom.window, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }
});

import { useDealStore } from '../src/stores/fw-deal.store';
import { useTwelveWeekStore, type WyTactic } from '../src/stores/fw-12wy.store';

async function runTests() {
  console.log("Starting DEAL Automation & Elimination Engine Tests...");

  // Mock initial setup if needed or just use the stores as-is if they are not persistently trying to fetch without mocked DB.
  // We can force the state to test our functions.

  const dealStore = useDealStore.getState();
  const twelveWeekStore = useTwelveWeekStore.getState();

  // Reset store for clean slate
  useDealStore.setState({ items: [], muses: [], automationRate: 0, hoursLiberated: 0 });

  // Test 1: Absorb 12WY Tactic
  const mockTactic: WyTactic = {
    id: 'tactic-1',
    type: 'wy-tactic',
    status: 'active',
    goalId: 'goal-1',
    title: 'Migrate old data to new schema',
    week: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as any;

  console.log("\\n--- Test 1: Absorb 12WY Tactic ---");
  await dealStore.absorb12wyTacticAsFriction(mockTactic.id, mockTactic.title, '12WY Tactic');

  let currentItems = useDealStore.getState().items;
  if (currentItems.length !== 1 || currentItems[0].title !== '[12WY] Migrate old data to new schema' || currentItems[0].tacticId !== 'tactic-1') {
    throw new Error('Test 1 Failed: Tactic not absorbed correctly');
  }
  console.log("✓ Tactic absorbed correctly preserving original ID and Title mapping");

  // Test 2: Idempotency (Don't overwrite/add duplicate)
  console.log("\\n--- Test 2: Idempotency Check ---");
  await dealStore.absorb12wyTacticAsFriction(mockTactic.id, "Different Title", '12WY Tactic');
  currentItems = useDealStore.getState().items;
  if (currentItems.length !== 1 || currentItems[0].title !== '[12WY] Migrate old data to new schema') {
    throw new Error('Test 2 Failed: Tactic absorption was not idempotent');
  }
  console.log("✓ Idempotency maintained, no duplicates created");

  // Test 3: Calculate Metrics (Automation Rate)
  console.log("\\n--- Test 3: Automation Rate Calculation ---");
  // Add another item
  useDealStore.setState((s) => ({
    items: [
      ...s.items,
      {
        id: 'item-2',
        title: 'Another task',
        step: 'automate',
        status: 'active',
        frictionScore: 50,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as any,
      {
        id: 'item-3',
        title: 'Task to liberate',
        step: 'liberate',
        status: 'active',
        frictionScore: 50,
        timeSavedEstimate: 10,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as any
    ]
  }));

  useDealStore.getState().calculateMetrics();
  let state = useDealStore.getState();

  // Total active = 3. Automated = 1. Rate = 1/3 = 33%
  if (state.automationRate !== 33) {
    throw new Error(`Test 3 Failed: Automation rate is ${state.automationRate}, expected 33`);
  }
  console.log("✓ Automation rate correctly calculated at 33%");

  // Test 4: Calculate Metrics (Hours Liberated)
  console.log("\\n--- Test 4: Hours Liberated Calculation ---");
  // Expected to be 10 from the item above. Let's add an operational muse.
  useDealStore.setState((s) => ({
    muses: [
      {
        id: 'muse-1',
        title: 'Operational Muse',
        revenueEstimate: 100,
        buildCost: 5,
        timeCost: 25,
        status: 'operational',
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as any
    ]
  }));

  useDealStore.getState().calculateMetrics();
  state = useDealStore.getState();

  // Expected = 10 (liberated item) + 25 (operational muse) = 35
  if (state.hoursLiberated !== 35) {
    throw new Error(`Test 4 Failed: Hours liberated is ${state.hoursLiberated}, expected 35`);
  }
  console.log("✓ Hours liberated correctly calculated at 35h");

  // Test 5: Strict Deletion Confirmation
  console.log("\\n--- Test 5: Strict Deletion Guard ---");
  const initialCount = state.items.length;
  await dealStore.deleteItem('item-2', false); // Try without confirmation

  state = useDealStore.getState();
  if (state.items.length !== initialCount) {
    throw new Error("Test 5 Failed: Item deleted without explicit confirmation");
  }
  console.log("✓ Item deletion blocked without confirmation");

  await dealStore.deleteItem('item-2', true); // Try with confirmation
  state = useDealStore.getState();
  if (state.items.length !== initialCount - 1) {
    throw new Error("Test 5 Failed: Item not deleted with explicit confirmation");
  }
  console.log("✓ Item deleted successfully after confirmation");

  console.log("\\nAll PRD-044 Deal Automation Tests Passed successfully!");
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
