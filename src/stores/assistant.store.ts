import { create } from 'zustand';
import type { FrameworkId } from '../types/frameworks';

interface AssistantState {
  activeFrameworkId: FrameworkId | null;
  activeAgentId: string | null;
  chatOpen: boolean;

  setActiveFramework: (id: FrameworkId | null) => void;
  setActiveAgent: (id: string | null) => void;
  toggleChat: (open?: boolean) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  activeFrameworkId: null,
  activeAgentId: null,
  chatOpen: false,

  setActiveFramework: (id) => set({ activeFrameworkId: id, activeAgentId: null, chatOpen: false }),
  setActiveAgent: (id) => set({ activeAgentId: id }),
  toggleChat: (open) => set((state) => ({ chatOpen: open !== undefined ? open : !state.chatOpen })),
}));
