# DDD-V0.3.3 — Fleet Gateway & Routing

> **ADR** : ADR-V0.3.3 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Étape A.1 : Fleet Gateway Store

**NEW** `src/stores/fleet-gateway.store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ConnectorType = 'openrouter' | 'ollama' | 'openclaw';
export type ConnectionStatus = 'untested' | 'connected' | 'error';
export type AgentStrata = 'a3-background' | 'a2-logic' | 'a1-chat' | 'a0-strategic';
export type CostTier = 'free' | 'paid';

export interface APIConnector {
  id: string; name: string; type: ConnectorType;
  endpoint: string; apiKey?: string;
  status: ConnectionStatus; lastTestedAt?: number;
}

export interface ModelAllocation {
  strata: AgentStrata; model: string; provider: string; costTier: CostTier;
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
        { id: 'ollama',     name: 'Ollama Pro',  type: 'ollama',     endpoint: 'http://localhost:11434',         status: 'untested' },
        { id: 'openclaw',   name: 'OpenClaw',    type: 'openclaw',   endpoint: 'http://localhost:18789',         status: 'untested' },
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
        try {
          const res = await fetch(connector.endpoint, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          const status: ConnectionStatus = res.ok ? 'connected' : 'error';
          set(s => ({ connectors: s.connectors.map(c => c.id === id ? { ...c, status, lastTestedAt: Date.now() } : c) }));
          return status;
        } catch { set(s => ({ connectors: s.connectors.map(c => c.id === id ? { ...c, status: 'error' as const, lastTestedAt: Date.now() } : c) })); return 'error'; }
      },
      setModelForStrata: (strata, model, provider, costTier) => set(s => ({
        modelAllocations: s.modelAllocations.map(a => a.strata === strata ? { ...a, model, provider, costTier } : a)
      })),
    }),
    { name: 'aspace-fleet-gateway-v1' }
  )
);
```

## Étapes A.2-A.4 : ConnectorCard

**NEW** `src/apps/settings/components/ConnectorCard.tsx` — Card avec endpoint input, API key masked (type=password + toggle), status dot (●vert/●rouge/●gris), bouton "Test".

## Étapes B.2-B.4 : ModelRouter

**NEW** `src/apps/settings/components/ModelRouter.tsx` — 4 rangées strate avec dropdown modèle + badge `free`/`paid` coloré.

**Gate** : `npm run gate` + connecteurs testables + modèles modifiables
