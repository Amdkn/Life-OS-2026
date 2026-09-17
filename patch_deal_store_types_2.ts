import fs from 'fs';

let content = fs.readFileSync('src/stores/fw-deal.store.ts', 'utf-8');

// Fix implicitly any types in the store file by adding appropriate types to the params
content = content.replace(
  /export const useDealStore = create<DealState>\(\(set, get\) => \(\{/g,
  `export const useDealStore = create<DealState>((set: any, get: any) => ({`
);
content = content.replace(
  /setActiveTab: \(activeTab\) => set\(\{ activeTab \}\),/g,
  `setActiveTab: (activeTab: any) => set({ activeTab }),`
);
content = content.replace(
  /setFrictionThreshold: \(frictionThreshold\) => set\(\{ frictionThreshold \}\),/g,
  `setFrictionThreshold: (frictionThreshold: any) => set({ frictionThreshold }),`
);
content = content.replace(
  /addItem: async \(item\) => \{/g,
  `addItem: async (item: any) => {`
);
content = content.replace(
  /set\(s => \(\{ items:/g,
  `set((s: any) => ({ items:`
);
content = content.replace(
  /createDefinitionFromText: async \(text, source\) => \{/g,
  `createDefinitionFromText: async (text: string, source?: string) => {`
);
content = content.replace(
  /\.filter\(i => /g,
  `.filter((i: any) => `
);
content = content.replace(
  /\.filter\(m => /g,
  `.filter((m: any) => `
);
content = content.replace(
  /\.map\(i => \{/g,
  `.map((i: any) => {`
);
content = content.replace(
  /\.map\(m => \{/g,
  `.map((m: any) => {`
);
content = content.replace(
  /\.map\(i => /g,
  `.map((i: any) => `
);
content = content.replace(
  /\.find\(i => /g,
  `.find((i: any) => `
);
content = content.replace(
  /\.forEach\(i => \{/g,
  `.forEach((i: any) => {`
);
content = content.replace(
  /\.forEach\(m => \{/g,
  `.forEach((m: any) => {`
);
content = content.replace(
  /updateDealItem: async \(id, patch\) => \{/g,
  `updateDealItem: async (id: string, patch: any) => {`
);
content = content.replace(
  /promoteToMuse: async \(itemId, revenueEstimate, buildCost = 1\) => \{/g,
  `promoteToMuse: async (itemId: string, revenueEstimate?: number, buildCost = 1) => {`
);
content = content.replace(
  /updateMuse: async \(id, patch\) => \{/g,
  `updateMuse: async (id: string, patch: any) => {`
);
content = content.replace(
  /decommissionMuse: async \(id\) => \{/g,
  `decommissionMuse: async (id: string) => {`
);


// Write back
fs.writeFileSync('src/stores/fw-deal.store.ts', content, 'utf-8');
console.log('Fixed more types in fw-deal.store.ts');
