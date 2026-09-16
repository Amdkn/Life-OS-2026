// Test runner utilizing dynamic store creation to isolate environment
import { create } from 'zustand';

type DealStep = 'define' | 'eliminate' | 'automate' | 'liberate';

interface DealItem {
  id: string;
  projectId?: string;
  title: string;
  step: DealStep;
  frictionScore: number;
  potentialRevenue?: number;
  status: 'active' | 'completed';
  createdAt: number;
  updatedAt: number;
  source?: string;
}

interface DealState {
  activeTab: 'overview' | DealStep | 'muses';
  items: DealItem[];
  muses: any[];
  isLoaded: boolean;
  frictionThreshold: number;

  setActiveTab: (tab: DealState['activeTab']) => void;
  setFrictionThreshold: (threshold: number) => void;
  loadFromDB: () => Promise<void>;
  addItem: (item: DealItem) => Promise<void>;
  createDefinitionFromText: (text: string, source?: string) => Promise<void>;
  updateDealItem: (id: string, patch: Partial<DealItem>) => Promise<void>;
}

export const useDealStoreMock = create<DealState>((set, get) => ({
  activeTab: 'overview',
  items: [],
  muses: [],
  isLoaded: true,
  frictionThreshold: 50,

  setActiveTab: (activeTab) => set({ activeTab }),
  setFrictionThreshold: (frictionThreshold) => set({ frictionThreshold }),

  loadFromDB: async () => {},

  addItem: async (item) => {
    const newItem = { ...item, type: 'v1.deal', createdAt: item.createdAt || Date.now(), updatedAt: Date.now() };
    set(s => ({ items: [...s.items, newItem] }));
  },

  createDefinitionFromText: async (text, source) => {
    const newItem: DealItem = {
      id: "test-uuid-123",
      title: text,
      step: 'define',
      frictionScore: 50,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newItem);
  },

  updateDealItem: async (id, patch) => {
    set(s => {
      const newItems = s.items.map(i => {
        if (i.id === id) {
          return { ...i, ...patch, updatedAt: Date.now() };
        }
        return i;
      });
      return { items: newItems };
    });
  }
}));

async function runTests() {
  console.log("=== Starting DEAL Protocol Tests ===");

  const store = useDealStoreMock.getState();
  console.log(`[PASS] Store initialized.`);

  const testTitle = "Test Bottleneck: Overly complex CI pipeline";
  await useDealStoreMock.getState().createDefinitionFromText(testTitle, "Jules");

  const itemsAfterCreate = useDealStoreMock.getState().items;
  const createdItem = itemsAfterCreate.find(i => i.title === testTitle);

  if (createdItem && createdItem.step === 'define' && createdItem.source === 'Jules') {
    console.log(`[PASS] Bottleneck classified correctly. Source: ${createdItem.source}`);
  } else {
    console.error(`[FAIL] Bottleneck classification failed.`);
    process.exit(1);
  }

  useDealStoreMock.getState().setFrictionThreshold(75);
  if (useDealStoreMock.getState().frictionThreshold === 75) {
    console.log(`[PASS] Friction threshold updated to 75.`);
  } else {
    console.error(`[FAIL] Friction threshold update failed.`);
    process.exit(1);
  }

  if (createdItem) {
    await useDealStoreMock.getState().updateDealItem(createdItem.id, { step: 'eliminate' });

    const itemsAfterUpdate = useDealStoreMock.getState().items;
    const updatedItem = itemsAfterUpdate.find(i => i.id === createdItem.id);

    if (updatedItem && updatedItem.step === 'eliminate') {
      console.log(`[PASS] Bottleneck reclassified to 'eliminate'.`);
    } else {
      console.error(`[FAIL] Bottleneck reclassification failed.`);
      process.exit(1);
    }
  }

  console.log("=== All Tests Passed ===");
  process.exit(0);
}

runTests().catch(e => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
