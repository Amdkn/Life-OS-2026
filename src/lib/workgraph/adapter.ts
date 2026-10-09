import { EffectReceipt } from '../../types/capabilities.js';
import { appendEvent } from '../blackboard/client.js';

export class LocalWorkGraphAdapter {
  static async submitReceipt(receipt: EffectReceipt): Promise<void> {
    await appendEvent({
      id: receipt.request_id,
      workspace_id: null,
      actor_id: 'river-flow',
      actor_layer: 'system',
      event_type: 'action_receipt',
      payload_json: JSON.stringify({ receipt }),
      timestamp: Date.now()
    });
  }
}
