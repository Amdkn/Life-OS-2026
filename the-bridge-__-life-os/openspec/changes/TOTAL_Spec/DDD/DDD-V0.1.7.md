# DDD-V0.1.7 — Meta-Prompt DEAL Protocol 🧿

> **Contexte** : V0.1.7 (Framework DEAL — Definition, Elimination, Automation, Liberation)
> **Source de vérité** : `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-017_DEAL_Structure.md`
> **Dépendance** : Tag `v0.1.6-baseline` + LD-Router fonctionnel

---

## ⚙️ Rôle de DEAL dans l'Architecture 3 Couches

```
DEAL = Analyse de Frictions & Libération (Read-Only sur les LD)
→ Accès Read ALL : LD01-LD08 (identifier les frictions dans chaque domaine)
→ Config/Data dans : aspace-fw-deal (pipeline D→E→A→L, frictions, automations)
→ N'ÉCRIT JAMAIS dans un LD (les solutions sont implémentées via PARA ou GTD)
```

### Matrice d'accès DEAL
| LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **R** | **R** | **R** | **R** | **R** | **R** | **R** | **R** |

---

## Phase 1 & 2 : Nettoyage

- Créer `fw-deal.store.ts` (pas de LD propre)
- Types : `FrictionPoint`, `AutomationRule`, `DealPhase`
- Tabs : Dashboard, Define, Eliminate, Automate, Liberate

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 3 : FW Store DEAL

### IndexedDB `aspace-fw-deal`
```typescript
type DealPhaseType = 'define' | 'eliminate' | 'automate' | 'liberate';

interface FrictionPoint {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceLd: string;        // Quel LD contient cette friction
  status: 'identified' | 'in-progress' | 'resolved';
  resolution?: string;
  linkedParaProjectId?: string; // Résolution via PARA (optional)
}

interface AutomationRule {
  id: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused' | 'draft';
  hoursPerWeekSaved: number;
}
```

### Lecture des LD (Read-Only)
```typescript
// DEAL scanne les 8 LD pour identifier des frictions
const allLdData = await Promise.all(
  ['ld01','ld02','ld03','ld04','ld05','ld06','ld07','ld08'].map(
    ld => useLDRead(ld, 'items')
  )
);
// Analyse : items en retard, métriques basses, etc.
```

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 4-6 : Pipeline + Dashboard + Style

### Dashboard DEAL
```typescript
interface DealDashboardProps { embedded?: boolean; }
// 1. Pipeline visuel D→E→A→L (nb items par phase)
// 2. Score de Libération (heures/semaine récupérées)
// 3. Top 3 Frictions critiques
// 4. Automations actives
```

### CC : `case 'deal': return <DealDashboard embedded />;`

### Build Gate ✅ par phase

---

## Phase 7 : Audit

- DevTools → `aspace-fw-deal` existe (pas de LD propre)
- DEAL n'écrit dans AUCUN LD (vérifier logs LD-Router)
- Pipeline D→E→A→L : friction identifiée → résolue via PARA

### Condition de sortie → `git tag v0.1.7-baseline`
