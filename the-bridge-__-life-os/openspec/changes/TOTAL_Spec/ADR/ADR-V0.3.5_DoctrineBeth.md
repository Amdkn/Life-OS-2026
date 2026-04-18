# ADR-V0.3.5 — Doctrine Beth (Permissions & Veto)

> **PRD** : PRD-V0.3.5 · **Exécuteur** : A3

## Décision
Les veto rules sont stockées dans `os-settings.store.ts` (extension). La Permission Matrix est une vue read-only construite à partir des règles. Les agents sont listés depuis la config existante (AGENTS.md simplifiée).

## Phase A : Veto Rules (4 étapes)

### Contrats
```typescript
export interface VetoRule {
  id: string; action: string; description: string;
  requiresApproval: boolean; approver: 'manual' | 'auto';
}

vetoRules: VetoRule[];
updateVetoRule: (id: string, partial: Partial<VetoRule>) => void;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `os-settings.store.ts` | Ajouter `VetoRule[]` avec 4 defaults |
| A.2 | NEW `VetoRuleEditor.tsx` | Liste : action label + description + toggle on/off + approver dropdown |
| A.3 | Defaults | "Delete Data"(on), "Export External"(on), "Agent Execute"(on), "Hard Reset"(on) |
| A.4 | Gate | Rules modifiables + persistées |

## Phase B : Permission Matrix (3 étapes)

### Contrats
```typescript
// Vue construite dynamiquement — pas de store supplémentaire
export interface PermissionMatrixEntry {
  agentName: string; agentId: string;
  permissions: Record<string, boolean>; // action → allowed
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `PermissionMatrix.tsx` | Tableau : colonnes = actions, lignes = agents (Rick, Amy, Clara, etc.) |
| B.2 | Checkboxes croisées | Toggle permission par agent × action |
| B.3 | Gate Finale | Matrice visible + interopération avec veto rules |
