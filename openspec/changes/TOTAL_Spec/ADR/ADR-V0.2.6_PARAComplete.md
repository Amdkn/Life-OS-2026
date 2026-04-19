# ADR-V0.2.6 — PARA Complete

> **PRD** : PRD-V0.2.6 · **Dépendance** : ADR-V0.2.4 (HeaderFilterBar)
> **Décideur** : A'"0 · **Exécuteur** : A3

---

## Décision
PARA repose sur une architecture à 2 niveaux : Domaines Life Wheel (8) → Piliers Business Pulse (8 par domaine = 64 total). Les Projects sont filtrés par domaine via le Header Menu. Les Resources ont un enum extensible. L'Archive est le point d'entrée vers DEAL (pas un cimetière).

## Justification
Le modèle Life Wheel × Business Pulse crée une matrice 8×8 qui couvre tous les aspects de la vie. Ce pattern est la colonne vertébrale du Life OS — il connecte naturellement PARA à tous les autres frameworks.

---

## Phase A : Data Model (6 étapes)

### Contrats
```typescript
export type LifeWheelDomain = 'business' | 'finance' | 'health' | 'cognition' 
  | 'creativity' | 'habitat' | 'relations' | 'impact';

export type BusinessPillar = 'growth' | 'operations' | 'product' | 'finance' 
  | 'people' | 'it' | 'legal' | 'meta';

export interface DomainPillar {
  id: string;
  domain: LifeWheelDomain;
  pillar: BusinessPillar;
  label: string;
  description: string;
}

export interface Project {
  id: string; title: string; status: 'active' | 'paused' | 'completed' | 'archived';
  domain: LifeWheelDomain; pillars: string[]; resources: string[];
  progress: number; archivedAt?: number;
}

export interface Resource {
  id: string; title: string; type: ResourceType; category: string;
  linkedProjects: string[]; linkedPillars: string[];
}

export type ResourceType = 'book' | 'tool' | 'contact' | 'template' 
  | 'course' | 'article' | 'video' | 'other';
// + custom types stockés dans le store
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `fw-para.store.ts` | Types `LifeWheelDomain`, `BusinessPillar`, `DomainPillar` |
| A.2 | MODIFY `fw-para.store.ts` | Types `Project`, `Resource`, `ResourceType` |
| A.3 | MODIFY `fw-para.store.ts` | Seed : 64 `DomainPillar` (8 domaines × 8 piliers avec labels contextuels) |
| A.4 | MODIFY `fw-para.store.ts` | Seed : 8 projets (1 par domaine, ex: "A'Space OS" dans Business) |
| A.5 | MODIFY `fw-para.store.ts` | Seed : 16 resources variées (2 par type) |
| A.6 | Gate | `tsc --noEmit` — store complet |

---

## Phase B : Projects Cards (4 étapes)

### Contrats
```typescript
// src/apps/para/components/ProjectCard.tsx [NEW]
interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

// src/apps/para/pages/ProjectDetail.tsx [NEW]
interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `ProjectCard.tsx` | Titre, status badge couleur, domaine icône, progress bar |
| B.2 | MODIFY `ParaApp.tsx` | Projects page : grille + filtrage Header Menu par domaine |
| B.3 | NEW `ProjectDetail.tsx` | Sous-page : linked resources list, linked pillars tags, timeline |
| B.4 | Gate | Clic card → detail page, filtrage par domaine fonctionne |

---

## Phase C : Areas — Domaines × Piliers (4 étapes)

### Contrats
```typescript
// src/apps/para/components/DomainCard.tsx [NEW]
interface DomainCardProps {
  domain: LifeWheelDomain;
  pillars: DomainPillar[];
  expanded: boolean;
  onToggle: () => void;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | NEW `DomainCard.tsx` | Card domaine avec icône Life Wheel + compteur piliers + expand |
| C.2 | NEW `PillarSubCard.tsx` | Sous-card pilier avec label + description |
| C.3 | MODIFY `ParaApp.tsx` | Areas page : 8 DomainCards, expand → 8 PillarSubCards |
| C.4 | Gate | Expansion domaine → 8 piliers, Header Menu filtre affiché |

---

## Phase D : Resources & Archives (5 étapes)

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| D.1 | NEW `ResourceCard.tsx` | Titre, type badge, catégorie, linked items count |
| D.2 | MODIFY `ParaApp.tsx` | Resources page : groupées par type, filter enum + "Add Type" button |
| D.3 | MODIFY `ParaApp.tsx` | Archives page : projets archivés, badge "→ Muse potential" |
| D.4 | MODIFY `ParaApp.tsx` | Bouton "Transform via DEAL" → `openApp('deal', 'DEAL')` |
| D.5 | Gate | `npm run gate` + cycle Projects→Areas→Resources→Archives navigable |
