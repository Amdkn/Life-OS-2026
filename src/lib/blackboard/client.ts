const SERVER_URL = 'http://localhost:4445/api/blackboard';

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

export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await fetch(`${SERVER_URL}/workspaces`);
  if (!res.ok) throw new Error('Failed to fetch workspaces');
  return res.json();
}

export async function createWorkspace(workspace: Workspace): Promise<Workspace> {
  const res = await fetch(`${SERVER_URL}/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workspace)
  });
  if (!res.ok) throw new Error('Failed to create workspace');
  return res.json();
}

export async function getEvents(workspaceId?: string): Promise<BlackboardEvent[]> {
  const url = workspaceId ? `${SERVER_URL}/events?workspace_id=${encodeURIComponent(workspaceId)}` : `${SERVER_URL}/events`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function appendEvent(event: BlackboardEvent): Promise<BlackboardEvent> {
  const res = await fetch(`${SERVER_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  if (!res.ok) throw new Error('Failed to append event');
  return res.json();
}

export async function acquireLock(lock: Lock): Promise<boolean> {
  const res = await fetch(`${SERVER_URL}/locks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lock)
  });
  if (res.status === 409) return false;
  if (!res.ok) throw new Error('Failed to acquire lock');
  const data = await res.json();
  return data.success;
}

export async function releaseLock(resourceKey: string, lockedBy: string): Promise<boolean> {
  const res = await fetch(`${SERVER_URL}/locks/${encodeURIComponent(resourceKey)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locked_by: lockedBy })
  });
  if (!res.ok) throw new Error('Failed to release lock');
  const data = await res.json();
  return data.success;
}

export async function getArtifacts(workspaceId: string): Promise<Artifact[]> {
  const res = await fetch(`${SERVER_URL}/artifacts?workspace_id=${encodeURIComponent(workspaceId)}`);
  if (!res.ok) throw new Error('Failed to fetch artifacts');
  return res.json();
}

export async function createArtifact(artifact: Artifact): Promise<Artifact> {
  const res = await fetch(`${SERVER_URL}/artifacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artifact)
  });
  if (!res.ok) throw new Error('Failed to create artifact');
  return res.json();
}
