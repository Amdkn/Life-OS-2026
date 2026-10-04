import { CapabilityRequest, EffectReceipt } from '../../types/capabilities.js';
import { appendEvent } from '../blackboard/client.js';

export class RiverAdapter {
  async execute(request: CapabilityRequest): Promise<EffectReceipt> {
    console.log(`[River] Evaluating capability request: ${request.domain}.${request.action} on ${request.target}`);

    // We are blocked by human-only auth/permission or an irreversible external action for real GWS capabilities.
    // The instructions state: "If blocked by human-only auth/permission or an irreversible external action, return a typed blocker instead of faking success."
    const receipt: EffectReceipt = {
      correlation_id: request.id,
      status: 'FAILED',
      timestamp: Date.now(),
      error: 'AUTH_REQUIRED: Human-only authentication required for real GWS capability execution'
    };

    // Emit event to Blackboard for persistence and WorkGraph evidence
    try {
      await appendEvent({
        id: `ev-receipt-${request.id}`,
        workspace_id: 'terra-flow-workspace',
        actor_id: 'river-adapter',
        actor_layer: 'system',
        event_type: 'effect_receipt_emitted',
        payload_json: JSON.stringify(receipt),
        timestamp: Date.now(),
      });
    } catch (e) {
      console.warn('[River] Failed to emit receipt event to blackboard', e);
    }

    return receipt;
  }
}

export const riverAdapter = new RiverAdapter();
