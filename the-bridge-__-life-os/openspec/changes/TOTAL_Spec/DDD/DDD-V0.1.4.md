# DDD-V0.1.4 — Meta-Prompt Life Wheel 🧿

> **Contexte** : V0.1.4 (Framework Life Wheel — Équilibre de Vie, Radar 8 Domaines)
> **Source de vérité** : `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-014_V0.1.4_LifeWheel_Structure.md`
> **Dépendance** : Tag `v0.1.3-baseline` + LD-Router fonctionnel

---

## ⚙️ Rôle de Life Wheel dans l'Architecture 3 Couches

```
Life Wheel = Tableau de Bord d'Équilibre (Read-Only + Agrégation)
→ Accès Read ALL : LD01-LD08 (via useLDRead) — pour calculer les scores
→ Accès Read FW : lit les SCORES de aspace-fw-ikigai, fw-12wy, etc.
→ Config/Data dans : aspace-fw-wheel (historique scores, pondérations)
→ N'ÉCRIT JAMAIS dans un LD ni dans un autre FW
```

Life Wheel est le **seul framework autorisé à lire les scores d'autres FW stores** (exception ADR-FWK-020 Règle 3) pour calculer son agrégation.

---

## Phase 1 & 2 : Nettoyage

### Bugs critiques
- ❌ `lifewheelApp` → `LifeWheelApp` (PascalCase obligatoire)
- ❌ `useLD02Store` → Supprimer. Wheel n'a PAS de LD propre, migrer vers `fw-wheel.store.ts`
- ❌ Type `ParaItem` → Créer `WheelDomain`, `WheelHistoryEntry`
- ❌ Tabs PARA → Dashboard, Domains, Analytics, Growth

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1-2 OK"
```

---

## Phase 3 : FW Store Life Wheel

### IndexedDB `aspace-fw-wheel`
```typescript
interface WheelDomain {
  id: string;
  name: string;        // 'Business', 'Finance', 'Health'...
  ldId: string;        // 'ld01', 'ld02'... — quel LD ce domaine lit
  score: number;       // 0-100 (calculé automatiquement)
  weight: number;      // Pondération (0.5 à 2.0)
  color: string;
}

interface WheelHistoryEntry {
  id: string;
  date: number;
  globalScore: number;
  domainScores: Record<string, number>;
}
```

### 8 Domaines pré-configurés
| Domaine | LD Source | Couleur |
|---------|----------|---------|
| Business | LD01 | `#10b981` |
| Finance | LD02 | `#f59e0b` |
| Health | LD03 | `#ef4444` |
| Cognition | LD04 | `#3b82f6` |
| Relations | LD05 | `#8b5cf6` |
| Habitat | LD06 | `#f97316` |
| Creativity | LD07 | `#ec4899` |
| Impact | LD08 | `#14b8a6` |

### Lecture cross-LD + cross-FW
```typescript
// Life Wheel lit les 8 LD pour les métriques
const ld01Data = useLDRead('ld01', 'metrics');
// ... pour les 8 LDs

// Life Wheel lit AUSSI les scores des autres FW (exception unique)
// Ikigai overall score, 12WY execution score, GTD inbox count
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 3 OK"
```

---

## Phase 4 : Agrégation & History

1. `globalScore = Σ(domain.score × domain.weight) / Σ(weights)`
2. Historisation : snapshot quotidien dans `aspace-fw-wheel.history`
3. Protection anti-scores aberrants : clamp 0-100, NaN → 0
4. Routage inverse : clic domaine → ouvre l'app du domaine

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Dashboard Life Wheel (Pattern 7)

### Contrat Dashboard
```typescript
interface LifeWheelDashboardProps { embedded?: boolean; }
// 1. Score global (grand cercle central)
// 2. Radar SVG dynamique des 8 domaines
// 3. Grille de 8 DomainGaugeCards
// 4. Graph d'évolution historique
```

### CC : `case 'life-wheel': return <LifeWheelDashboard embedded />;`

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 & 7 : Style + Audit

1. Radar avec animations morphing
2. Styles "Brass/Copper" sur contours
3. Test : DevTools → `aspace-fw-wheel` (PAS `aspace-ld02`)
4. Test : Wheel n'écrit dans AUCUN LD

### Condition de sortie → `git tag v0.1.4-baseline`
