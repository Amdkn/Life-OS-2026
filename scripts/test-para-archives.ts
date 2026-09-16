import 'fake-indexeddb/auto';
import { useParaStore } from '../src/stores/fw-para.store';

async function testParaArchives() {
  console.log('[TEST] Starting PARA Archives Lifecycle tests...');
  const store = useParaStore.getState();

  // Ensure there's an active project
  const projectId = 'PRJ-TEST-ARCHIVE-01';
  await store.addProject({
    id: projectId,
    title: 'Test Project to Archive',
    status: 'active',
    domain: 'business',
    pillars: [],
    resources: [],
    progress: 50,
  });

  console.log('[TEST] 1. Archiving a project with reason and lessons...');
  await store.archiveProject(projectId, 'Completed successfully', 'Learned to mock IDB effectively.');

  const stateAfterArchive = useParaStore.getState();
  const archivedProject = stateAfterArchive.projects.find(p => p.id === projectId);

  if (!archivedProject) throw new Error('Project not found after archiving.');
  if (archivedProject.status !== 'archived') throw new Error('Project status is not "archived".');
  if (!archivedProject.archivedAt) throw new Error('Project is missing archivedAt timestamp.');
  if (archivedProject.archiveReason !== 'Completed successfully') throw new Error('Project is missing archive reason.');
  if (archivedProject.lessonsLearned !== 'Learned to mock IDB effectively.') throw new Error('Project is missing lessons learned.');

  console.log('✅ Archiving with context successful.');

  console.log('[TEST] 2. Unarchiving a project...');
  await store.unarchiveProject(projectId);

  const stateAfterUnarchive = useParaStore.getState();
  const unarchivedProject = stateAfterUnarchive.projects.find(p => p.id === projectId);

  if (!unarchivedProject) throw new Error('Project not found after unarchiving.');
  if (unarchivedProject.status !== 'active') throw new Error('Project status is not "active".');
  if (unarchivedProject.archivedAt !== undefined) throw new Error('Project still has archivedAt timestamp.');
  if (unarchivedProject.archiveReason !== undefined) throw new Error('Project still has archive reason.');
  if (unarchivedProject.lessonsLearned !== undefined) throw new Error('Project still has lessons learned.');

  console.log('✅ Unarchiving successful.');

  console.log('[TEST] All PARA Archives tests passed successfully! 🚀');
}

testParaArchives().catch(e => {
  console.error('[TEST FAILED]', e);
  process.exit(1);
});
