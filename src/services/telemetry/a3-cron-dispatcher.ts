import { acquireLock, appendEvent, getEventsByWorkspace, getWorkspaces, createWorkspace, BlackboardEvent, Lock } from '../../../server/blackboard/repository.js';
import crypto from 'crypto';

export interface CronJobConfig {
  id: string;
  name: string;
  frequencyMs: number;
}

export const A3_CRON_REGISTRY: CronJobConfig[] = [
  { id: 'cron-telemetry', name: 'Télémetrie (Yas / Kernel Core)', frequencyMs: 60 * 1000 },
  { id: 'cron-weekly', name: 'Revue hebdomadaire Wx (Tendi & River Song)', frequencyMs: 7 * 24 * 60 * 60 * 1000 },
  { id: 'cron-audit', name: 'Audit homéostasie cognitive (Hugh Culber & Rory)', frequencyMs: 24 * 60 * 60 * 1000 },
  { id: 'cron-distillation', name: 'Distillation incrémentale 50_ (Graham & Rick)', frequencyMs: 24 * 60 * 60 * 1000 },
];

const WORKSPACE_ID = 'cron-registry-workspace';
const ACTOR_ID = 'a3-cron-dispatcher';
const ACTOR_LAYER = 'system';

export class A3CronDispatcher {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  start() {
    this.ensureWorkspace();
    for (const job of A3_CRON_REGISTRY) {
      this.scheduleJob(job);
    }
  }

  stop() {
    for (const [, timer] of this.intervals) {
      clearInterval(timer);
    }
    this.intervals.clear();
  }

  private ensureWorkspace() {
    try {
      const workspaces = getWorkspaces();
      if (!workspaces.find(w => w.id === WORKSPACE_ID)) {
        createWorkspace({
          id: WORKSPACE_ID,
          name: 'Cron Registry',
          domain_id: null,
          status: 'active',
          linear_team_id: null,
          created_at: Date.now(),
          updated_at: Date.now()
        });
      }
    } catch (e) {
      console.warn('[A3CronDispatcher] Could not ensure workspace', e);
    }
  }

  private async executeJob(job: CronJobConfig) {
    const resourceKey = `lock-cron-${job.id}`;
    const lockedBy = `${ACTOR_ID}-${process.pid}`;

    // Check last run time
    const events = getEventsByWorkspace(WORKSPACE_ID);
    let lastRun = 0;
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i];
      if (ev.event_type === 'cron_pulsed') {
        try {
           const payload = JSON.parse(ev.payload_json);
           if (payload.id === job.id && payload.status === 'success') {
              lastRun = ev.timestamp;
              break;
           }
        } catch (e) {
           // ignore
        }
      }
    }

    const now = Date.now();
    if (now - lastRun < job.frequencyMs) {
        // Already ran recently
        return;
    }

    const ttlMs = job.frequencyMs * 0.5; // lock for half the frequency

    const lock: Lock = {
      id: crypto.randomUUID(),
      resource_key: resourceKey,
      locked_by: lockedBy,
      expires_at: Date.now() + ttlMs
    };

    const acquired = acquireLock(lock);
    if (!acquired) {
      return; // Another instance is handling it
    }

    try {
      // Create pulse event in blackboard
      const event: BlackboardEvent = {
        id: crypto.randomUUID(),
        workspace_id: WORKSPACE_ID,
        actor_id: ACTOR_ID,
        actor_layer: ACTOR_LAYER,
        event_type: 'cron_pulsed',
        payload_json: JSON.stringify({
          id: job.id,
          name: job.name,
          status: 'success',
          timezone: 'America/New_York'
        }),
        timestamp: Date.now(),
      };

      appendEvent(event);
      console.log(`[A3CronDispatcher] Executed cron: ${job.id}`);

    } catch (error: any) {
      console.error(`[A3CronDispatcher] Failed cron: ${job.id}`, error);

      // Mark as missed
      const missedEvent: BlackboardEvent = {
        id: crypto.randomUUID(),
        workspace_id: WORKSPACE_ID,
        actor_id: ACTOR_ID,
        actor_layer: ACTOR_LAYER,
        event_type: 'cron_pulsed',
        payload_json: JSON.stringify({
          id: job.id,
          name: job.name,
          status: 'missed',
          error: error.message,
          timezone: 'America/New_York'
        }),
        timestamp: Date.now(),
      };
      appendEvent(missedEvent);

    }
  }

  private scheduleJob(job: CronJobConfig) {
    // Add light jitter (0-5%)
    const jitter = Math.random() * (job.frequencyMs * 0.05);
    // Initial check (interval runs after frequencyMs, so we do one pass after jitter)
    setTimeout(() => {
        // use interval loop but shorter so we don't wait 1 week on server restart to check!
        // The requirement is that it functions as a backend cron system.
        // We poll every 1 minute to check if the cron needs running
        this.executeJob(job);
    }, jitter);

    // Instead of using the huge job.frequencyMs, check every minute for all jobs
    const timer = setInterval(() => {
      this.executeJob(job);
    }, 60 * 1000);

    this.intervals.set(job.id, timer);
  }
}
