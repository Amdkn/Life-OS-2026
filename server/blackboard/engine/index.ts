import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import type { Lock, BlackboardEvent } from '../repository.js';

export class BlackboardEngine {
  /**
   * Tries to acquire a lock on a specific resource.
   * Cleans up expired locks inherently via database.
   * @param resourceKey Unique identifier for the resource.
   * @param lockedBy Identifier for the agent requesting the lock.
   * @param ttlMs Time-to-live in milliseconds.
   * @returns boolean True if lock acquired, false otherwise.
   */
  public acquireLock(resourceKey: string, lockedBy: string, ttlMs: number): boolean {
    const now = Date.now();
    // Clean up expired locks first
    db.prepare('DELETE FROM locks WHERE expires_at <= ?').run(now);

    const lock: Lock = {
      id: uuidv4(),
      resource_key: resourceKey,
      locked_by: lockedBy,
      expires_at: now + ttlMs
    };

    try {
      const stmt = db.prepare(`
        INSERT INTO locks (id, resource_key, locked_by, expires_at)
        VALUES (@id, @resource_key, @locked_by, @expires_at)
      `);
      stmt.run(lock);
      return true; // Lock acquired
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return false; // Lock already held and not expired
      }
      throw error;
    }
  }

  /**
   * Releases a lock previously acquired by the same agent.
   * @param resourceKey Unique identifier for the resource.
   * @param lockedBy Identifier for the agent that holds the lock.
   * @returns boolean True if successfully released, false if it wasn't held by the agent.
   */
  public releaseLock(resourceKey: string, lockedBy: string): boolean {
    const stmt = db.prepare('DELETE FROM locks WHERE resource_key = ? AND locked_by = ?');
    const info = stmt.run(resourceKey, lockedBy);
    return info.changes > 0;
  }

  /**
   * Records an intention to the blackboard.
   */
  public recordIntention(workspaceId: string | null, actorId: string, actorLayer: string, payload: any): BlackboardEvent {
    const event: BlackboardEvent = {
      id: uuidv4(),
      workspace_id: workspaceId,
      actor_id: actorId,
      actor_layer: actorLayer,
      event_type: 'intention',
      payload_json: JSON.stringify(payload),
      timestamp: Date.now()
    };

    const stmt = db.prepare(`
      INSERT INTO events (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
      VALUES (@id, @workspace_id, @actor_id, @actor_layer, @event_type, @payload_json, @timestamp)
    `);
    stmt.run(event);

    return event;
  }

  /**
   * Records an action receipt to the blackboard.
   */
  public recordActionReceipt(workspaceId: string | null, actorId: string, actorLayer: string, payload: any, explicitId?: string): BlackboardEvent {
    const event: BlackboardEvent = {
      id: explicitId || uuidv4(),
      workspace_id: workspaceId,
      actor_id: actorId,
      actor_layer: actorLayer,
      event_type: 'action_receipt',
      payload_json: JSON.stringify(payload),
      timestamp: Date.now()
    };

    const stmt = db.prepare(`
      INSERT INTO events (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
      VALUES (@id, @workspace_id, @actor_id, @actor_layer, @event_type, @payload_json, @timestamp)
    `);
    stmt.run(event);

    return event;
  }
}

export const blackboardEngine = new BlackboardEngine();
