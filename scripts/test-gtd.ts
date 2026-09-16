import "fake-indexeddb/auto";
import { useGtdStore } from '../src/stores/fw-gtd.store';
import { useTwelveWeekStore } from '../src/stores/fw-12wy.store';

// Mock Vite env
if (typeof process !== 'undefined' && !process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = "https://mockurl.supabase.co";
  process.env.VITE_SUPABASE_ANON_KEY = "mockkey";
}

async function testGtdPipeline() {
  console.log("=== Starting GTD Cerritos Pipeline Test ===");

  const gtdStore = useGtdStore.getState();
  const wyStore = useTwelveWeekStore.getState();

  // Clean initial state (mock environment for test runner usually)
  useGtdStore.setState({ items: [], logs: [], isLoaded: true });
  useTwelveWeekStore.setState({ goals: [], tactics: [], visions: [], timeBlocks: [], isHydrated: true });

  console.log("\n1. Capture (Mariner)");
  await useGtdStore.getState().addItem("Repair Warp Core Diagnostics");
  await useGtdStore.getState().addItem("Recalibrate Sensors");
  let items = useGtdStore.getState().items;
  console.log(`Current items in GTD inbox: ${items.length}`);
  if (items.length !== 2) throw new Error("Capture failed");

  console.log("\n2. Clarify (Boimler)");
  const itemToClarify = items[0];
  await useGtdStore.getState().processItem(itemToClarify.id, { status: 'actionable' }, "Actionable task for engineering");
  items = useGtdStore.getState().items;
  console.log(`Actionable items count: ${items.filter(i => i.status === 'actionable').length}`);
  if (items.filter(i => i.status === 'actionable').length !== 1) throw new Error("Clarify failed");

  console.log("\n3. Organize (Rutherford) - Promotion to 12WY Goal");
  const actionableItem = items.find(i => i.status === 'actionable')!;
  const mockGoalId = "goal-123";
  await useTwelveWeekStore.getState().addGoal({
    id: mockGoalId,
    type: 'wy-goal',
    title: actionableItem.content,
    description: 'Promoted test goal',
    visionId: 'vision-001',
    targetWeek: 1,
    status: 'pending',
    updatedAt: Date.now(),
    createdAt: Date.now()
  });
  await useGtdStore.getState().processItem(actionableItem.id, { goalId: mockGoalId, status: 'completed' }, "Promoted to 12WY Goal");

  items = useGtdStore.getState().items;
  const promotedItem = items.find(i => i.id === actionableItem.id)!;
  console.log(`Promoted item status: ${promotedItem.status}`);
  if (promotedItem.status !== 'completed' || promotedItem.goalId !== mockGoalId) {
    throw new Error("Promotion to 12WY failed");
  }

  const goals = useTwelveWeekStore.getState().goals;
  console.log(`12WY Goals count: ${goals.length}`);
  if (goals.length !== 1 || goals[0].title !== actionableItem.content) {
    throw new Error("12WY Goal creation failed");
  }

  console.log("\n4. Review (Tendi) & 5. Engage (Freeman)");
  // Let's clarify the second item to actionable and then complete it
  const secondItem = items.find(i => i.status === 'inbox')!;
  await useGtdStore.getState().processItem(secondItem.id, { status: 'actionable' }, "Actionable");

  await useGtdStore.getState().processItem(secondItem.id, { status: 'completed' }, "Engaged and completed");
  items = useGtdStore.getState().items;
  console.log(`Completed items count: ${items.filter(i => i.status === 'completed').length}`);
  if (items.filter(i => i.status === 'completed').length !== 2) {
    throw new Error("Engage completion failed");
  }

  console.log("\n=== All Tests Passed Successfully ===");
}

testGtdPipeline().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
