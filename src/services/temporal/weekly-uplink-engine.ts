import { useParaStore } from '../../stores/fw-para.store';
import { useTwelveWeekStore } from '../../stores/fw-12wy.store';
import { defaultCronScheduler } from '../b3-deterministic-runtime';
import { appendEvent } from '../../lib/blackboard/client';
import { WeeklyUplinkSnapshot } from './uplink-types';

export async function runWeeklyClosure(): Promise<void> {
  const paraState = useParaStore.getState();
  const twelveWeekState = useTwelveWeekStore.getState();

  // 1. Identify active week
  const rawActiveWeek = twelveWeekState.activeWeek;

  // If activeWeek is 'all', try to find the max week from tactics, or default to 1
  let currentWeek = 1;
  if (rawActiveWeek !== 'all' && typeof rawActiveWeek === 'number') {
    currentWeek = rawActiveWeek;
  } else if (twelveWeekState.tactics.length > 0) {
    currentWeek = Math.max(...twelveWeekState.tactics.map(t => t.week));
  }

  // 2. Scan completed projects
  const completedProjects = paraState.projects.filter(p => p.status === 'completed');
  const promotedAssets: string[] = [];
  const archivedProjects: string[] = [];
  const timestamp = Date.now();

  for (const project of completedProjects) {
    // Find Spock Area corresponding to the project's domain
    const area = paraState.areas.find(a => a.domain === project.domain);

    if (area) {
      // Get all resources attached to this project
      const resources = paraState.resources.filter(r => r.linkedProjects.includes(project.id) || project.resources.includes(r.id));

      if (resources.length > 0) {
        // Journal entry
        const resourceNames = resources.map(r => r.title).join(', ');
        const promotionJournal = `[${new Date(timestamp).toISOString()}] Promoted from completed project "${project.title}": ${resourceNames}`;

        const newNotes = area.notes ? `${area.notes}\n${promotionJournal}` : promotionJournal;
        paraState.updateArea(area.id, { notes: newNotes });

        resources.forEach(r => promotedAssets.push(r.id));
      }
    }

    // Archive project
    await paraState.archiveProject(project.id, 'Weekly Uplink Promotion', 'Project completed and assets promoted');
    archivedProjects.push(project.id);
  }

  // 3. Calculate 12WY Execution Score
  const tacticsForWeek = twelveWeekState.tactics.filter(t => t.week === currentWeek);
  let score: number | null = null;

  if (tacticsForWeek.length > 0) {
    const completedTactics = tacticsForWeek.filter(t => t.status === 'completed').length;
    score = (completedTactics / tacticsForWeek.length) * 100;
  }

  // 4. Create Snapshot
  const snapshotId = `uplink-w${currentWeek}-${timestamp}`;
  const snapshot: WeeklyUplinkSnapshot = {
    id: snapshotId,
    week: currentWeek,
    score,
    promotedAssets,
    archivedProjects,
    timestamp
  };

  // 5. Post to Blackboard
  try {
    // Safely generate UUID without relying on Node's 'crypto' import to avoid breaking Vite
    const eventId = (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.randomUUID)
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now().toString(36);

    await appendEvent({
      id: eventId,
      workspace_id: null,
      actor_id: 'weekly-uplink-engine',
      actor_layer: 'system',
      event_type: 'weekly_uplink_snapshot',
      payload_json: JSON.stringify(snapshot),
      timestamp
    });
  } catch (error) {
    console.error('[Weekly Uplink Engine] Failed to post snapshot to blackboard:', error);
  }

  // 6. Initialize Wx+1
  if (currentWeek < 12) {
    twelveWeekState.setActiveWeek(currentWeek + 1);
  } else {
    // If it's week 12, reset to week 1 for the next cycle
    twelveWeekState.setActiveWeek(1);
  }
}

export function registerWeeklyUplinkCron() {
  defaultCronScheduler.register({
    id: 'cron-weekly',
    descriptor: {
      id: 'cron-weekly-uplink',
      incarnationType: 'cron',
      intelligence: 'deterministic_code',
      determinism: 'strict_atomic',
      capabilities: ['store_mutation', 'blackboard_post'],
      estimatedTokenCost: 0,
      estimatedLatencyMs: 50,
      ioAuthorizations: ['para', '12wy', 'blackboard'],
      executionVectors: ['cron']
    },
    frequency: 'weekly',
    task: runWeeklyClosure
  });
}
