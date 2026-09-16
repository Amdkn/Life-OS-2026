import { LinearIssuePayload, SyncResult } from './types';
import { appendEvent } from '../blackboard/client';

// Generic endpoint for the backend which handles Linear API interaction
// (The Linear API Key is strictly server-side).
const LINEAR_SYNC_ENDPOINT = 'http://localhost:3001/api/bridge/linear/sync';

/**
 * Attempts to sync an issue payload to the Linear backend service.
 * If the service is unreachable (offline) or returns an error, it queues
 * the payload locally in the Blackboard Outbox for future retry.
 */
export async function pushToLinear(payload: LinearIssuePayload): Promise<SyncResult> {
  try {
    const res = await fetch(LINEAR_SYNC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Linear sync failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      success: true,
      issue: data.issue
    };
  } catch (error: any) {
    // Offline or network failure: fallback to blackboard outbox queue
    console.warn('[Linear Sync] Backend unreachable or failed. Queuing to outbox.', error);

    try {
      await appendEvent({
        id: `evt-lin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        workspace_id: null,
        actor_id: 'system',
        actor_layer: 'adapter',
        event_type: 'linear_sync_issue',
        payload_json: JSON.stringify(payload),
        timestamp: Date.now()
      });

      return {
        success: false,
        queued: true,
        error: error.message
      };
    } catch (queueError: any) {
      console.error('[Linear Sync] Failed to queue to outbox.', queueError);
      return {
        success: false,
        queued: false,
        error: 'Failed to sync and failed to queue'
      };
    }
  }
}

export async function syncIssue(payload: LinearIssuePayload): Promise<SyncResult> {
  return pushToLinear(payload);
}
