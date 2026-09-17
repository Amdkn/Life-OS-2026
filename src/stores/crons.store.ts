import { create } from 'zustand';
import { getEvents, appendEvent, BlackboardEvent } from '../lib/blackboard/client.js';
import { CronJob } from '../services/cron-registry/types.js';

export const REAL_REGISTRY: CronJob[] = [
  { id: 'cron-telemetry', day: 0, time: 6, title: 'Télémetrie (Yas / Kernel Core)', type: 'system', color: 'var(--brass)', frequency: 'Heartbeat 15m', isActive: false },
  { id: 'cron-weekly', day: 4, time: 9, title: 'Revue hebdomadaire Wx (Tendi & River Song)', type: 'agent', color: 'var(--accent-primary)', frequency: 'Revue Hebdo W13', isActive: false },
  { id: 'cron-audit', day: 6, time: 20, title: 'Audit homéostasie cognitive (Hugh Culber & Rory)', type: 'task', color: 'var(--accent-danger)', frequency: 'Circadien 24h', isActive: false },
  { id: 'cron-distillation', day: 2, time: 14, title: 'Distillation incrémentale 50_ (Graham & Rick)', type: 'system', color: 'var(--copper)', frequency: 'Circadien 24h', isActive: false },
];

const WORKSPACE_ID = 'cron-registry-workspace';
const ACTOR_ID = 'cron-service';
const ACTOR_LAYER = 'system';

interface CronsState {
  crons: CronJob[];
  loading: boolean;
  error: string | null;
  fetchCrons: () => Promise<void>;
  toggleCron: (id: string, isActive: boolean) => Promise<void>;
  triggerPulse: (id: string) => Promise<void>;
}

export const useCronsStore = create<CronsState>((set, get) => ({
  crons: [],
  loading: false,
  error: null,
  fetchCrons: async () => {
    set({ loading: true, error: null });
    try {
      const events = await getEvents(WORKSPACE_ID);
      const jobs = REAL_REGISTRY.map(job => ({ ...job }));

      for (const event of events) {
        if (event.event_type === 'cron_toggled') {
          try {
            const payload = JSON.parse(event.payload_json);
            const job = jobs.find(j => j.id === payload.id);
            if (job) job.isActive = payload.isActive;
          } catch (e) {
            // ignore
          }
        }
        if (event.event_type === 'cron_pulsed') {
          try {
            const payload = JSON.parse(event.payload_json);
            const job = jobs.find(j => j.id === payload.id);
            if (job) job.lastPulse = event.timestamp;
          } catch (e) {
            // ignore
          }
        }
      }
      set({ crons: jobs, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to load crons', crons: REAL_REGISTRY, loading: false });
    }
  },
  toggleCron: async (id: string, isActive: boolean) => {
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
    await get().fetchCrons();
  },
  triggerPulse: async (id: string) => {
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
    await get().fetchCrons();
  }
}));
