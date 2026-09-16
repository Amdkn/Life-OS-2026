import {
  SystemEvent,
  ContractRegistry,
  EventDispatcher,
  ContractError
} from '../src/contracts/crossCategoryEvents';

async function runTests() {
  console.log('--- Starting Cross-Category Contract Tests ---');

  const registry = new ContractRegistry();
  const dispatcher = new EventDispatcher(registry);

  let effectCounter = 0;

  // Register a valid contract
  registry.register('AGENT_TASK_ASSIGNED', {
    producer: 'AgentPortal',
    consumer: 'TwelveWeekYear',
    schemaVersion: 1,
    authorizedScopes: ['system:internal', 'tenant:a2'],
    validatePayload: (payload: any): payload is { taskId: string } => {
      return payload && typeof payload.taskId === 'string';
    },
    handler: async (event: SystemEvent) => {
      effectCounter++;
    }
  });

  const baseEvent: SystemEvent = {
    schemaVersion: 1,
    eventId: 'evt_123',
    correlationId: 'corr_456',
    occurredAt: new Date().toISOString(),
    aggregateId: 'agent_task_789',
    aggregateVersion: 1,
    type: 'AGENT_TASK_ASSIGNED',
    payload: { taskId: 'task_001' }
  };

  const validContext = { service: 'TestService', scope: 'tenant:a2' };

  // Test 1: Successful delivery (l'événement traverse jusqu'à son effet)
  try {
    await dispatcher.dispatch(baseEvent, validContext);
    if (effectCounter !== 1) throw new Error('Effect was not triggered');
    console.log('✅ Test 1 Passed: Successful delivery');
  } catch (e) {
    console.error('❌ Test 1 Failed:', e);
    process.exit(1);
  }

  // Test 2: Idempotency (Même eventId livré deux fois : un seul effet persistant)
  try {
    await dispatcher.dispatch(baseEvent, validContext);
    if (effectCounter !== 1) throw new Error('Effect was triggered multiple times for same eventId');
    console.log('✅ Test 2 Passed: Idempotency enforced');
  } catch (e) {
    console.error('❌ Test 2 Failed:', e);
    process.exit(1);
  }

  // Test 3: Structured rejection - Invalid Payload
  try {
    await dispatcher.dispatch({
      ...baseEvent,
      eventId: 'evt_payload_err',
      payload: { wrongField: 123 }
    }, validContext);
    throw new Error('Should have rejected invalid payload');
  } catch (e: any) {
    if (e.type !== 'INVALID_PAYLOAD') throw e;
    console.log('✅ Test 3 Passed: Rejected invalid payload');
  }

  // Test 4: Structured rejection - Unknown Version (Newer version than supported)
  try {
    await dispatcher.dispatch({
      ...baseEvent,
      eventId: 'evt_ver_err',
      schemaVersion: 2
    }, validContext);
    throw new Error('Should have rejected unknown version');
  } catch (e: any) {
    if (e.type !== 'UNKNOWN_VERSION') throw e;
    console.log('✅ Test 4 Passed: Rejected unknown version');
  }

  // Test 5: Structured rejection - BLOCKED_CONTRACT (Older version than supported by consumer)
  try {
    await dispatcher.dispatch({
      ...baseEvent,
      eventId: 'evt_block_err',
      schemaVersion: 0
    }, validContext);
    throw new Error('Should have blocked older incompatible version');
  } catch (e: any) {
    if (e.type !== 'BLOCKED_CONTRACT') throw e;
    console.log('✅ Test 5 Passed: BLOCKED_CONTRACT for older incompatible version');
  }

  // Test 6: Structured rejection - Falsified Tenant
  try {
    await dispatcher.dispatch({
      ...baseEvent,
      eventId: 'evt_tenant_err'
    }, { service: 'HackerService', scope: 'tenant:rogue' });
    throw new Error('Should have rejected falsified tenant');
  } catch (e: any) {
    if (e.type !== 'FALSIFIED_TENANT') throw e;
    console.log('✅ Test 6 Passed: Rejected falsified tenant scope');
  }

  // Test 7: Missing Contract / Unregistered Event Type
  try {
    await dispatcher.dispatch({
      ...baseEvent,
      eventId: 'evt_missing_err',
      type: 'SOME_UNKNOWN_EVENT'
    }, validContext);
    throw new Error('Should have rejected unregistered event type');
  } catch (e: any) {
    if (e.type !== 'BLOCKED_CONTRACT') throw e;
    console.log('✅ Test 7 Passed: BLOCKED_CONTRACT for missing contract');
  }

  console.log('🎉 All Cross-Category Contract tests passed successfully!');
}

runTests().catch(e => {
  console.error('Unhandled Test Failure:', e);
  process.exit(1);
});
