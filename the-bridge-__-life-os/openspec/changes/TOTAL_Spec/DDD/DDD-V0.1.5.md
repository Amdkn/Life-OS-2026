# DDD-V0.1.5 — Meta-Prompt 12 Week Year Strategy 🧿

> **Contexte** : V0.1.5 (Framework 12WY — Cycles de 12 Semaines, Tactiques)
> **Source de vérité** : `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-015_V0.1.5_12WY_Structure.md`
> **Dépendance** : Tag `v0.1.4-baseline` + LD-Router fonctionnel

---

## ⚙️ Rôle de 12WY dans l'Architecture 3 Couches

```
12WY = Moteur d'Exécution Stratégique (Write LD01 + Read ALL)
→ Accès Write : LD01 (Business — tactiques créent des actions)
→ Accès Read : LD02-LD08 (contexte pour stratégie)
→ Config/Data dans : aspace-fw-12wy (cycles, semaines, tactiques, scores)
```

### Matrice d'accès 12WY
| LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **W** | R | R | R | R | R | R | R |

---

## Phase 1 & 2 : Nettoyage

- Vérifier PascalCase `TwelveWeekApp`
- Supprimer duplication logique avec PARA
- Créer `fw-12wy.store.ts` (PAS dans un LD)
- Tabs : Dashboard, Vision, Weekly, Measures, Comms

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 3 : FW Store 12WY

### IndexedDB `aspace-fw-12wy`
```typescript
interface TwelveWeekCycle {
  id: string;
  startDate: number;
  endDate: number;
  objectives: Objective[];
  status: 'active' | 'completed' | 'upcoming';
}

interface WeekEntry {
  id: string;
  cycleId: string;
  weekNumber: number;  // 1-12
  score: number;       // 0-100
  tactics: TacticItem[];
}

interface TacticItem {
  id: string;
  weekId: string;
  title: string;
  completed: boolean;
  score: number;
  linkedLdProjectId?: string; // Référence optionnelle à un projet dans LD01
}
```

### Écriture vers LD01 via LD-Router
```typescript
// Quand une tactique est "commit", elle peut créer un item dans LD01
import { writeToLD } from '../../lib/ld-router';

async function commitTactic(tactic: TacticItem) {
  await writeToLD('ld01', 'items', 'add', {
    type: 'task',
    content: tactic.title,
    tags: ['12wy', `week-${tactic.weekId}`]
  }, '12wy'); // callerFramework = '12wy'
}
```

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 4-6 : Sprint Logic + Dashboard + Style

### Dashboard 12WY
```typescript
interface TwelveWeekDashboardProps { embedded?: boolean; }
// 1. Barre W1-W12 (semaine courante highlight)
// 2. Score d'exécution global
// 3. Top 3 Objectives avec barres
// 4. Focus tactique semaine courante
```

### CC : `case '12wy': return <TwelveWeekDashboard embedded />;`

### Build Gate ✅ par phase

---

## Phase 7 : Audit

- DevTools → `aspace-fw-12wy` existe (PAS de `aspace-ld05`)
- Écriture LD01 via LD-Router : vérifier les logs
- Aucune écriture dans LD02-LD08

### Condition de sortie → `git tag v0.1.5-baseline`
