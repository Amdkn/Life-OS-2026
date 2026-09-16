import { db } from './db.js';

export interface Workspace {
  id: string;
  name: string;
  domain_id: string | null;
  status: string;
  linear_team_id: string | null;
  created_at: number;
  updated_at: number;
}

export interface BlackboardEvent {
  id: string;
  workspace_id: string | null;
  actor_id: string;
  actor_layer: string;
  event_type: string;
  payload_json: string;
  timestamp: number;
}

export interface Lock {
  id: string;
  resource_key: string;
  locked_by: string;
  expires_at: number;
}

export interface Artifact {
  id: string;
  workspace_id: string | null;
  name: string;
  content: string;
  content_type: string;
  created_at: number;
}

// Workspaces
export function createWorkspace(workspace: Workspace) {
  const stmt = db.prepare(`
    INSERT INTO workspaces (id, name, domain_id, status, linear_team_id, created_at, updated_at)
    VALUES (@id, @name, @domain_id, @status, @linear_team_id, @created_at, @updated_at)
  `);
  stmt.run(workspace);
  return workspace;
}

export function getWorkspaces(): Workspace[] {
  return db.prepare('SELECT * FROM workspaces').all() as Workspace[];
}

// Events (Append-only)
export function appendEvent(event: BlackboardEvent) {
  const stmt = db.prepare(`
    INSERT INTO events (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
    VALUES (@id, @workspace_id, @actor_id, @actor_layer, @event_type, @payload_json, @timestamp)
  `);
  stmt.run(event);
  return event;
}

export function getEvents(): BlackboardEvent[] {
  return db.prepare('SELECT * FROM events ORDER BY timestamp ASC').all() as BlackboardEvent[];
}

export function getEventsByWorkspace(workspaceId: string): BlackboardEvent[] {
  return db.prepare('SELECT * FROM events WHERE workspace_id = ? ORDER BY timestamp ASC').all(workspaceId) as BlackboardEvent[];
}

// Locks
export function acquireLock(lock: Lock): boolean {
  const now = Date.now();

  // Clean up expired locks first
  db.prepare('DELETE FROM locks WHERE expires_at <= ?').run(now);

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

export function releaseLock(resourceKey: string, lockedBy: string): boolean {
  const stmt = db.prepare('DELETE FROM locks WHERE resource_key = ? AND locked_by = ?');
  const info = stmt.run(resourceKey, lockedBy);
  return info.changes > 0;
}

// Artifacts
export function createArtifact(artifact: Artifact) {
  const stmt = db.prepare(`
    INSERT INTO artifacts (id, workspace_id, name, content, content_type, created_at)
    VALUES (@id, @workspace_id, @name, @content, @content_type, @created_at)
  `);
  stmt.run(artifact);
  return artifact;
}

export function getArtifactsByWorkspace(workspaceId: string): Artifact[] {
  return db.prepare('SELECT * FROM artifacts WHERE workspace_id = ?').all(workspaceId) as Artifact[];
}
