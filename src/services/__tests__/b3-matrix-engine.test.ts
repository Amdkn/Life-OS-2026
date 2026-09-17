import { test } from 'node:test';
import assert from 'node:assert';
import { resolveIncarnation } from '../b3-matrix-engine';
import { B3TaskProfile } from '../../types/b3-polymorphic';

test('B3 Matrix Engine Tests', async (t) => {
  await t.test('Deterministic task never routed to LLM', () => {
    const profile: B3TaskProfile = {
      id: 'task-1',
      description: 'Hash validation',
      intelligenceLevel: 'deterministic_code',
      determinismLevel: 'strict_atomic',
      requiredCapabilities: ['fs_hash']
    };

    const result = resolveIncarnation(profile);

    assert.notStrictEqual(result.incarnation, 'agent');
    assert.notStrictEqual(result.incarnation, 'composite');
    assert.strictEqual(result.incarnation, 'hook');
    assert.strictEqual(result.tokenCost, null);
  });

  await t.test('Hybrid task routed to composite (Agent LLM + Gate Hook)', () => {
    const profile: B3TaskProfile = {
      id: 'task-2',
      description: 'Generate report and validate format',
      intelligenceLevel: 'deep_reasoning',
      determinismLevel: 'gated_validation',
      requiredCapabilities: ['report_gen']
    };

    const result = resolveIncarnation(profile);

    assert.strictEqual(result.incarnation, 'composite');
    assert.ok(result.assembly, 'Must define composite assembly');
    assert.strictEqual(result.assembly.primary, 'agent');
    assert.strictEqual(result.assembly.supervisor, 'hook');
  });

  await t.test('Invalid profile rejected (or handled gracefully based on engine behavior)', () => {
    const invalidProfile = {
      id: 'task-err',
      description: 'wat',
      requiredCapabilities: []
    } as unknown as B3TaskProfile;

    assert.throws(() => resolveIncarnation(invalidProfile), /Invalid profile/);
  });

  await t.test('Identical profile yields identical result (Pure & Deterministic)', () => {
    const profile: B3TaskProfile = {
      id: 'task-3',
      description: 'Rule based execution',
      intelligenceLevel: 'rule_based',
      determinismLevel: 'probabilistic_creative', // Not perfectly matching deterministic or hybrid conditions strictly, falls to fallback
      requiredCapabilities: ['math']
    };

    const result1 = resolveIncarnation(profile);
    const result2 = resolveIncarnation(profile);

    assert.deepStrictEqual(result1, result2, 'Results must be deeply identical');
  });
});
