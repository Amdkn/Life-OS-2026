import { installScopedStorage } from '../src/lib/storage-scope';

// Mock localStorage
const store: Record<string, string> = {};

global.window = {} as any;
global.localStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => {
    Object.keys(store).forEach(k => delete store[k]);
  },
  length: 0,
  key: (index: number) => null,
};
global.Storage = {
  prototype: {
    getItem: function(this: any, key: string) { return store[key] || null; },
    setItem: function(this: any, key: string, value: string) { store[key] = value; },
    removeItem: function(this: any, key: string) { delete store[key]; }
  }
} as any;

global.localStorage.setItem = function(key: string, value: string) {
  global.Storage.prototype.setItem.call(this, key, value);
};

global.localStorage.getItem = function(key: string) {
  return global.Storage.prototype.getItem.call(this, key);
};

global.localStorage.removeItem = function(key: string) {
  return global.Storage.prototype.removeItem.call(this, key);
};

const LAYOUT_KEY = 'aspace-shell-layout-v1';

function runTests() {
  console.log('--- STARTING STORAGE SCOPE TESTS ---\n');

  installScopedStorage('life-os');

  // TEST 1: Positive Case - Normal Save and Load
  console.log('Test 1: Normal save and load');
  const dummyState = JSON.stringify({ version: '0.1.1', state: { windows: [], vetoEngaged: false } });

  localStorage.setItem(LAYOUT_KEY, dummyState);

  const rawScoped = store[`life-os:${LAYOUT_KEY}`];
  const rawLegacy = store[LAYOUT_KEY];

  if (!rawScoped) throw new Error('Scoped key was not created');
  if (!rawLegacy) throw new Error('Legacy fallback key was not created');

  // The retrieved item should match exactly what we put in
  const retrieved = localStorage.getItem(LAYOUT_KEY);
  if (retrieved !== dummyState) {
    throw new Error(`Retrieved state mismatch.\nExpected: ${dummyState}\nGot: ${retrieved}`);
  }

  console.log('✅ Test 1 Passed: Data is properly scoped, raw fallback exists, and decoding works.\n');


  // TEST 2: Negative Case - Corrupted Data (should clear and return null)
  console.log('Test 2: Corrupted Data Handling');

  // Corrupt the scoped key directly in the store
  store[`life-os:${LAYOUT_KEY}`] = '{"version": "wrong", "data": "corrupted", "timestamp": 123}';

  const retrievedCorrupted = localStorage.getItem(LAYOUT_KEY);

  if (retrievedCorrupted !== null) {
    throw new Error(`Expected null for corrupted data, got: ${retrievedCorrupted}`);
  }

  // Check if it silently deleted the corrupted scoped key
  if (store[`life-os:${LAYOUT_KEY}`] !== undefined) {
    throw new Error('Scoped key was not silently removed upon detecting corruption');
  }

  console.log('✅ Test 2 Passed: Corrupted data gracefully returned null and cleaned up the scoped key.\n');


  // TEST 3: Negative Case - Invalid JSON Structure (should clear and return null)
  console.log('Test 3: Invalid JSON Handling');

  localStorage.setItem(LAYOUT_KEY, dummyState);
  store[`life-os:${LAYOUT_KEY}`] = 'Not even JSON';

  const retrievedInvalidJson = localStorage.getItem(LAYOUT_KEY);

  if (retrievedInvalidJson !== null) {
    throw new Error(`Expected null for invalid JSON, got: ${retrievedInvalidJson}`);
  }

  if (store[`life-os:${LAYOUT_KEY}`] !== undefined) {
    throw new Error('Scoped key was not silently removed upon detecting invalid JSON');
  }

  console.log('✅ Test 3 Passed: Invalid JSON gracefully returned null and cleaned up the scoped key.\n');


  console.log('--- ALL TESTS PASSED ---');
  process.exit(0);
}

try {
  runTests();
} catch (e) {
  console.error('❌ TEST FAILED:', e);
  process.exit(1);
}
