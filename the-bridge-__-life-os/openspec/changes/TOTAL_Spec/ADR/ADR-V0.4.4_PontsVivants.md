# ADR-V0.4.4 — UX Picard : Ponts Vivants

> **Phase** : V0.4.4

## Décision : Enrichissement Optionnel des Stores Externes

Les stores `fw-gtd.store.ts` et `fw-12wy.store.ts` reçoivent un champ `projectId?: string` dans leurs types principaux. Ce champ est **optionnel** pour garantir la backward-compatibility. Les items existants (seed data) n'ont pas de `projectId` — ils ne seront simplement pas affichés dans les ponts.

### Contrats TypeScript (AVANT/APRÈS)

**GTDItem** (AVANT) :
```typescript
export interface GTDItem {
  id: string; content: string;
  status: 'inbox' | 'actionable' | 'incubating' | 'reference' | 'trash';
  context?: string; energy?: 'low' | 'medium' | 'high';
  timeEstimate?: number; linkedLd?: LDId;
  reasoning?: string; createdAt: number; processedAt?: number;
}
```

**GTDItem** (APRÈS) :
```typescript
export interface GTDItem {
  // ... all existing fields ...
  projectId?: string; // V0.4.4 — Pont PARA-GTD
}
```

**Goal** (APRÈS) :
```typescript
export interface Goal {
  // ... all existing fields ...
  projectId?: string; // V0.4.4 — Pont PARA-12WY
}
```

**addItem** (APRÈS) :
```typescript
addItem: (content: string, opts?: { projectId?: string }) => void;
```

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `ParaApp.tsx` | Hotfix : `+ New` passe `type` correct, masqué sur areas/archives | `tsc` |
| A.2 | `ItemModal.tsx` | Dispatch typé : Project vs Resource | `tsc` |
| A.3 | `fw-para.store.ts` | Ajouter `addResource`, `deleteProject` avec sync LD | `tsc` |
| B.1 | `fw-gtd.store.ts` | Ajouter `projectId?` à GTDItem + modifier `addItem` | `tsc` |
| B.2 | `fw-12wy.store.ts` | Ajouter `projectId?` à Goal | `tsc` |
| C.1-C.3 | `FrameworkBridge.tsx` | GTD Bridge vivant + Stalled badge + Quick-Add | `tsc` |
| D.1-D.2 | `FrameworkBridge.tsx` | 12WY Bridge vivant + On Track/Behind | `npm run gate` |
