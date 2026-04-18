import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConnectorType = 'openrouter' | 'ollama' | 'openclaw';
export type ConnectionStatus = 'untested' | 'connected' | 'error';
export type AgentStrata = 'a3-background' | 'a2-logic' | 'a1-chat' | 'a0-strategic';
export type CostTier = 'free' | 'paid';

export interface APIConnector {
  id: string;
  name: string;
  type: ConnectorType;
  endpoint: string;
  apiKey?: string;
  status: ConnectionStatus;
  lastTestedAt?: number;
}

export interface ModelAllocation {
  strata: AgentStrata;
  model: string;
  provider: string;
  costTier: CostTier;
}

interface FleetGatewayState {
  connectors: APIConnector[];
  modelAllocations: ModelAllocation[];
  updateConnector: (id: string, partial: Partial<APIConnector>) => void;
  testConnection: (id: string) => Promise<ConnectionStatus>;
  setModelForStrata: (strata: AgentStrata, model: string, provider: string, cost: CostTier) => void;
}

export const useFleetGatewayStore = create<FleetGatewayState>()(
  persist(
    (set, get) => ({
      connectors: [
        { id: 'openrouter', name: 'OpenRouter', type: 'openrouter', endpoint: 'https://openrouter.ai/api/v1', status: 'untested' },
        { id: 'ollama',     name: 'Ollama Pro',  type: 'ollama',     endpoint: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434', status: 'untested' },
        { id: 'openclaw',   name: 'OpenClaw',    type: 'openclaw',   endpoint: import.meta.env.VITE_OPENCLAW_URL || 'http://localhost:18789', status: 'untested' },
      ],
      modelAllocations: [
        { strata: 'a3-background', model: 'minimax-m2.5', provider: 'openrouter', costTier: 'free' },
        { strata: 'a2-logic',      model: 'glm-4.7-flash', provider: 'openrouter', costTier: 'free' },
        { strata: 'a1-chat',       model: 'mistral-small-2603', provider: 'openrouter', costTier: 'paid' },
        { strata: 'a0-strategic',  model: 'gpt-5.2-codex', provider: 'openai-codex', costTier: 'paid' },
      ],
      updateConnector: (id, partial) => set(s => ({
        connectors: s.connectors.map(c => c.id === id ? { ...c, ...partial } : c)
      })),
      testConnection: async (id) => {
        const connector = get().connectors.find(c => c.id === id);
        if (!connector) return 'error';
        
        set(s => ({ 
          connectors: s.connectors.map(c => c.id === id ? { ...c, status: 'untested' } : c) 
        }));

        try {
          // Use HEAD or GET with a small timeout to test endpoint
          const res = await fetch(connector.endpoint, { 
            method: 'HEAD', 
            mode: 'no-cors', // Many APIs don't allow HEAD from browser, so we just check if it's reachable
            signal: AbortSignal.timeout(5000) 
          });
          
          // Since we use no-cors, we can't see res.ok, but if it didn't throw, it's reachable
          const status: ConnectionStatus = 'connected';
          set(s => ({ 
            connectors: s.connectors.map(c => c.id === id ? { ...c, status, lastTestedAt: Date.now() } : c) 
          }));
          return status;
        } catch (err) {
          console.error(`Connection test failed for ${id}:`, err);
          const status: ConnectionStatus = 'error';
          set(s => ({ 
            connectors: s.connectors.map(c => c.id === id ? { ...c, status, lastTestedAt: Date.now() } : c) 
          }));
          return 'error';
        }
      },
      setModelForStrata: (strata, model, provider, costTier) => set(s => ({
        modelAllocations: s.modelAllocations.map(a => a.strata === strata ? { ...a, model, provider, costTier } : a)
      })),
    }),
    {
      name: 'aspace-fleet-gateway-v1',
    }
  )
);
