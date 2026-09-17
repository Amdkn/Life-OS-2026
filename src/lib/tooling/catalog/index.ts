import { useTwelveWeekStore, WyTactic } from '../../../stores/fw-12wy.store';
import { useLifeWheelStore, WheelDomain } from '../../../stores/fw-wheel.store';
import { appendEvent, BlackboardEvent } from '../../blackboard/client';

export const life_os_get_tactics = async (week: number, cycleId?: string): Promise<WyTactic[]> => {
  const state = useTwelveWeekStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  let tactics = useTwelveWeekStore.getState().tactics;
  if (week) {
    tactics = tactics.filter(t => t.week === week);
  }
  return tactics;
};

export const life_os_update_tactic = async (tacticId: string, status: 'pending' | 'completed' | 'failed'): Promise<void> => {
  const state = useTwelveWeekStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  await state.updateTacticStatus(tacticId, status);
};

export const life_os_get_wheel_domains = async (): Promise<WheelDomain[]> => {
  const state = useLifeWheelStore.getState();
  if (!state.isHydrated) {
    await state.hydrate();
  }
  return useLifeWheelStore.getState().domains;
};

export const life_os_blackboard_post = async (workspaceId: string | null, eventType: string, payload: any): Promise<BlackboardEvent> => {
  const event: BlackboardEvent = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    actor_id: 'mcp-server',
    actor_layer: 'mcp',
    event_type: eventType,
    payload_json: JSON.stringify(payload),
    timestamp: Date.now()
  };
  return appendEvent(event);
};
