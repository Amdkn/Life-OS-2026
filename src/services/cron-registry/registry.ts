import { appendEvent, getEvents, BlackboardEvent } from '../../lib/blackboard/client.js';
import { CronJob, CronFrequency } from './types.js';

// Base static jobs
export const BASE_JOBS: CronJob[] = [
  { id: 'cron-1', day: 0, time: 6, title: 'Morning Briefing', type: 'system', color: 'var(--brass)', frequency: 'Circadien 24h', isActive: false },
  { id: 'cron-2', day: 1, time: 7, title: 'Daily Standup', type: 'agent', color: 'var(--accent-primary)', frequency: 'Circadien 24h', isActive: false },
  { id: 'cron-3', day: 2, time: 6, title: 'Github Sync', type: 'system', color: 'var(--accent-warning)', frequency: 'Heartbeat 15m', isActive: false },
  { id: 'cron-4', day: 4, time: 9, title: 'Hyrox Asia Q4 Check', type: 'task', color: 'var(--accent-danger)', frequency: 'Revue Hebdo W13', isActive: false },
  { id: 'cron-5', day: 0, time: 21, title: 'Evening Ritual', type: 'life', color: 'var(--copper)', frequency: 'Circadien 24h', isActive: false },
];

const WORKSPACE_ID = 'cron-registry-workspace';
const ACTOR_ID = 'cron-service';
const ACTOR_LAYER = 'system';

export async function getCrons(): Promise<CronJob[]> {
  try {
    const events = await getEvents(WORKSPACE_ID);

    // We merge the event log to figure out the actual active state and last pulse
    const jobs = [...BASE_JOBS].map(job => ({ ...job }));

    for (const event of events) {
      if (event.event_type === 'cron_toggled') {
        try {
          const payload = JSON.parse(event.payload_json);
          const job = jobs.find(j => j.id === payload.id);
          if (job) {
            job.isActive = payload.isActive;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
      if (event.event_type === 'cron_pulsed') {
        try {
          const payload = JSON.parse(event.payload_json);
          const job = jobs.find(j => j.id === payload.id);
          if (job) {
            job.lastPulse = event.timestamp;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    return jobs;
  } catch (error) {
    console.error('Failed to get crons from blackboard', error);
    // return base jobs if blackboard is unreachable
    return BASE_JOBS;
  }
}

export async function toggleCron(id: string, isActive: boolean): Promise<void> {
  const event: BlackboardEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    workspace_id: WORKSPACE_ID,
    actor_id: ACTOR_ID,
    actor_layer: ACTOR_LAYER,
    event_type: 'cron_toggled',
    payload_json: JSON.stringify({ id, isActive }),
    timestamp: Date.now(),
  };
  await appendEvent(event);
}

export async function triggerPulse(id: string): Promise<void> {
  const event: BlackboardEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    workspace_id: WORKSPACE_ID,
    actor_id: ACTOR_ID,
    actor_layer: ACTOR_LAYER,
    event_type: 'cron_pulsed',
    payload_json: JSON.stringify({ id }),
    timestamp: Date.now(),
  };
  await appendEvent(event);
}

export function parseFrequency(freq: CronFrequency): number {
  if (freq === 'Heartbeat 15m') return 15 * 60 * 1000;
  if (freq === 'Circadien 24h') return 24 * 60 * 60 * 1000;
  if (freq === 'Revue Hebdo W13') return 7 * 24 * 60 * 60 * 1000;
  return 0;
}
