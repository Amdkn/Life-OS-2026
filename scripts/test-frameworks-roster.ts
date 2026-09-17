import { vesselConfigs } from '../src/config/vessels.config';
import { FrameworkId } from '../src/types/frameworks';
import assert from 'node:assert';

console.log('--- TEST: Frameworks Roster Validation ---');

function runTests() {
  // 1. Verify exactly 6 vessels
  assert.strictEqual(vesselConfigs.length, 6, 'Should have exactly 6 vessels');
  console.log('✅ Found exactly 6 vessels');

  // 2. Verify all expected IDs are present
  const expectedIds: FrameworkId[] = ['FW01', 'FW02', 'FW03', 'FW04', 'FW05', 'FW06'];
  const actualIds = vesselConfigs.map(c => c.id);

  for (const id of expectedIds) {
    assert(actualIds.includes(id), `Missing Framework ID: ${id}`);
  }
  console.log('✅ All Framework IDs (FW01-FW06) are present');

  // 3. Verify that each vessel has a crew array
  for (const config of vesselConfigs) {
    assert(Array.isArray(config.crew), `Vessel ${config.id} should have a crew array`);
    assert(config.crew.length > 0, `Vessel ${config.id} should have at least one crew member`);

    // Check specific fields on each crew member
    for (const member of config.crew) {
      assert(member.id && typeof member.id === 'string', 'Crew member must have a valid string ID');
      assert(member.name && typeof member.name === 'string', 'Crew member must have a valid string name');
      assert(member.role && typeof member.role === 'string', 'Crew member must have a valid string role');
    }
  }
  console.log('✅ All vessels have a valid crew configuration');

  // 4. Validate specific framework names matching requirements
  const fw1 = vesselConfigs.find(c => c.id === 'FW01')!;
  assert.strictEqual(fw1.frameworkName, 'Ikigai');
  assert.strictEqual(fw1.vesselName, 'Orville');

  const fw2 = vesselConfigs.find(c => c.id === 'FW02')!;
  assert.strictEqual(fw2.frameworkName, 'Life Wheel');
  assert.strictEqual(fw2.vesselName, 'Discovery');

  const fw3 = vesselConfigs.find(c => c.id === 'FW03')!;
  assert.strictEqual(fw3.frameworkName, 'PARA');
  assert.strictEqual(fw3.vesselName, 'Enterprise');

  const fw4 = vesselConfigs.find(c => c.id === 'FW04')!;
  assert.strictEqual(fw4.frameworkName, '12WY');
  assert.strictEqual(fw4.vesselName, 'SNW');

  const fw5 = vesselConfigs.find(c => c.id === 'FW05')!;
  assert.strictEqual(fw5.frameworkName, 'GTD');
  assert.strictEqual(fw5.vesselName, 'Cerritos');

  const fw6 = vesselConfigs.find(c => c.id === 'FW06')!;
  assert.strictEqual(fw6.frameworkName, 'DEAL');
  assert.strictEqual(fw6.vesselName, 'Protostar');

  console.log('✅ All Framework names and Vessel names match requirements');

  console.log('--- ALL TESTS PASSED ---');
}

runTests();
