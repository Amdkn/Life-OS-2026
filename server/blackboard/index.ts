import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import {
  createWorkspace,
  getWorkspaces,
  appendEvent,
  getEvents,
  getEventsByWorkspace,
  acquireLock,
  releaseLock,
  createArtifact,
  getArtifactsByWorkspace
} from './repository.js';
import { A3CronDispatcher } from '../../src/services/telemetry/a3-cron-dispatcher.js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the database and schema
initDb();

// Start A3 Cron Dispatcher
const dispatcher = new A3CronDispatcher();
dispatcher.start();

// Workspaces
app.get('/api/blackboard/workspaces', (req, res) => {
  try {
    const workspaces = getWorkspaces();
    res.json(workspaces);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blackboard/workspaces', (req, res) => {
  try {
    const workspace = createWorkspace(req.body);
    res.status(201).json(workspace);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Events
app.get('/api/blackboard/events', (req, res) => {
  try {
    const { workspace_id } = req.query;
    if (workspace_id && typeof workspace_id === 'string') {
      const events = getEventsByWorkspace(workspace_id);
      res.json(events);
    } else {
      const events = getEvents();
      res.json(events);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blackboard/events', (req, res) => {
  try {
    const event = appendEvent(req.body);
    res.status(201).json(event);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Locks
app.post('/api/blackboard/locks', (req, res) => {
  try {
    const success = acquireLock(req.body);
    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(409).json({ success: false, error: 'Lock already acquired' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blackboard/locks/:resource_key', (req, res) => {
  try {
    const { locked_by } = req.body;
    const { resource_key } = req.params;
    const success = releaseLock(resource_key, locked_by);
    res.status(200).json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Artifacts
app.get('/api/blackboard/artifacts', (req, res) => {
  try {
    const { workspace_id } = req.query;
    if (!workspace_id || typeof workspace_id !== 'string') {
      res.status(400).json({ error: 'workspace_id query param required' });
      return;
    }
    const artifacts = getArtifactsByWorkspace(workspace_id);
    res.json(artifacts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blackboard/artifacts', (req, res) => {
  try {
    const artifact = createArtifact(req.body);
    res.status(201).json(artifact);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// For testing purposes, we export the app
export { app };

// Start the server if this file is run directly
if (process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('index.js')) {
  const PORT = process.env.PORT || 4445;
  app.listen(PORT, () => {
    console.log(`Blackboard server listening on port ${PORT}`);
  });
}
