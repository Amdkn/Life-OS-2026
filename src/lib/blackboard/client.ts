let SERVER_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BLACKBOARD_API_URL) ? import.meta.env.VITE_BLACKBOARD_API_URL : 'http://localhost:4445/api/blackboard';
export function setServerUrl(url: string) { SERVER_URL = url; }

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
  mime_type: string;
  content_path: string;
  created_at: number;
}

// --- Local-First IndexedDB Cache ---
const DB_NAME = 'BlackboardCache';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      // In SSR or testing environments where indexedDB is mocked but window might not have it natively,
      // fallback to globalThis.indexedDB (handled by fake-indexeddb in tests)
      const idb = typeof window !== 'undefined' ? window.indexedDB : (globalThis as any).indexedDB;
      if (!idb) {
        reject(new Error('IndexedDB is not available in this environment'));
        return;
      }

      const request = idb.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('workspaces')) {
          db.createObjectStore('workspaces', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('artifacts')) {
          db.createObjectStore('artifacts', { keyPath: 'id' });
        }
      };
    });
  }
  return dbPromise;
}

async function writeToCache(storeName: string, items: any[]) {
  try {
    const db = await getDb();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`[Blackboard] Failed to write to cache ${storeName}:`, err);
  }
}

async function readFromCache(storeName: string): Promise<any[]> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`[Blackboard] Failed to read from cache ${storeName}:`, err);
    return [];
  }
}
// -----------------------------------

export async function getWorkspaces(): Promise<Workspace[]> {
  try {
    const res = await fetch(`${SERVER_URL}/workspaces`);
    if (!res.ok) throw new Error('Failed to fetch workspaces from network');
    const data = await res.json();
    await writeToCache('workspaces', data);
    return data;
  } catch (err) {
    console.warn('[Blackboard] Network fetch failed, falling back to cache (workspaces)', err);
    return readFromCache('workspaces');
  }
}

export async function createWorkspace(workspace: Workspace): Promise<Workspace> {
  const res = await fetch(`${SERVER_URL}/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workspace)
  });
  if (!res.ok) throw new Error('Failed to create workspace');
  const data = await res.json();
  await writeToCache('workspaces', [data]);
  return data;
}

export async function getEvents(workspaceId?: string): Promise<BlackboardEvent[]> {
  const url = workspaceId ? `${SERVER_URL}/events?workspace_id=${encodeURIComponent(workspaceId)}` : `${SERVER_URL}/events`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch events from network');
    const data = await res.json();
    await writeToCache('events', data);
    return data;
  } catch (err) {
    console.warn('[Blackboard] Network fetch failed, falling back to cache (events)', err);
    const cachedEvents = await readFromCache('events');
    if (workspaceId) {
      return cachedEvents.filter(e => e.workspace_id === workspaceId);
    }
    return cachedEvents;
  }
}

export async function appendEvent(event: BlackboardEvent): Promise<BlackboardEvent> {
  const res = await fetch(`${SERVER_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  if (!res.ok) throw new Error('Failed to append event');
  const data = await res.json();
  await writeToCache('events', [data]);
  return data;
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
  try {
    const res = await fetch(`${SERVER_URL}/artifacts?workspace_id=${encodeURIComponent(workspaceId)}`);
    if (!res.ok) throw new Error('Failed to fetch artifacts from network');
    const data = await res.json();
    await writeToCache('artifacts', data);
    return data;
  } catch (err) {
    console.warn('[Blackboard] Network fetch failed, falling back to cache (artifacts)', err);
    const cachedArtifacts = await readFromCache('artifacts');
    return cachedArtifacts.filter(a => a.workspace_id === workspaceId);
  }
}

export async function createArtifact(artifact: Artifact): Promise<Artifact> {
  const res = await fetch(`${SERVER_URL}/artifacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artifact)
  });
  if (!res.ok) throw new Error('Failed to create artifact');
  const data = await res.json();
  await writeToCache('artifacts', [data]);
  return data;
}

export async function tryAcquireLock(resourceKey: string, lockedBy: string, ttlMs: number): Promise<boolean> {
  const expiresAt = Date.now() + ttlMs;
  return acquireLock({ id: crypto.randomUUID(), resource_key: resourceKey, locked_by: lockedBy, expires_at: expiresAt });
}

export async function recordActionReceipt(workspaceId: string | null, actorId: string, actorLayer: string, payload: any): Promise<BlackboardEvent> {
  const event: BlackboardEvent = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    actor_id: actorId,
    actor_layer: actorLayer,
    event_type: 'action_receipt',
    payload_json: JSON.stringify(payload),
    timestamp: Date.now()
  };
  return appendEvent(event);
}
