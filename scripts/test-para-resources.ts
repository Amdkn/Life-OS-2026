import 'fake-indexeddb/auto';
import { useParaStore } from '../src/stores/fw-para.store';

async function testParaResources() {
  console.log('[TEST] Starting PARA Resources Vault tests...');
  const store = useParaStore.getState();

  console.log('[TEST] 1. Adding a new SOP resource...');
  const newSop = {
    id: `res-sop-${Date.now()}`,
    title: 'Marina Cleaning Protocol',
    type: 'sop' as const,
    category: 'Operations',
    domain: 'business' as const,
    linkedProjects: ['prj-123'],
    linkedPillars: []
  };

  await store.addResource(newSop);
  const stateAfterAdd = useParaStore.getState();
  const addedSop = stateAfterAdd.resources.find(r => r.id === newSop.id);

  if (!addedSop || addedSop.type !== 'sop') {
    throw new Error('Failed to add SOP resource correctly.');
  }
  console.log('✅ Successfully added SOP resource.');

  console.log('[TEST] 2. Adding a new Legal resource...');
  const newLegal = {
    id: `res-legal-${Date.now()}`,
    title: 'Q3 Tax Filing Guide',
    type: 'legal' as const,
    category: 'Finance',
    domain: 'finance' as const,
    linkedProjects: [],
    linkedPillars: []
  };

  await store.addResource(newLegal);
  const stateAfterLegalAdd = useParaStore.getState();
  const addedLegal = stateAfterLegalAdd.resources.find(r => r.id === newLegal.id);

  if (!addedLegal || addedLegal.type !== 'legal') {
    throw new Error('Failed to add Legal resource correctly.');
  }
  console.log('✅ Successfully added Legal resource.');

  console.log('[TEST] 3. Validating IDB linking logic (project linking)...');
  if (!addedSop.linkedProjects.includes('prj-123')) {
      throw new Error('Failed to link project to resource.');
  }
  console.log('✅ Linkage correct.');

  console.log('[TEST] 4. Testing resource search filtering...');
  const filterStore = useParaStore.getState();
  filterStore.setResourceSearchQuery('cleaning');
  const cleaningResults = filterStore.getFilteredResources();

  if (cleaningResults.length !== 1 || cleaningResults[0].id !== addedSop.id) {
    throw new Error('Failed search filter by title.');
  }

  filterStore.setResourceSearchQuery('Finance');
  const financeResults = filterStore.getFilteredResources();
  if (financeResults.length !== 1 || financeResults[0].id !== addedLegal.id) {
    throw new Error('Failed search filter by category.');
  }
  console.log('✅ Search filtering correct.');

  console.log('[TEST] 5. Testing resource type filtering...');
  filterStore.setResourceSearchQuery('');
  filterStore.setResourceActiveType('legal');

  const legalResults = filterStore.getFilteredResources();
  if (legalResults.length !== 1 || legalResults[0].id !== addedLegal.id) {
      throw new Error('Failed type filtering for "legal".');
  }

  filterStore.setResourceActiveType('all');
  const allResults = filterStore.getFilteredResources();
  if (allResults.length < 2) {
      throw new Error('Failed type filtering for "all".');
  }
  console.log('✅ Type filtering correct.');

  console.log('[TEST] All PARA Resources tests passed successfully! 🚀');
}

testParaResources().catch(e => {
  console.error('[TEST FAILED]', e);
  process.exit(1);
});
