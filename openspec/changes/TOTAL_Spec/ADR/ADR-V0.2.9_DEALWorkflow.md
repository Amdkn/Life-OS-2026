# ADR-V0.2.9 — DEAL Workflow (4H Work Week)

> **PRD** : PRD-V0.2.9 · **Dépendance** : ADR-V0.2.6 (PARA Archives)
> **Décideur** : A'"0 · **Exécuteur** : A3

---

## Décision
DEAL ferme le cycle Life OS : les projets archivés de PARA entrent dans un pipeline D.E.A.L en 4 phases. Les projets qui atteignent Liberation deviennent des Muse Candidates (revenus passifs, 4H Work Week). DEAL importe depuis PARA et référence les goals 12WY.

## Justification
Sans DEAL, l'Archive PARA est un cimetière. Avec DEAL, chaque projet terminé est un candidat à la transformation en source de liberté. C'est le moteur de sortie du système.

---

## Phase A : Data Model (4 étapes)

### Contrats
```typescript
export type DEALPhase = 'definition' | 'elimination' | 'automation' | 'liberation';

export interface DEALItem {
  id: string; projectId: string; // lien PARA
  title: string; phase: DEALPhase;
  tasks: DEALTask[];
  museCandidate?: MuseCandidate;
}

export interface DEALTask {
  id: string; title: string; type: 'keep' | 'eliminate' | 'automate' | 'delegate';
  completed: boolean; assignedAgent?: LifeOSAgent;
}

export interface MuseCandidate {
  projectId: string;
  revenueEstimate?: number;
  automationPercent: number; // 0-100
  liberationDate?: number;
  status: 'candidate' | 'active' | 'achieved';
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `fw-deal.store.ts` | Types `DEALPhase`, `DEALItem`, `DEALTask`, `MuseCandidate` |
| A.2 | MODIFY `fw-deal.store.ts` | Actions : `importFromPARA()`, `advancePhase()`, `promoteToMuse()` |
| A.3 | MODIFY `fw-deal.store.ts` | Seed : 3 projets (1 en definition, 1 en automation, 1 en liberation = muse) |
| A.4 | Gate | `tsc --noEmit` |

---

## Phase B : 4 Pages DEAL (4 étapes)

### Contrats
```typescript
// src/apps/deal/pages/DefinitionView.tsx [NEW]
// src/apps/deal/pages/EliminationView.tsx [NEW]
// src/apps/deal/pages/AutomationView.tsx [NEW]
// src/apps/deal/pages/LiberationView.tsx [NEW]
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `DefinitionView.tsx` | Liste projets importés depuis PARA, 80/20 task breakdown |
| B.2 | NEW `EliminationView.tsx` | Checklist "Not To Do" : tasks marquées `eliminate`, % éliminé |
| B.3 | NEW `AutomationView.tsx` | Tasks `automate` avec agent assigné, % automatisé progressif |
| B.4 | NEW `LiberationView.tsx` | Timeline : date cible, % libération, lien Archive PARA, bouton "Promote to Muse" |

---

## Phase C : Cross-Framework (4 étapes)

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | MODIFY `fw-deal.store.ts` | `importFromPARA()` : lit les projets `archived` du store PARA |
| C.2 | MODIFY `fw-deal.store.ts` | Lien 12WY : si un goal `completed` est lié à un projet → candidat DEAL |
| C.3 | NEW `MuseTracker.tsx` | Dashboard : cartes muses avec revenue, automation%, liberation countdown |
| C.4 | Gate finale | `npm run gate` + cycle PARA archived → DEAL pipeline → Muse visible |

---

## Risques

| Risque | Mitigation |
|--------|-----------|
| Import PARA crée des copies (désynchronisation) | Stocker `projectId` comme référence, pas de duplication |
| Stores cross-framework = couplage | Import via getter read-only, pas de mutation cross-store |
| Muse Tracker vide si pas de projets libérés | Seed data avec 1 muse `achieved` |
