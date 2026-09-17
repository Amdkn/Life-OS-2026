import 'fake-indexeddb/auto';
import { useParaStore } from '../src/stores/fw-para.store';

async function runTests() {
  console.log('--- STARTING PARA ARCHIVES TESTS ---');

  // We are not mocking import.meta.env according to instructions, so we just use the store natively.
  // Set process.cwd mock or similar not needed unless ld-router does something, but let's see.

  // 1. Initialize store with an empty project list to make it clean
  useParaStore.setState({ projects: [] });

  const testProject = {
    id: 'test-proj-1',
    title: 'Test Project',
    status: 'active' as const,
    domain: 'business' as const,
    pillars: ['growth'],
    resources: [],
    progress: 0,
    updatedAt: Date.now()
  };

  // 2. Add the test project
  await useParaStore.getState().addProject(testProject);

  let projects = useParaStore.getState().projects;
  console.assert(projects.length === 1, 'Project was added successfully');
  console.assert(projects[0].status === 'active', 'Project initial status is active');

  console.log('✓ Project successfully created');

  // 3. Archive the project with reason and lessons
  const archiveReason = 'Project obsolete';
  const lessonsLearned = 'Need better planning';
  await useParaStore.getState().archiveProject(testProject.id, archiveReason, lessonsLearned);

  projects = useParaStore.getState().projects;
  const archivedProject = projects[0];
  console.assert(archivedProject.status === 'archived', 'Project status should be archived');
  console.assert(archivedProject.archiveReason === archiveReason, 'Archive reason should match');
  console.assert(archivedProject.lessonsLearned === lessonsLearned, 'Lessons learned should match');
  console.assert(archivedProject.archivedAt !== undefined, 'archivedAt should be set');

  console.log('✓ Project successfully archived with reason and lessons');

  // 4. Unarchive the project
  await useParaStore.getState().unarchiveProject(testProject.id);

  projects = useParaStore.getState().projects;
  const unarchivedProject = projects[0];
  console.assert(unarchivedProject.status === 'active', 'Project status should be active again');
  // Ensuring data isn't lost
  console.assert(unarchivedProject.archiveReason === archiveReason, 'Archive reason should be preserved');
  console.assert(unarchivedProject.lessonsLearned === lessonsLearned, 'Lessons learned should be preserved');
  console.assert(unarchivedProject.updatedAt !== undefined, 'updatedAt should be set');

  console.log('✓ Project successfully unarchived with history preserved');

  console.log('--- PARA ARCHIVES TESTS PASSED ---');
}

runTests().catch((e) => {
  console.error('TEST FAILED:', e);
  process.exit(1);
});
