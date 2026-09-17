import fs from 'fs';

let content = fs.readFileSync('src/stores/fw-deal.store.ts', 'utf-8');

// 1. Add tacticId and timeSavedEstimate to DealItem
content = content.replace(
  /export interface DealItem \{\n\s*id: string;/,
  `export interface DealItem {\n  id: string;\n  tacticId?: string;\n  timeSavedEstimate?: number;`
);

// 2. Add metrics to DealState
content = content.replace(
  /isLoaded: boolean;\n  frictionThreshold: number;/,
  `isLoaded: boolean;\n  frictionThreshold: number;\n  automationRate: number;\n  hoursLiberated: number;`
);

// 3. Add new actions to DealState
content = content.replace(
  /decommissionMuse: \(id: string\) => Promise<void>;/,
  `decommissionMuse: (id: string) => Promise<void>;\n  calculateMetrics: () => void;\n  absorb12wyTacticAsFriction: (tacticId: string, tacticTitle: string, source?: string) => Promise<void>;\n  deleteItem: (id: string, confirmed: boolean) => Promise<void>;`
);

// 4. Add initial values for metrics
content = content.replace(
  /isLoaded: false,\n  frictionThreshold: 50,/,
  `isLoaded: false,\n  frictionThreshold: 50,\n  automationRate: 0,\n  hoursLiberated: 0,`
);

// 5. Update loadFromDB to call calculateMetrics
content = content.replace(
  /set\(\{\n\s*items: dealItems\.filter\(i => \(i as any\)\.type === 'v1\.deal' \|\| !\(i as any\)\.type\),\n\s*muses: muses\.filter\(m => \(m as any\)\.type === 'v1\.muse' \|\| !\(m as any\)\.type\),\n\s*isLoaded: true\n\s*\}\);\n\s*\} catch \(e\) \{/,
  `set({\n        items: dealItems.filter(i => (i as any).type === 'v1.deal' || !(i as any).type),\n        muses: muses.filter(m => (m as any).type === 'v1.muse' || !(m as any).type),\n        isLoaded: true\n      });\n      get().calculateMetrics();\n    } catch (e) {`
);

// 6. Implement new actions (calculateMetrics, absorb12wyTacticAsFriction, deleteItem)
const newActions = `
  calculateMetrics: () => {
    const s = get();
    const activeItems = s.items.filter(i => i.status === 'active');
    const automatedItems = activeItems.filter(i => i.step === 'automate');

    const automationRate = activeItems.length > 0 ? Math.round((automatedItems.length / activeItems.length) * 100) : 0;

    let hours = 0;
    s.items.forEach(i => {
      if (i.step === 'liberate') {
        hours += (i.timeSavedEstimate || 0);
      }
    });
    s.muses.forEach(m => {
      if (m.status === 'operational' || m.status === 'testing' || m.status === 'candidate') {
        hours += m.timeCost;
      }
    });

    set({ automationRate, hoursLiberated: hours });
  },

  absorb12wyTacticAsFriction: async (tacticId: string, tacticTitle: string, source?: string) => {
    // Check if it already exists to not overwrite
    const exists = get().items.find(i => i.tacticId === tacticId);
    if (exists) {
      console.info(\`[DEAL] Tactic \${tacticId} already absorbed.\`);
      return;
    }

    const newFriction: DealItem = {
      id: crypto.randomUUID(),
      title: \`[12WY] \${tacticTitle}\`,
      tacticId: tacticId,
      step: 'define',
      frictionScore: 60,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source
    };
    await get().addItem(newFriction);
    get().calculateMetrics();
    console.info(\`[DEAL] Tactic \${tacticId} absorbed into DEAL Pipeline.\`);
  },

  deleteItem: async (id: string, confirmed: boolean) => {
    if (!confirmed) {
      console.warn('[DEAL] User data deletion blocked: Explicit confirmation required.');
      return;
    }

    set(s => ({
      items: s.items.filter(i => i.id !== id)
    }));
    await writeToLD('ld06', 'items', 'remove', { id } as any, 'deal');
    get().calculateMetrics();
  },
`;

content = content.replace(
  /  absorbProjectAsFriction: async \(projectId: string, projectTitle: string, source\?: string\) => \{/,
  newActions + `\n  absorbProjectAsFriction: async (projectId: string, projectTitle: string, source?: string) => {`
);

// We need to also hook calculateMetrics after update/add operations for items and muses
// Actually, it's easier to just call get().calculateMetrics() after these.

// After addItem:
content = content.replace(
  /await writeToLD\('ld06', 'items', 'add', newItem, 'deal'\);\n\s*\},/,
  `await writeToLD('ld06', 'items', 'add', newItem, 'deal');\n    get().calculateMetrics();\n  },`
);

// After updateDealItem:
content = content.replace(
  /await writeToLD\('ld06', 'items', 'update', updatedItem, 'deal'\);\n\s*\}\n\s*\},/,
  `await writeToLD('ld06', 'items', 'update', updatedItem, 'deal');\n      get().calculateMetrics();\n    }\n  },`
);

// After promoteToMuse:
content = content.replace(
  /await writeToLD\('ld06', 'resources', 'add', \{ \.\.\.newMuse, type: 'v1\.muse' \}, 'deal'\);\n\s*\}\n\s*\},/,
  `await writeToLD('ld06', 'resources', 'add', { ...newMuse, type: 'v1.muse' }, 'deal');\n      get().calculateMetrics();\n    }\n  },`
);

// After updateMuse:
content = content.replace(
  /await writeToLD\('ld06', 'resources', 'update', updatedMuse, 'deal'\);\n\s*\}\n\s*\},/,
  `await writeToLD('ld06', 'resources', 'update', updatedMuse, 'deal');\n      get().calculateMetrics();\n    }\n  },`
);

// After decommissionMuse:
content = content.replace(
  /await writeToLD\('ld06', 'resources', 'update', targetMuse, 'deal'\);\n\s*\}\n\s*\}/,
  `await writeToLD('ld06', 'resources', 'update', targetMuse, 'deal');\n      get().calculateMetrics();\n    }\n  }`
);

fs.writeFileSync('src/stores/fw-deal.store.ts', content, 'utf-8');
console.log('Patched fw-deal.store.ts successfully');
