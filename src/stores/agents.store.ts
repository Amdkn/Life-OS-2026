/** Agents Store — Central registry + Smart Task Logic (P5.1/P5.3) */
import { create } from 'zustand';
import { useShellStore } from './shell.store';

export type AgentStatus = 'online' | 'idle' | 'busy' | 'warning' | 'offline';
export type AgentLayer = 'A1' | 'A2' | 'A3';

export interface Task {
  id: string;
  title: string;
  agentId: string;
  parentTaskId?: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: number;
}

export interface Agent {
  id: string;
  name: string;
  layer: AgentLayer;
  status: AgentStatus;
  ship?: string;
  specialty?: string;
  lastActive: number;
}

export interface AgentLog {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
}

interface AgentsState {
  agents: Agent[];
  logs: AgentLog[];
  tasks: Task[];
  
  // Actions
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  addLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  assignTask: (title: string, layer: AgentLayer, ship?: string) => void;
  completeTask: (taskId: string) => void;
  clearLogs: () => void;
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: [
    { id: 'a1-morty', name: 'Morty', layer: 'A1', status: 'online', lastActive: Date.now() },
    { id: 'a1-beth',  name: 'Beth',  layer: 'A1', status: 'online', lastActive: Date.now() },
    { id: 'a2-orville',   name: 'USS Orville',   layer: 'A2', status: 'online', ship: 'Orville', specialty: 'Frameworks/Ikigai', lastActive: Date.now() },
    { id: 'a2-discovery', name: 'USS Discovery', layer: 'A2', status: 'online', ship: 'Discovery', specialty: 'Life Wheel', lastActive: Date.now() },
    { id: 'a2-enterprise',name: 'USS Enterprise',layer: 'A2', status: 'online', ship: 'Enterprise', specialty: 'PARA/Business', lastActive: Date.now() },
    { id: 'a3-picard', name: 'Jean-Luc Picard', layer: 'A3', status: 'online', ship: 'Enterprise', specialty: 'Diplomacy/Logic', lastActive: Date.now() },
    { id: 'a3-data',   name: 'Data',            layer: 'A3', status: 'online', ship: 'Enterprise', specialty: 'Computation', lastActive: Date.now() },
  ],
  logs: [],
  tasks: [],

  updateAgentStatus: (id, status) => set(state => ({
    agents: state.agents.map(a => a.id === id ? { ...a, status, lastActive: Date.now() } : a)
  })),

  addLog: (log) => set(state => ({
    logs: [{ ...log, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() }, ...state.logs].slice(0, 100)
  })),

  assignTask: (title, layer, ship) => {
    const state = get();
    // Find available agent in that layer/ship
    const agent = state.agents.find(a => a.layer === layer && (ship ? a.ship === ship : true) && a.status !== 'busy');
    
    if (!agent) {
      get().addLog({ 
        agentId: 'system', 
        agentName: 'System', 
        message: `Failed to assign task: No available ${layer} agents ${ship ? 'on ' + ship : ''}.`, 
        type: 'warning' 
      });
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      agentId: agent.id,
      progress: 0,
      status: 'running',
      createdAt: Date.now()
    };

    set(state => ({
      tasks: [...state.tasks, newTask],
      agents: state.agents.map(a => a.id === agent.id ? { ...a, status: 'busy' } : a)
    }));

    get().addLog({ 
      agentId: agent.id, 
      agentName: agent.name, 
      message: `Executing task: ${title}`, 
      type: 'command' 
    });

    // Simulate progress and completion
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      if (currentProgress >= 100) {
        clearInterval(interval);
        get().completeTask(newTask.id);
      } else {
        set(state => ({
          tasks: state.tasks.map(t => t.id === newTask.id ? { ...t, progress: Math.min(currentProgress, 99) } : t)
        }));
      }
    }, 1500);
  },

  completeTask: (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const agent = get().agents.find(a => a.id === task.agentId);
    
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed', progress: 100 } : t),
      agents: state.agents.map(a => a.id === task.agentId ? { ...a, status: 'online' } : a)
    }));

    get().addLog({ 
      agentId: task.agentId, 
      agentName: agent?.name || 'Unknown', 
      message: `Task completed successfully: ${task.title}`, 
      type: 'success' 
    });

    // Notify shell (P1.9 integration)
    useShellStore.getState().addToast({
      source: 'Agent Portal',
      message: `Task Completed: ${task.title}`,
      type: 'success'
    });
  },

  clearLogs: () => set({ logs: [] })
}));
