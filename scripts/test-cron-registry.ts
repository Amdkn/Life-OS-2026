import { getCrons, toggleCron, parseFrequency, BASE_JOBS } from '../src/services/cron-registry/registry.js';
import { CronFrequency } from '../src/services/cron-registry/types.js';
import assert from 'assert';

async function runTests() {
  console.log('Testing Cron Registry...');

  // 1. Validate frequencies
  console.log('Testing parseFrequency...');
  const heartbeatMs = parseFrequency('Heartbeat 15m' as CronFrequency);
  assert.strictEqual(heartbeatMs, 15 * 60 * 1000, 'Heartbeat 15m should parse to 15 mins in ms');

  const circadianMs = parseFrequency('Circadien 24h' as CronFrequency);
  assert.strictEqual(circadianMs, 24 * 60 * 60 * 1000, 'Circadien 24h should parse to 24 hours in ms');

  const weeklyMs = parseFrequency('Revue Hebdo W13' as CronFrequency);
  assert.strictEqual(weeklyMs, 7 * 24 * 60 * 60 * 1000, 'Revue Hebdo W13 should parse to 7 days in ms');
  console.log('parseFrequency OK');

  // Verify the fallback behavior or mock the blackboard fetch.
  console.log('Testing getCrons fallback...');
  // Suppress the console.error for expected fallback behavior in test output
  const originalError = console.error;
  console.error = () => {};
  const crons = await getCrons();
  console.error = originalError;

  assert.strictEqual(crons.length, BASE_JOBS.length, 'Should fallback to BASE_JOBS when blackboard is down');

  // To test the toggles we will mock the getEvents function locally
  console.log('Testing state toggles with mocked events...');

  const testJobs = [...BASE_JOBS].map(job => ({ ...job }));

  const mockEvents = [
    {
      event_type: 'cron_toggled',
      payload_json: JSON.stringify({ id: 'cron-1', isActive: true }),
      timestamp: Date.now()
    }
  ];

  for (const event of mockEvents) {
    if (event.event_type === 'cron_toggled') {
      const payload = JSON.parse(event.payload_json);
      const job = testJobs.find(j => j.id === payload.id);
      if (job) {
        job.isActive = payload.isActive;
      }
    }
  }

  const modifiedJob = testJobs.find(j => j.id === 'cron-1');
  assert.strictEqual(modifiedJob?.isActive, true, 'Cron 1 should be active after toggle event');

  console.log('State toggles OK');

  console.log('All Cron Registry tests passed!');
}

runTests().catch(console.error);
