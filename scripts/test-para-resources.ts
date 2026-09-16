if (typeof (global as any).window === 'undefined') {
  (global as any).window = global;
}
if (typeof (global as any).localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}
if (typeof (global as any).indexedDB === 'undefined') {
  const memoryDb: Record<string, Record<string, any>> = {};
  (global as any).indexedDB = {
    open: (name: string, _version: number) => {
      const req: any = {};
      setTimeout(() => {
        if (!memoryDb[name]) memoryDb[name] = {};
        const fakeDb = {
          objectStoreNames: { contains: () => true },
          createObjectStore: () => {},
          transaction: (_storeNames: any, _mode: any) => {
            const tx: any = {
              oncomplete: null,
              onerror: null,
              objectStore: (_storeName: string) => ({
                put: (item: any) => {
                  const putReq: any = {};
                  setTimeout(() => {
                    memoryDb[name][item.id || item.key || 'item'] = item;
                    if (putReq.onsuccess) putReq.onsuccess({ target: putReq });
                  }, 0);
                  return putReq;
                },
                get: (key: string) => {
                  const getReq: any = {};
                  setTimeout(() => {
                    getReq.result = memoryDb[name][key];
                    if (getReq.onsuccess) getReq.onsuccess({ target: getReq });
                  }, 0);
                  return getReq;
                },
                getAll: () => {
                  const getAllReq: any = {};
                  setTimeout(() => {
                    getAllReq.result = Object.values(memoryDb[name]);
                    if (getAllReq.onsuccess) getAllReq.onsuccess({ target: getAllReq });
                  }, 0);
                  return getAllReq;
                },
                delete: (key: string) => {
                  const delReq: any = {};
                  setTimeout(() => {
                    delete memoryDb[name][key];
                    if (delReq.onsuccess) delReq.onsuccess({ target: delReq });
                  }, 0);
                  return delReq;
                }
              }),
            };
            setTimeout(() => {
              if (tx.oncomplete) tx.oncomplete();
            }, 5);
            return tx;
          }
        };
        req.result = fakeDb;
        if (req.onupgradeneeded) req.onupgradeneeded({ target: req });
        if (req.onsuccess) req.onsuccess({ target: req });
      }, 0);
      return req;
    }
  };
}
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
