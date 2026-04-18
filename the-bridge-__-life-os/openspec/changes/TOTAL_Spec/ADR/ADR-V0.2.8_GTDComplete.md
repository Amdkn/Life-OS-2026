# ADR-V0.2.8 — GTD Complete

> **PRD** : PRD-V0.2.8 · **Dépendance** : ADR-V0.2.4 (HeaderFilterBar Contextes)
> **Décideur** : A'"0 · **Exécuteur** : A3

---

## Décision
Implémenter les 5 étapes GTD comme 5 pages dans la sidebar (Capture, Clarify, Organize, Review, Engage). Ajouter un système `ActionLog` pour la traçabilité de chaque décision prise sur un item.

## Justification
GTD n'est pas un todo-list — c'est un processus de décision. La traçabilité (ActionLog) transforme GTD en outil d'accountability : on peut retracer POURQUOI chaque item a été traité de telle manière.

---

## Phase A : Data Model (4 étapes)

### Contrats
```typescript
export type GTDItemType = 'inbox' | 'nextAction' | 'waitingFor' | 'somedayMaybe' | 'reference' | 'project';
export type GTDContext = '@home' | '@work' | '@errands' | '@anywhere' | 'waiting' | 'someday';

export interface GTDItem {
  id: string; title: string; type: GTDItemType; context?: GTDContext;
  notes?: string; project?: string; dueDate?: number;
  processed: boolean; completedAt?: number;
}

export interface ActionLog {
  id: string; itemId: string;
  action: 'created' | 'clarified' | 'organized' | 'reviewed' | 'completed' | 'deferred' | 'delegated' | 'deleted';
  timestamp: number; decision: string; reasoning: string;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `fw-gtd.store.ts` | Types `GTDItemType`, `GTDContext`, `GTDItem` enrichis |
| A.2 | MODIFY `fw-gtd.store.ts` | Type `ActionLog` + state `actionLogs: ActionLog[]` |
| A.3 | MODIFY `fw-gtd.store.ts` | Actions : `addActionLog()`, `clarifyItem()`, `getLogsForItem()` |
| A.4 | Seed data : 15 items (3 inbox, 4 nextAction, 2 waiting, 2 someday, 2 reference, 2 projects) + 10 logs |

---

## Phase B : 5 Étapes GTD Pages (5 étapes)

### Contrats
```typescript
// 5 composants pages [NEW]
// src/apps/gtd/pages/CaptureView.tsx
// src/apps/gtd/pages/ClarifyWizard.tsx
// src/apps/gtd/pages/OrganizeView.tsx
// src/apps/gtd/pages/ReviewView.tsx
// src/apps/gtd/pages/EngageView.tsx
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `CaptureView.tsx` | Input + Enter = ajout inbox immédiat + animation feedback |
| B.2 | NEW `ClarifyWizard.tsx` | Arbre de décision : Actionable? → (<2min → Do) / (Delegate → WaitingFor) / (Defer → NextAction) / (NotActionable → Someday/Reference/Trash) |
| B.3 | NEW `OrganizeView.tsx` | Listes groupées par contexte, drag optional, projet assignment |
| B.4 | NEW `ReviewView.tsx` | Checklist : items inbox non-traités, projets sans next action, someday review |
| B.5 | NEW `EngageView.tsx` | Vue "Now" : NextActions filtrées par contexte/énergie, tri par priorité |

---

## Phase C : ActionLog & Filtres (3 étapes)

### Contrats
```typescript
// src/apps/gtd/components/ActionLogPanel.tsx [NEW]
interface ActionLogPanelProps {
  itemId: string;
  logs: ActionLog[];
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | NEW `ActionLogPanel.tsx` | Timeline verticale des décisions par item (timestamps + reasoning) |
| C.2 | MODIFY `GtdApp.tsx` | Header = `HeaderFilterBar` avec contextes `[@Home, @Work, @Errands, Waiting, Someday, All]` |
| C.3 | Gate | `npm run gate` + 5 étapes navigables + action log visible |
