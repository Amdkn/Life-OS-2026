import { CapabilityRequest, EffectReceipt, GwsEffect } from './types.js';

/**
 * Adapter for River to process CapabilityRequests and return EffectReceipts.
 * According to PRD-093 and HANDOVER, external capabilities (e.g. Agent Portal tasks, GWS)
 * follow a bounded execution path: CapabilityRequest -> River capability adapter -> EffectReceipt.
 * Fixture paths must explicitly mark evidence as simulated.
 */
export class RiverCapabilityAdapter {
    private readonly mode: 'real' | 'river-test-fixture';

    constructor(mode: 'real' | 'river-test-fixture' = 'river-test-fixture') {
        this.mode = mode;
    }

    async executeGwsCapability(request: CapabilityRequest<any>): Promise<EffectReceipt<GwsEffect>> {
        console.log(`[RiverCapabilityAdapter] Received GWS capability request: ${request.capability}`);

        if (this.mode === 'river-test-fixture') {
            // Simulated response for tests/canary
            return {
                id: crypto.randomUUID(),
                requestId: request.id,
                status: 'UNKNOWN', // Must not fake real success
                effect: {
                    service: 'calendar',
                    action: 'create_event',
                    resourceId: 'simulated-resource-id'
                },
                completedAt: Date.now(),
                error: 'Simulated execution (river-test-fixture) - external effect not verifiable'
            };
        }

        // Real integration would go here (e.g., calling actual Google Workspace APIs)
        throw new Error('Real GWS capability execution not yet implemented');
    }
}
