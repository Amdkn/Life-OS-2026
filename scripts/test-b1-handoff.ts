import { B1HandoffQueue } from '../src/services/governance/b1-handoff-queue';
import { FranchiseId } from '../src/types/franchise';

// Mock fetch for isolated testing without actual blackboard server
const originalFetch = global.fetch;

let eventsStore: any[] = [];

(global as any).fetch = async (url: string, options: any) => {
  if (url.includes('/api/blackboard/events')) {
    if (options?.method === 'POST') {
      const body = JSON.parse(options.body);
      eventsStore.push({
         ...body,
         payload_json: body.payload_json // Keep it as string internally like the real db
      });
      return { ok: true, json: async () => body } as any;
    } else {
        // GET events
        return { ok: true, json: async () => eventsStore } as any;
    }
  }

  return originalFetch(url, options);
};

async function runTests() {
  console.log('--- RUNNING B1 HANDOFF QUEUE TESTS ---');
  eventsStore = []; // Reset

  const queue = new B1HandoffQueue('test-workspace');
  const franchiseId: FranchiseId = 'abc_childcare';
  const docketRef = 'DOCK-2026-Q3-001';

  // Test 1: Blocking without mandate
  console.log('\n1. Testing blocking without mandate...');
  let b2Auth = await queue.checkB2Authorization(franchiseId, docketRef);
  console.assert(b2Auth === false, 'B2 should NOT be authorized without a ticket');
  let a3Auth = await queue.checkA3B3Authorization(franchiseId, docketRef);
  console.assert(a3Auth === false, 'A3/B3 should NOT be authorized without a ticket');
  console.log('✅ Blocking without mandate passed.');

  // Test 2: Idempotent ticket creation
  console.log('\n2. Testing idempotent ticket creation...');
  const ticket1 = await queue.createTicket(franchiseId, docketRef, 'Launch new product', 'Details...');
  console.assert(ticket1.state === 'draft', 'Ticket should start in draft state');
  console.assert(ticket1.id === `${franchiseId}-${docketRef}`, 'Ticket ID mismatch');

  const ticket2 = await queue.createTicket(franchiseId, docketRef, 'Launch new product 2', 'Different details...');
  console.assert(ticket1.id === ticket2.id, 'Idempotent creation failed, IDs differ');
  console.assert(eventsStore.length === 1, 'Should only create one event for ticket creation');
  console.log('✅ Idempotent ticket creation passed.');

  // Test 3: State transitions and B2 Auth
  console.log('\n3. Testing state transitions and B2 authorization...');
  const updatedTicket = await queue.updateTicketState(ticket1.id, 'approved_b1', 'B1');
  console.assert(updatedTicket.state === 'approved_b1', 'State should be approved_b1');

  b2Auth = await queue.checkB2Authorization(franchiseId, docketRef);
  console.assert(b2Auth === true, 'B2 SHOULD be authorized with an approved_b1 ticket');
  console.log('✅ State transitions and B2 authorization passed.');

  // Test 4: B2 DoD Validation and A3/B3 Auth
  console.log('\n4. Testing B2 DoD Validation and A3/B3 authorization...');
  a3Auth = await queue.checkA3B3Authorization(franchiseId, docketRef);
  console.assert(a3Auth === false, 'A3/B3 should NOT be authorized before DoD validation');

  const dodTicket = await queue.validateB2DoD(ticket1.id);
  console.assert(dodTicket.b2DoDValidated === true, 'DoD should be validated');
  console.assert(dodTicket.state === 'approved_b2', 'State should be approved_b2 after DoD validation');

  a3Auth = await queue.checkA3B3Authorization(franchiseId, docketRef);
  console.assert(a3Auth === true, 'A3/B3 SHOULD be authorized after DoD validation');
  console.log('✅ B2 DoD Validation and A3/B3 authorization passed.');

  // Test 5: Alerting
  console.log('\n5. Testing direction drift alerting...');
  await queue.alertDirectionDrift(ticket1.id, 'Scope creep detected in phase 2');

  const finalTicket = await queue.getTicket(ticket1.id);
  console.assert(finalTicket !== null, 'Ticket should exist');
  console.assert(finalTicket!.driftAlerts.length === 1, 'Alert should be appended to ticket');
  console.assert(finalTicket!.driftAlerts[0] === 'Scope creep detected in phase 2', 'Alert message mismatch');
  console.log('✅ Direction drift alerting passed.');

  console.log('\n--- ALL B1 HANDOFF QUEUE TESTS PASSED ---');
}

runTests().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
