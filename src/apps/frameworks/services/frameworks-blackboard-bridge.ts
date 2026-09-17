import { getEvents, appendEvent, BlackboardEvent, acquireLock, releaseLock } from '../../../lib/blackboard/client';
import { useAgentsStore, AgentStatus } from '../../../stores/agents.store';
import { VesselConfig } from '../../../types/frameworks';
import { vesselConfigs } from '../../../config/vessels.config';

export interface FrameworkHealthMetrics {
  frameworkId: string;
  frameworkName: string;
  totalAgents: number;
  onlineAgents: number;
  healthScore: number; // 0 to 100
  nexusStatus: 'OK' | 'WARN' | 'UNKNOWN';
}

export async function syncFrameworkStateToBlackboard(vessel: VesselConfig) {
  // Try to acquire a lock to update the vessel state
  const resourceKey = `vessel_state_${vessel.id}`;
  const lockedBy = `bridge_${Math.random().toString(36).substring(7)}`;

  const lockAcquired = await acquireLock({
    id: crypto.randomUUID(),
    resource_key: resourceKey,
    locked_by: lockedBy,
    expires_at: Date.now() + 10000 // 10s TTL
  });

  if (!lockAcquired) {
    console.warn(`[Bridge] Could not acquire lock for vessel ${vessel.id}, skipping sync.`);
    return;
  }

  try {
    const agentsStore = useAgentsStore.getState();
    const activeAgents = agentsStore.agents;

    // Create an action receipt event
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: 'bridge_service',
      actor_layer: 'SYSTEM',
      event_type: 'vessel_state_update',
      payload_json: JSON.stringify({
        vesselId: vessel.id,
        vesselName: vessel.vesselName,
        frameworkName: vessel.frameworkName,
        crewState: vessel.crew.map(member => {
          const actualAgent = activeAgents.find(a => a.id === member.id || a.name.includes(member.name) || member.name.includes(a.name));
          return {
            ...member,
            status: actualAgent?.status || 'offline'
          };
        }),
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  } finally {
    await releaseLock(resourceKey, lockedBy);
  }
}

export function generateFrameworkHealthMetrics(): FrameworkHealthMetrics[] {
  const agentsStore = useAgentsStore.getState();
  const realAgents = agentsStore.agents;

  return vesselConfigs.map(vessel => {
    let totalAgentsCount = 0;
    let onlineAgentsCount = 0;

    vessel.crew.forEach(member => {
      totalAgentsCount++;
      const actualAgent = realAgents.find(a => a.id === member.id || a.name.includes(member.name) || member.name.includes(a.name));
      if (actualAgent && (actualAgent.status === 'online' || actualAgent.status === 'busy')) {
        onlineAgentsCount++;
      }
    });

    const healthScore = totalAgentsCount === 0 ? 0 : Math.round((onlineAgentsCount / totalAgentsCount) * 100);
    const hasWarnings = vessel.crew.some(member => {
        const actualAgent = realAgents.find(a => a.id === member.id || a.name.includes(member.name) || member.name.includes(a.name));
        return !actualAgent || actualAgent.status === 'warning' || actualAgent.status === 'offline';
    });

    const nexusStatus = totalAgentsCount === 0 ? 'UNKNOWN' : (hasWarnings ? 'WARN' : 'OK');

    return {
      frameworkId: vessel.id,
      frameworkName: vessel.frameworkName,
      totalAgents: totalAgentsCount,
      onlineAgents: onlineAgentsCount,
      healthScore,
      nexusStatus
    };
  });
}
