import { create } from 'zustand';
import { getEvents } from '../lib/blackboard/client.js';
import type { AgentCrewMember, AgentLayer } from '../types/frameworks.js';

export type AgentStatus = 'IDLE' | 'ACTIVE' | 'BLOCKED' | 'ERROR';

export interface FleetAgent extends AgentCrewMember {
  status: AgentStatus;
  activeTasks: number;
  completedTasks: number;
  errorCount: number;
  lastEventTime: number | null;
}

interface FleetState {
  agents: FleetAgent[];
  fetchTelemetry: () => Promise<void>;
}

const INITIAL_AGENTS: FleetAgent[] = [
  { id: 'A0', name: 'Antigravity', role: 'Strategic Director', layer: 'A3', status: 'IDLE', activeTasks: 0, completedTasks: 0, errorCount: 0, lastEventTime: null },
  { id: 'A1-Beth', name: 'Beth', role: 'Conscience / Veto Agent', layer: 'A1', status: 'IDLE', activeTasks: 0, completedTasks: 0, errorCount: 0, lastEventTime: null },
  { id: 'A2-Morty', name: 'Morty', role: 'Execution / Dispatch Agent', layer: 'A2', status: 'IDLE', activeTasks: 0, completedTasks: 0, errorCount: 0, lastEventTime: null }
];

export const useFleetStore = create<FleetState>((set, get) => ({
  agents: [...INITIAL_AGENTS],
  fetchTelemetry: async () => {
    try {
      const events = await getEvents();

      const newAgents = INITIAL_AGENTS.map(agent => ({ ...agent }));

      for (const event of events) {
        // Map actor_id or actor_layer to our specific agents
        let targetAgentId = '';
        if (event.actor_id === 'A0') targetAgentId = 'A0';
        else if (event.actor_id === 'A1-Beth') targetAgentId = 'A1-Beth';
        else if (event.actor_id === 'A2-Morty') targetAgentId = 'A2-Morty';
        else if (event.actor_layer === 'A3') targetAgentId = 'A0';
        else if (event.actor_layer === 'A1') targetAgentId = 'A1-Beth';
        else if (event.actor_layer === 'A2') targetAgentId = 'A2-Morty';

        if (!targetAgentId) continue;

        const agent = newAgents.find(a => a.id === targetAgentId);
        if (!agent) continue;

        if (!agent.lastEventTime || event.timestamp > agent.lastEventTime) {
          agent.lastEventTime = event.timestamp;

          if (event.event_type.includes('start') || event.event_type.includes('active') || event.event_type.includes('running')) {
            agent.status = 'ACTIVE';
          } else if (event.event_type.includes('block')) {
            agent.status = 'BLOCKED';
          } else if (event.event_type.includes('error') || event.event_type.includes('fail')) {
            agent.status = 'ERROR';
          } else if (event.event_type.includes('complete') || event.event_type.includes('done') || event.event_type.includes('idle')) {
            agent.status = 'IDLE';
          }
        }

        if (event.event_type.includes('start')) agent.activeTasks++;
        if (event.event_type.includes('complete')) {
          agent.activeTasks = Math.max(0, agent.activeTasks - 1);
          agent.completedTasks++;
        }
        if (event.event_type.includes('error')) agent.errorCount++;
      }

      set({ agents: newAgents });

    } catch (e) {
      console.error('Failed to fetch telemetry from Blackboard', e);
    }
  }
}));
