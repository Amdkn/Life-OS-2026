import assert from 'node:assert';
import { calculateWeeklyScore } from '../src/apps/twelve-week/hooks/useWeeklyScore';
import { WyTactic, WyGoal } from '../src/stores/fw-12wy.store';

function runTests() {
  console.log('Running PRD-005 Tests for 12WY Weekly Score...');

  const activeVisionId = 'vision-current';
  const otherVisionId = 'vision-past';

  const goals: WyGoal[] = [
    { id: 'goal-1', visionId: activeVisionId, type: 'wy-goal', targetWeek: 12, status: 'in-progress', title: 'Goal 1', description: '', updatedAt: 0, createdAt: 0 },
    { id: 'goal-other', visionId: otherVisionId, type: 'wy-goal', targetWeek: 12, status: 'achieved', title: 'Other Goal', description: '', updatedAt: 0, createdAt: 0 },
  ];

  const createTactic = (id: string, goalId: string, week: number, status: WyTactic['status']): WyTactic => ({
    id, goalId, week, status, type: 'wy-tactic', title: `Tactic ${id}`, description: '', updatedAt: 0, createdAt: 0
  });

  // Test 1: Null denominator (no tactics for the week/cycle)
  const res1 = calculateWeeklyScore([], goals, activeVisionId, 1);
  assert.strictEqual(res1.score, null, 'Test 1: score should be null when denominator is 0');
  assert.strictEqual(res1.status, 'unmeasured', 'Test 1: status should be unmeasured');

  // Test 2: Only completed, pending, failed are counted. (Ignoring any weird status if injected, though TS prevents it, we test exact match behavior)
  const tactics2 = [
    createTactic('t1', 'goal-1', 1, 'completed'),
    createTactic('t2', 'goal-1', 1, 'completed'),
    createTactic('t3', 'goal-1', 1, 'pending'),
    createTactic('t4', 'goal-1', 1, 'failed'),
  ];
  const res2 = calculateWeeklyScore(tactics2, goals, activeVisionId, 1);
  assert.strictEqual(res2.score, 50, 'Test 2: score should be 50% (2/4)');
  assert.strictEqual(res2.status, 'red', 'Test 2: status should be red (< 70)');

  // Test 3: Exact 85 threshold (17/20)
  const tactics3 = Array.from({ length: 20 }, (_, i) =>
    createTactic(`t${i}`, 'goal-1', 1, i < 17 ? 'completed' : 'pending')
  );
  const res3 = calculateWeeklyScore(tactics3, goals, activeVisionId, 1);
  assert.strictEqual(res3.score, 85, 'Test 3: score should be 85%');
  assert.strictEqual(res3.status, 'green', 'Test 3: status should be green (>= 85)');

  // Test 4: 70 threshold (14/20)
  const tactics4 = Array.from({ length: 20 }, (_, i) =>
    createTactic(`t${i}`, 'goal-1', 1, i < 14 ? 'completed' : 'pending')
  );
  const res4 = calculateWeeklyScore(tactics4, goals, activeVisionId, 1);
  assert.strictEqual(res4.score, 70, 'Test 4: score should be 70%');
  assert.strictEqual(res4.status, 'yellow', 'Test 4: status should be yellow (>= 70 and < 85)');

  // Test 5: 11/13 case (84.6% -> rounded 85, but should be yellow)
  const tactics5 = Array.from({ length: 13 }, (_, i) =>
    createTactic(`t${i}`, 'goal-1', 1, i < 11 ? 'completed' : 'pending')
  );
  const res5 = calculateWeeklyScore(tactics5, goals, activeVisionId, 1);
  assert.strictEqual(res5.score, 85, 'Test 5: displayed score should be rounded to 85%');
  assert.strictEqual(res5.status, 'yellow', 'Test 5: status should be yellow because exactly 84.6... < 85');

  // Test 6: Cycle isolation.
  // 10 tactics for active cycle (all complete), 10 for other cycle (all pending).
  // Active cycle should be 100%, ignoring the other cycle's tactics.
  const tactics6 = [
    ...Array.from({ length: 10 }, (_, i) => createTactic(`a${i}`, 'goal-1', 1, 'completed')),
    ...Array.from({ length: 10 }, (_, i) => createTactic(`o${i}`, 'goal-other', 1, 'pending')),
  ];
  const res6 = calculateWeeklyScore(tactics6, goals, activeVisionId, 1);
  assert.strictEqual(res6.score, 100, 'Test 6: score should be 100%, ignoring other cycle');

  // Test 7: Deduplication by ID
  const tactics7 = [
    createTactic('t1', 'goal-1', 1, 'completed'),
    createTactic('t1', 'goal-1', 1, 'completed'), // duplicate
    createTactic('t2', 'goal-1', 1, 'pending'),
  ];
  const res7 = calculateWeeklyScore(tactics7, goals, activeVisionId, 1);
  assert.strictEqual(res7.score, 50, 'Test 7: score should be 50% (1/2) after deduplication');

  console.log('All tests passed successfully!');
}

runTests();
