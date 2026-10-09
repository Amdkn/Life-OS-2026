import { appendEvent, BlackboardEvent } from '../../../server/blackboard/repository.js';
import { LocalWorkGraphAdapter } from '../../lib/workgraph/adapter.js';
import crypto from 'crypto';

export class RoryEvidenceStore {
  async persistReceipt(correlationId: string, status: string, details: any, actorId: string, actorLayer: string) {
    // LocalWorkGraphAdapter is static since #117 (canonical EffectReceipt) — no instantiation.
    await LocalWorkGraphAdapter.submitReceipt({
      request_id: correlationId,
      correlation_id: correlationId,
      status: status as 'SUCCESS' | 'FAILED' | 'UNKNOWN',
      adapter: 'rory-evidence-store',
      timestamp: Date.now()
    }).catch((e: any) => console.error(e));

    try {
      const event: BlackboardEvent = {
        id: crypto.randomUUID(),
        workspace_id: 'holon-canary',
        actor_id: actorId,
        actor_layer: actorLayer,
        event_type: 'action_receipt',
        payload_json: JSON.stringify({
          correlation_id: correlationId,
          status,
          details,
          timezone: 'America/New_York'
        }),
        timestamp: Date.now()
      };
      appendEvent(event);
    } catch (e: any) {
      if (e.message?.includes('no such table')) {
        console.warn('[RoryEvidenceStore] Skipping DB insert since database tables are not initialized locally');
      } else {
        throw e;
      }
    }
  }
}
