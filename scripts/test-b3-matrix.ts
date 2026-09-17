import { resolveIncarnation } from '../src/services/b3-matrix-engine';
import { B3TaskProfile } from '../src/types/b3-polymorphic';
import assert from 'node:assert';

function runTests() {
  console.log('Running B3 Matrix Engine tests...');

  // Test 1: Deterministic task resolves to Hook/CLI with 0 tokens
  const deterministicTask: B3TaskProfile = {
    id: 'task-calc-tax',
    description: 'Calculate VAT',
    determinismLevel: 'strict_atomic', requiredCapabilities: [],
    intelligenceLevel: 'deterministic_code'
  };

  const deterministicResult = resolveIncarnation(deterministicTask);

  assert.strictEqual(deterministicResult.incarnation, 'hook', 'Deterministic task should resolve to CLI (or hook)');
  assert.strictEqual(deterministicResult.tokenCost, null, 'Deterministic task must have 0 token cost');
  // assert.strictEqual(deterministicResult.determinismLevel, 'strict_atomic', 'Determinism level must match');
  console.log('✅ Test 1 Passed: Deterministic routing');

  // Test 2: Hybrid task resolves to Composite assembly
  const hybridTask: B3TaskProfile = {
    id: 'task-generate-report',
    description: 'Generate report and validate schema',
    determinismLevel: 'gated_validation', requiredCapabilities: [],
    intelligenceLevel: 'light_llm'
  };

  const hybridResult = resolveIncarnation(hybridTask);

  assert.strictEqual(hybridResult.incarnation, 'composite', 'Hybrid task should resolve to composite');
  // assert.strictEqual(hybridResult.determinismLevel, 'gated_validation', 'Composite task should retain gated_validation');
  assert.ok('assembly' in hybridResult, 'Composite wrapper must contain assembly details');
  // @ts-ignore
  assert.strictEqual(hybridResult.assembly.primary, 'agent', 'Primary incarnation should be agent');
  // @ts-ignore
  assert.strictEqual(hybridResult.assembly.supervisor, 'hook', 'Secondary incarnation should be hook');
  console.log('✅ Test 2 Passed: Hybrid (Composite) routing');

  // Test 3: Pure function check (identical profiles return identical results)
  const resultA = resolveIncarnation(hybridTask);
  const resultB = resolveIncarnation(hybridTask);
  assert.deepStrictEqual(resultA, resultB, 'Pure function must return identical results for identical inputs');
  console.log('✅ Test 3 Passed: Pure function property');

  // Test 4: Negative case (invalid profile is rejected)
  try {
    // @ts-ignore
    resolveIncarnation({ description: 'Invalid task missing id' });
    assert.fail('Should have thrown an error for missing id');
  } catch (err: any) {
    assert.match(err.message, /Invalid profile/, 'Error message should mention missing id');
    console.log('✅ Test 4 Passed: Invalid profile rejection');
  }

  console.log('🎉 All B3 Matrix Engine tests passed!');
}

runTests();
