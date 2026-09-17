import { JSDOM } from 'jsdom';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
(global as any).window = jsdom.window;
(global as any).document = jsdom.window.document;
(global as any).localStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] || null; },
  setItem(key: string, value: string) { this.store[key] = value; },
  removeItem(key: string) { delete this.store[key]; },
  clear() { this.store = {}; }
};

import { createScopedStorage, encodeVersionedEnvelope, getScopedIdbKey } from '../src/lib/storage/scoped';
import assert from 'node:assert';

async function runTests() {
  console.log('--- TEST PRD-024: SCOPED STORAGE & DEFENSIVE MIGRATION ---');

  const scope1 = 'life-os';
  const scope2 = 'business-os';
  const RANDOM_KEY = 'some-random-key';

  const storage1 = createScopedStorage(scope1);
  const storage2 = createScopedStorage(scope2);

  // 1. Isolation Test
  console.log('1. Testing Strict Isolation...');
  storage1.setItem('theme', 'dark');
  storage2.setItem('theme', 'light');

  assert.strictEqual(storage1.getItem('theme'), 'dark', 'Scope 1 should have dark theme');
  assert.strictEqual(storage2.getItem('theme'), 'light', 'Scope 2 should have light theme');
  console.log('   [SUCCESS] Scopes are strictly isolated.');

  // 2. Generic Wrapping Test
  console.log('2. Testing Versioned Envelope Wrapping...');
  const testData = JSON.stringify({ data: 'test' });
  storage1.setItem(RANDOM_KEY, testData);

  const rawScoped = (global as any).localStorage.getItem(`${scope1}:${RANDOM_KEY}`);
  assert.ok(rawScoped.includes('"version":"0.1.1"'), 'Envelope must have schema version');
  assert.ok(rawScoped.includes(testData), 'Envelope must contain original data');

  const retrieved = storage1.getItem(RANDOM_KEY);
  assert.strictEqual(retrieved, testData, 'Should unwrap and return original payload');
  console.log('   [SUCCESS] Data enveloped correctly.');

  // 3. Defensive Cleanup / Corruption Test
  console.log('3. Testing Corrupted Payload Resilience...');
  (global as any).localStorage.setItem(`${scope1}:${RANDOM_KEY}`, '{ corrupted: json... "version": "9.9.9" }');

  const corruptedRetrieved = storage1.getItem(RANDOM_KEY);
  assert.strictEqual(corruptedRetrieved, null, 'Corrupted data should return null to prevent White Screen');
  assert.strictEqual((global as any).localStorage.getItem(`${scope1}:${RANDOM_KEY}`), null, 'Corrupted data should be silently purged');
  console.log('   [SUCCESS] Corrupted data safely ignored and purged.');

  // 4. Legacy Fallback
  console.log('4. Testing Legacy Fallback on Rollback...');
  const legacyData = 'legacy_raw_data';
  (global as any).localStorage.setItem('legacy_key', legacyData);

  const fallbackRetrieved = storage1.getItem('legacy_key');
  assert.strictEqual(fallbackRetrieved, legacyData, 'Should fall back to raw legacy key if scoped key is absent');
  console.log('   [SUCCESS] Legacy read works properly.');

  // 5. IndexedDB Scoping
  console.log('5. Testing IndexedDB Key Scoping...');
  assert.strictEqual(getScopedIdbKey('life-os', 'aspace_ld01'), 'life-os_aspace_ld01');
  assert.strictEqual(getScopedIdbKey('life-os', 'life-os_aspace_ld01'), 'life-os_aspace_ld01');
  console.log('   [SUCCESS] IndexedDB keys scoped properly.');

  console.log('--- ALL TESTS PASSED ---');
}

runTests().catch(e => {
  console.error('--- TEST FAILED ---');
  console.error(e);
  process.exit(1);
});
