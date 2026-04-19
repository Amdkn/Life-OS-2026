# ADR-V0.3.3 — Fleet Gateway & Routing

> **PRD** : PRD-V0.3.3 · **Exécuteur** : A3

## Décision
Créer un nouveau store dédié `fleet-gateway.store.ts` (séparation des concerns — NE PAS polluer os-settings). Les API keys sont stockées dans le store Zustand persisted (localStorage). Le "test connection" utilise un simple `fetch` HEAD vers l'endpoint. Les modèles ne sont JAMAIS hardcodés dans le code React.

## Phase A : Connecteurs (5 étapes)

### Contrats
```typescript
// src/stores/fleet-gateway.store.ts [NEW]
export type ConnectorType = 'openrouter' | 'ollama' | 'openclaw';
export type ConnectionStatus = 'untested' | 'connected' | 'error';

export interface APIConnector {
  id: string; name: string; type: ConnectorType;
  endpoint: string; apiKey?: string;
  status: ConnectionStatus; lastTestedAt?: number;
}

// Store
connectors: APIConnector[];
updateConnector: (id: string, partial: Partial<APIConnector>) => void;
testConnection: (id: string) => Promise<ConnectionStatus>;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | NEW `fleet-gateway.store.ts` | Store avec 3 connecteurs par défaut |
| A.2 | NEW `ConnectorCard.tsx` | Card : nom, endpoint input, API key masked input, status dot, "Test" button |
| A.3 | Test logic | `testConnection` : fetch HEAD → status update |
| A.4 | Defaults | OpenRouter(api.openrouter.ai), Ollama(localhost:11434), OpenClaw(localhost:18789) |
| A.5 | Gate | 3 cartes affichées + test fonctionne |

## Phase B : Model Allocation (5 étapes)

### Contrats
```typescript
export type AgentStrata = 'a3-background' | 'a2-logic' | 'a1-chat' | 'a0-strategic';
export type CostTier = 'free' | 'paid';

export interface ModelAllocation {
  strata: AgentStrata; model: string;
  provider: string; costTier: CostTier;
}

modelAllocations: ModelAllocation[];
setModelForStrata: (strata: AgentStrata, model: string, provider: string, cost: CostTier) => void;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | MODIFY `fleet-gateway.store.ts` | Ajouter `ModelAllocation[]` avec defaults |
| B.2 | NEW `ModelRouter.tsx` | 4 rangées (A3/A2/A1/A0) avec dropdown modèle + badge free/paid |
| B.3 | Default models | A3=minimax-free, A2=glm-4.7-flash, A1=mistral-small, A0=gpt-5.2-codex |
| B.4 | Cost overview | Section résumé : agents free vs paid, estimation coût |
| B.5 | Gate | Allocation modifiable + badges visibles |
