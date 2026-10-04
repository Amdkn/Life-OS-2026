import { executeCapability } from '../src/lib/capabilities/river-adapter';
import type { CapabilityRequest } from '../src/types/capabilities';
import { randomUUID } from 'node:crypto';

async function runT7Canary() {
  console.log('Running T7 Canary execution (Ikigai -> 12WY -> GTD -> CapabilityRequest -> River)...');
  const correlation_id = randomUUID();
  const request: CapabilityRequest = {
    id: randomUUID(),
    capability: 'task.create',
    payload: {
      title: 'T7 Canary End-to-End Intent',
      source: 'Ikigai -> 12WY -> PARA/GTD'
    },
    correlation_id,
    source: 't7-canary',
    requested_at: new Date().toISOString()
  };

  console.log('Dispatching CapabilityRequest:', request.capability);

  const receipt = await executeCapability(request);

  if (receipt.correlation_id !== correlation_id) {
    console.error('FAIL: Correlation ID mismatch!');
    process.exit(1);
  }

  if (receipt.adapter !== 'river-test-fixture') {
    console.error('FAIL: Expected adapter to be river-test-fixture to not fake real success.');
    process.exit(1);
  }

  if (receipt.status !== 'UNKNOWN' && receipt.status !== 'SUCCESS') {
    console.error(`FAIL: Unexpected receipt status: ${receipt.status}`);
    process.exit(1);
  }

  console.log('SUCCESS: Receipt received and validated.');
  console.log(JSON.stringify(receipt, null, 2));
}

runT7Canary().catch(err => {
  console.error('FAIL: Error running canary test', err);
  process.exit(1);
});
