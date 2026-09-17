import { REAL_REGISTRY, useCronsStore } from '../src/stores/crons.store.js';

async function run() {
  console.log('Testing Cron Registry Store...');
  const store = useCronsStore.getState();

  // 1. Initial state check
  if (store.crons.length !== 0) {
    console.error('Initial crons state should be empty');
    process.exit(1);
  }

  // 2. Fetch crons
  try {
    await store.fetchCrons();
    const updatedStore = useCronsStore.getState();
    if (updatedStore.crons.length !== REAL_REGISTRY.length) {
      console.error(`Expected ${REAL_REGISTRY.length} crons, got ${updatedStore.crons.length}`);
      process.exit(1);
    }
    console.log('Fetch crons successful!');
  } catch(e) {
    // If backend isn't available, we expect a fallback to the REAL_REGISTRY
    const updatedStore = useCronsStore.getState();
    if (updatedStore.crons.length !== REAL_REGISTRY.length) {
      console.error('Fallback failed');
      process.exit(1);
    }
    console.log('Backend not available, fallback applied successfully.');
  }

  // Ensure 'Heartbeat 15m' exists
  const hasHeartbeat = useCronsStore.getState().crons.some(c => c.frequency === 'Heartbeat 15m');
  if (!hasHeartbeat) {
     console.error('Missing Heartbeat 15m cron');
     process.exit(1);
  }

  console.log('Test completed successfully.');
  process.exit(0);
}

run();
