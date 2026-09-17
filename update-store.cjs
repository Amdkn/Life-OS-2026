const fs = require('fs');

let content = fs.readFileSync('src/stores/fw-para.store.ts', 'utf8');

content = content.replace(
  'archivedAt?: number;',
  'archivedAt?: number;\n  archiveReason?: string;\n  lessonsLearned?: string;'
);

content = content.replace(
  'archiveProject: (id: string) => Promise<void>;',
  'archiveProject: (id: string, reason?: string, lessonsLearned?: string) => Promise<void>;\n  unarchiveProject: (id: string) => Promise<void>;'
);

content = content.replace(
  'archiveProject: async (id) => {',
  'archiveProject: async (id, reason, lessonsLearned) => {'
);

content = content.replace(
  "await get().updateProject(id, { status: 'archived', archivedAt: Date.now() });",
  "await get().updateProject(id, { status: 'archived', archivedAt: Date.now(), archiveReason: reason, lessonsLearned: lessonsLearned });"
);

const unarchiveFunc = `
      unarchiveProject: async (id) => {
        await get().updateProject(id, { status: 'active', updatedAt: Date.now() });
      },
`;

content = content.replace(
  'deleteProject: async (id) => {',
  unarchiveFunc.trim() + '\n\n      deleteProject: async (id) => {'
);

fs.writeFileSync('src/stores/fw-para.store.ts', content, 'utf8');
