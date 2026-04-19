# DDD-V0.1.3 — Meta-Prompt Ikigai Protocol 🧿

> **Contexte** : V0.1.3 (Framework Ikigai — Boussole de Vie, Horizons H1-H90)
> **Source de vérité** : `_SPECS/CONTRACTS.md` + `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-013_V0.1.3_Ikigai_Structure.md`
> **Dépendance** : Tag `v0.1.2-baseline` + LD-Router fonctionnel

---

## ⚙️ Rôle d'Ikigai dans l'Architecture 3 Couches

```
Ikigai = Boussole de Vie (Read-Only sur les LD)
→ Accès Read ALL : LD01-LD08 (via useLDRead)
→ Config/Data dans : aspace-fw-ikigai (piliers, horizons, scores)
→ N'ÉCRIT JAMAIS dans un LD
```

### Matrice d'accès Ikigai
| LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **R** | **R** | **R** | **R** | **R** | **R** | **R** | **R** |

---

## ⚠️ PRÉ-REQUIS
1. Lire `_SPECS/CONTRACTS.md`
2. `npx tsc --noEmit` — Baseline stable
3. LD-Router (`src/lib/ld-router.ts`) DOIT exister (créé en V0.1.2)

---

## Phase 1 & 2 : Nettoyage

### Bugs critiques
- ❌ `useLD07Store` → Ikigai n'a PAS de store LD propre. Migrer vers `fw-ikigai.store.ts`
- ❌ Type `ParaItem` réutilisé → Créer `IkigaiPillar`, `IkigaiHorizon`
- ❌ Tabs `projects/areas/resources/archives` → Dashboard, Passion, Mission, Vocation, Profession

### Étapes concrètes
1. Supprimer `src/stores/ld07.store.ts` (ou le renommer en `ld07-creativity` pour le LD réel)
2. Créer `src/stores/fw-ikigai.store.ts` — Config et données Ikigai
3. Remplacer les tabs par les VRAIS onglets Ikigai
4. Valider `register.ts` contre CONTRACTS.md §1

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1-2 OK"
```

---

## Phase 3 : Renforcement des Fondations (FW Store Ikigai)

### IndexedDB `aspace-fw-ikigai`
```typescript
// Base : 'aspace-fw-ikigai'
// Stores :
//   - 'pillars'     → { id, type, items, score }
//   - 'horizons'    → { id, level, title, objectives, deadline }
//   - 'ikigai_meta' → { id: 'global', overallScore, lastUpdated }

interface IkigaiPillar {
  id: string;
  type: 'passion' | 'mission' | 'vocation' | 'profession';
  items: string[];         // Passions, missions, etc.
  score: number;           // 0-100
}

interface IkigaiHorizon {
  id: string;
  level: 'H1' | 'H3' | 'H10' | 'H30' | 'H90';
  title: string;
  objectives: string[];
  deadline?: number;
  linkedLdProjects?: Array<{ ldId: string; projectId: string }>; // Lecture seule via LD-Router
}
```

### Lecture des LD (Read-Only)
```typescript
// Ikigai LIT les objectifs PARA depuis les 8 LD pour alimenter les Horizons
// JAMAIS d'écriture — utilise useLDRead() du LD-Router

import { useLDRead } from '../../lib/ld-router';

function useIkigaiContext() {
  const ld01Projects = useLDRead('ld01', 'projects'); // Business
  const ld03Projects = useLDRead('ld03', 'projects'); // Health
  // ... agrège pour montrer la boussole
}
```

### Invariants
- ❌ Ikigai ne doit JAMAIS appeler `writeToLD()` — lecture seule
- ❌ Ikigai ne doit JAMAIS importer `fw-para.store` ou autre FW store
- ✅ Ikigai écrit UNIQUEMENT dans `aspace-fw-ikigai`

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 3 OK"
```

---

## Phase 4 : Logique Horizon & Scoring

1. Moteur de projection temporelle H1→H90 (calcul de dates)
2. Hook `useIkigai()` — accès global sécurisé au FW store
3. Scoring : `overallScore = moyenne pondérée des 4 piliers`
4. Cross-read : les objectifs H90 LISENT (pas écrivent) les projets PARA via LD-Router

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Dashboard Ikigai (Pattern 7)

### Fichiers à créer
- `src/apps/ikigai/pages/Dashboard.tsx` — Vue d'ensemble
- `src/apps/ikigai/components/IkigaiCompass.tsx` — SVG interactif des 4 cercles
- `src/apps/ikigai/components/HorizonSlider.tsx` — Navigation H1→H90

### Contrat Dashboard
```typescript
interface IkigaiDashboardProps {
  embedded?: boolean;  // true = dans CC
}
// 1. Score Ikigai global (cercle SVG)
// 2. 4 cartes Piliers avec scores
// 3. Timeline Horizon (H1→H90)
// 4. Actions rapides
```

### Intégration CC
```typescript
case 'ikigai': return <IkigaiDashboard embedded />;
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 : Identité & Style

1. Deep Linking `aspace://app/ikigai?view=horizon&level=H10`
2. Animation Scarabée au centre de la boussole
3. Thème "Aura" : bordure change selon le pilier dominant

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 6 OK"
```

---

## Phase 7 : Audit

### Tests
1. Dashboard : score, piliers, horizons visibles
2. Naviguer Passion → liste d'items du pilier
3. CC sidebar "Ikigai" → Dashboard embedded
4. DevTools → `aspace-fw-ikigai` (données Ikigai) — PAS de `aspace-ld07`
5. Vérifier qu'Ikigai n'a AUCUNE écriture dans les LD (audit LD-Router logs)

### Checklist
- [ ] Store = `fw-ikigai.store.ts` (PAS ld07)
- [ ] Types = `IkigaiPillar`, `IkigaiHorizon` (PAS ParaItem)
- [ ] Accès LD = Read-Only via `useLDRead`
- [ ] Dashboard embeddable dans CC

### Condition de sortie
Phase 7 passée → `git tag v0.1.3-baseline`
