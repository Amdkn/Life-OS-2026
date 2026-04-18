# ADR-V0.2.5 — Ikigai Deep Routing

> **PRD** : PRD-V0.2.5 · **Dépendance** : ADR-V0.2.4 (HeaderFilterBar)
> **Décideur** : A'"0 · **Exécuteur** : A3

---

## Décision
Implémenter un routing par state Zustand `activeHorizon × activePillar` dans le store Ikigai. Les Horizons vivent dans le Header Menu (via `HeaderFilterBar`), les Piliers dans la Sidebar. La combinaison filtre les `IkigaiItem[]`.

## Justification
Le routing classique SPA est interdit (pas de React Router dans un Web OS multi-fenêtres). Le state Zustand permet le filtrage combiné sans rechargement, et le Breadcrumb reflète le contexte via `WindowContext`.

---

## Phase A : Data Model & Store (5 étapes)

### Contrats
```typescript
// Types dans fw-ikigai.store.ts
export type Pillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type Horizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiItem {
  id: string;
  title: string;
  description: string;
  pillar: Pillar;
  horizon: Horizon;
  alignmentLevel: number; // 0-100
}

// Store actions
activeHorizon: Horizon | 'all';
activePillar: Pillar | 'all';
setActiveHorizon: (h: Horizon | 'all') => void;
setActivePillar: (p: Pillar | 'all') => void;
filteredItems: () => IkigaiItem[]; // computed getter
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `fw-ikigai.store.ts` | Ajouter types `Pillar`, `Horizon`, `IkigaiItem` |
| A.2 | MODIFY `fw-ikigai.store.ts` | Ajouter state `activeHorizon`, `activePillar` |
| A.3 | MODIFY `fw-ikigai.store.ts` | Ajouter getter `filteredItems()` — filtre par horizon × pillar |
| A.4 | MODIFY `fw-ikigai.store.ts` | Seed data : 20 items (4×5) — ex: `{title: "Master TypeScript", pillar: "craft", horizon: "H1"}` |
| A.5 | Gate | `tsc --noEmit` + store fonctionnel |

---

## Phase B : Routing Combiné (5 étapes)

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | MODIFY `IkigaiApp.tsx` | Header Menu via `HeaderFilterBar` = Horizons `[All, H1, H3, H10, H30, H90]` |
| B.2 | MODIFY `IkigaiApp.tsx` | Sidebar Piliers → `setActivePillar()` au clic |
| B.3 | MODIFY `IkigaiApp.tsx` | Afficher `filteredItems()` dans le contenu principal |
| B.4 | MODIFY `IkigaiApp.tsx` | Sync breadcrumb : `useContext(WindowContext).setActivePage(horizon + ' > ' + pillar)` |
| B.5 | Gate | Navigation H3 + Passion → items filtrés + breadcrumb `Ikigai > H3 > Passion` |

---

## Phase C : Cards & Detail Panel (4 étapes)

### Contrats
```typescript
// src/apps/ikigai/components/IkigaiItemCard.tsx [NEW]
interface IkigaiItemCardProps {
  item: IkigaiItem;
  onClick: (item: IkigaiItem) => void;
}

// src/apps/ikigai/components/IkigaiDetailPanel.tsx [NEW]
interface IkigaiDetailPanelProps {
  item: IkigaiItem | null;
  onClose: () => void;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | NEW `IkigaiItemCard.tsx` | Card : titre, description tronquée, badge pilier (couleur), alignment bar horizontale |
| C.2 | MODIFY `IkigaiApp.tsx` | Grille responsive 3 colonnes, map `filteredItems → IkigaiItemCard` |
| C.3 | NEW `IkigaiDetailPanel.tsx` | Slide-in panel droit (overlay 400px), affiche item complet + édition future |
| C.4 | Gate | Cards affichées, clic → detail panel, données seed visibles |
