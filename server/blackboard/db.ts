import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'blackboard.sqlite');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Perform automated backup before applying migrations
if (fs.existsSync(DB_PATH)) {
  const backupPath = path.join(DB_DIR, `blackboard_backup_${Date.now()}.sqlite`);
  fs.copyFileSync(DB_PATH, backupPath);
}

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

const initSql = `
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain_id TEXT,
  status TEXT NOT NULL,
  linear_team_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  actor_id TEXT NOT NULL,
  actor_layer TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
);

CREATE INDEX IF NOT EXISTS idx_events_workspace_id ON events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);

CREATE TABLE IF NOT EXISTS locks (
  id TEXT PRIMARY KEY,
  resource_key TEXT UNIQUE NOT NULL,
  locked_by TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_locks_expires_at ON locks(expires_at);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  content_path TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
);

CREATE INDEX IF NOT EXISTS idx_artifacts_workspace_id ON artifacts(workspace_id);

-- PRD-052 Additive Schema Consumers (Views)
-- mapping blackboard_items to events, agent_locks to locks, vessel_states to workspaces, action_receipts to events (type filtered)
CREATE VIEW IF NOT EXISTS blackboard_items AS SELECT * FROM events;
CREATE VIEW IF NOT EXISTS agent_locks AS SELECT * FROM locks;
CREATE VIEW IF NOT EXISTS vessel_states AS SELECT * FROM workspaces;
CREATE VIEW IF NOT EXISTS action_receipts AS SELECT * FROM events WHERE event_type = 'action_receipt';
`;

export function initDb() {
  db.exec(initSql);
}
