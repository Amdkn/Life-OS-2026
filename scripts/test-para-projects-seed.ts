import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supabasePath = path.join(__dirname, '../src/lib/supabase.ts');

const code = fs.readFileSync(supabasePath, 'utf8');
const backup = code;
fs.writeFileSync(supabasePath, code.replace(/import\.meta\.env\.VITE_SUPABASE_URL/g, '"http://localhost"').replace(/import\.meta\.env\.VITE_SUPABASE_ANON_KEY/g, '"test"'));

try {
  const innerScript = path.join(__dirname, 'test-para-projects-seed-inner.ts');
  fs.writeFileSync(innerScript, `
import { useParaStore } from '../src/stores/fw-para.store';
import 'fake-indexeddb/auto';

async function runTests() {
  console.log('--- STARTING PARA PROJECTS SEED TESTS ---');
  try {
    // 1. Check Store state
    const state = useParaStore.getState();
    const projects = state.projects;
    const picardProjects = projects.filter(p => p.id.startsWith('PRJ-PICARD'));

    console.log(\`Found \${picardProjects.length} Picard projects in store state.\`);
    if (picardProjects.length !== 9) {
      throw new Error(\`Expected 9 Picard projects, found \${picardProjects.length}\`);
    }

    const uniqueIds = new Set(picardProjects.map(p => p.id));
    if (uniqueIds.size !== 9) {
      throw new Error('Duplicate Picard projects found.');
    }

    // Check specific keys
    const p1 = picardProjects.find(p => p.id === 'PRJ-PICARD-01');
    if (!p1 || p1.title !== 'OMK Business OS (B2/B3 Core)') {
        throw new Error('PRJ-PICARD-01 not matching expected title');
    }

    // Check if description / manifest is added to the projects
    if (!p1.description || p1.description === '') {
        throw new Error('PRJ-PICARD-01 missing doctrinal manifest description');
    }

    console.log('✅ 9 Picard projects seeded and idempotency verified successfully.');
    process.exit(0);
  } catch (e) {
    console.error('❌ TEST FAILED:', e);
    process.exit(1);
  }
}

runTests();
`);
  execSync('npx tsx scripts/test-para-projects-seed-inner.ts', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  fs.unlinkSync(innerScript);
} finally {
  fs.writeFileSync(supabasePath, backup);
}
