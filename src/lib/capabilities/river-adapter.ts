import { CapabilityRequest, EffectReceipt } from '../../types/capabilities';

export async function executeCapability(request: CapabilityRequest): Promise<EffectReceipt> {
  // Mock/fixture path explicitly marks evidence as simulated (adapter: 'river-test-fixture')
  // and returns UNKNOWN status to indicate mock execution instead of faking a real success.

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: globalThis.crypto.randomUUID(),
        request_id: request.id,
        correlation_id: request.correlation_id,
        status: 'UNKNOWN',
        adapter: 'river-test-fixture',
        external_id: `mock-${globalThis.crypto.randomUUID()}`,
        readback: {
          mocked: true,
          original_payload: request.payload
        },
        completed_at: new Date().toISOString()
      });
    }, 1500); // simulate network latency
  });
}
