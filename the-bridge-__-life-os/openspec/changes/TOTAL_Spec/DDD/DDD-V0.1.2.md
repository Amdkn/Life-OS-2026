# DDD-V0.1.2 — Meta-Prompt PARA Business 🧿

> **Contexte** : V0.1.2 (Framework PARA — Projets, Areas, Ressources, Archives)
> **Directives pour Ralph (A3 Dev)**
> **Source de vérité** : `_SPECS/CONTRACTS.md` + `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-012_V0.1.2_PARA_Structure.md`
> **Dépendance** : Tag `v0.1.1-baseline`

---

## ⚠️ PRÉ-REQUIS ABSOLU
1. Lire `_SPECS/CONTRACTS.md` — Contrats d'API
2. Lire `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md` — Architecture 3 couches
3. `npx tsc --noEmit` — Baseline stable
4. Vérifier que `src/apps/para/ParaApp.tsx` existe (PascalCase)

---

## ⚙️ Rôle de PARA dans l'Architecture 3 Couches

```
PARA = Gestionnaire de Projets UNIVERSEL
→ Accès Write ALL : LD01-LD08 (via LD-Router)
→ Config dans : aspace-fw-para
```

PARA est le SEUL framework qui peut créer, modifier et archiver des projets dans CHAQUE domaine de vie. Un projet "Rénovation cuisine" → LD06 (Habitat). Un projet "Lancement SaaS" → LD01 (Business).

### Matrice d'accès PARA
| LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **W** | **W** | **W** | **W** | **W** | **W** | **W** | **W** |

---

## Phase 1 : Nettoyage & Dette Technique (Partie A)

### Fichiers à auditer
- `src/apps/para/register.ts` — Doit matcher CONTRACTS.md §1
- `src/apps/para/ParaApp.tsx` — Import corrigé : `./ParaApp` (PAS `./PARAApp`)
- `src/stores/ld01.store.ts` — ⚠️ MIGRATION : Ce store ne gère plus QUE les données LD01 (Business). La config PARA va dans `fw-para.store.ts`

### Étapes concrètes
1. Valider `register.ts` : `import App from './ParaApp'`
2. Séparer la logique : données LD → `ld-router.ts`, config PARA → `fw-para.store.ts`
3. Supprimer tout mock data PARA dans le Command Center Dashboard
4. Nettoyer les types hérités de V0.1.1

### Anti-patterns à traquer
- ❌ Import `'./PARAApp'` (mauvais casing, fichier = `ParaApp.tsx`)
- ❌ Écrire directement dans un IndexedDB LD sans passer par le LD-Router
- ❌ Stocker la config PARA (filtres, ordre colonnes) dans un LD au lieu de `aspace-fw-para`

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1 OK"
```

---

## Phase 2 : Nettoyage & Dette Technique (Partie B)

### Étapes concrètes
1. Refactoriser ParaApp.tsx si > 200 lignes (limite Gravity Claws)
2. Extraire les sous-composants en fichiers séparés
3. Ajouter le sélecteur de domaine LD dans le header PARA (pour choisir LD01-LD08)
4. Audit de l'isolation : aucun import de `shell.store` dans la logique métier PARA

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 2 OK"
```

---

## Phase 3 : Renforcement des Fondations (LD-Router + FW Store)

### Fichier prioritaire à créer : LD-Router
```typescript
// src/lib/ld-router.ts
// Point d'entrée UNIQUE pour les écritures cross-LD (ADR-FWK-020)

type LDId = 'ld01' | 'ld02' | 'ld03' | 'ld04' | 'ld05' | 'ld06' | 'ld07' | 'ld08';
type Permission = 'read' | 'write';

const PERMISSIONS: Record<string, Record<LDId, Permission[]>> = {
  'para': { ld01: ['read','write'], ld02: ['read','write'], /* ... ALL W */ },
  'ikigai': { ld01: ['read'], ld02: ['read'], /* ... ALL R */ },
  // ...
};

export async function writeToLD(
  ldId: LDId, store: string, action: 'add' | 'update' | 'delete',
  data: unknown, callerFramework: string
): Promise<void> {
  if (!PERMISSIONS[callerFramework]?.[ldId]?.includes('write')) {
    throw new Error(`[LD-Router] ${callerFramework} n'a pas le droit d'écrire dans ${ldId}`);
  }
  // ... exécuter l'écriture dans la bonne IndexedDB
}

export function useLDRead(ldId: LDId, store: string) {
  // Lecture seule, retourne les données sans mutation
}
```

### Config PARA : `aspace-fw-para`
```typescript
// src/stores/fw-para.store.ts
// Stocke la CONFIG et l'état UI de PARA (PAS les données de projets)

interface FwParaConfig {
  activeTab: string;          // 'projects' | 'areas' | 'resources' | 'archives'
  activeLdFilter: LDId | 'all'; // Quel domaine LD est affiché
  sortBy: 'name' | 'date' | 'priority';
  viewMode: 'grid' | 'list';
  columnOrder: string[];
}
```

### Données projets : Répartis dans les 8 LD
```typescript
// Les projets PARA sont stockés dans les 8 bases LD selon leur domaine
// Chaque LD a les mêmes object stores (ADR-MEM-001) :
//   - 'projects' → { id, title, status, priority, areaId, domain: LDId }
//   - 'items'    → { id, projectId, type, content, tags }
//   - 'metrics'  → { id, name, value, date }

// PARA affiche les projets de TOUS les LD ou filtré par LD
// Via le LD-Router : useLDRead('ld01', 'projects') + useLDRead('ld02', 'projects') + ...
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 3 OK"
```

---

## Phase 4 : Renforcement des Fondations (Store PARA)

### Étapes concrètes
1. Implémenter `fw-para.store.ts` — Config Zustand avec persistence localStorage
2. Implémenter le hook `useParaProjects()` :
   - Si `activeLdFilter === 'all'` → agrège les projets de tous les LD via LD-Router
   - Si `activeLdFilter === 'ld01'` → filtre sur LD01 uniquement
3. Ajouter le sélecteur de domaine dans le header PARA
4. Implémenter le CRUD via LD-Router (pas d'accès direct à IndexedDB)

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Nouvelles Features (Dashboard + CRUD)

### Fichiers à créer
- `src/apps/para/pages/Dashboard.tsx` — Vue d'ensemble (Pattern 7)
- `src/apps/para/components/ProjectEditor.tsx` — Formulaire riche
- `src/apps/para/components/AreaGrid.tsx` — Grille visuelle des areas
- `src/apps/para/components/DomainSelector.tsx` — Sélecteur LD01-LD08

### Contrat Dashboard PARA
```typescript
interface ParaDashboardProps {
  embedded?: boolean;  // true = dans CC
}

// Sections obligatoires :
// 1. KPIs par domaine (nombre projets actifs par LD)
// 2. Projets récents (top 5 cross-LD)
// 3. Sélecteur de domaine LD (filtre visuel)
// 4. Actions rapides (Nouveau projet, Archiver)
```

### Intégration CC
```typescript
case 'para': return <ParaDashboard embedded />;
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 : Style & Deep Linking

### Styles PARA (Archo-Futuriste)
```css
.para-forge    { border-color: var(--copper-glow); }     /* Projets */
.para-gardens  { border-color: rgba(16, 185, 129, 0.3); } /* Areas */
.para-vault    { border-color: var(--brass-glow); }       /* Resources */
.para-crypt    { border-color: rgba(255, 255, 255, 0.1); } /* Archives */
```

### Étapes
1. Deep linking `aspace://app/para?tab=projects&ld=ld01`
2. Micro-animations de transition entre tabs
3. Badges de domaine colorés par LD

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 6 OK"
```

---

## Phase 7 : Audit, Tests & Conformité

### Tests automatisés
```bash
npx tsc --noEmit
npx vite build --mode production
```

### Tests manuels
1. Ouvrir PARA → Dashboard avec KPIs par domaine
2. Créer un projet dans LD01 (Business) → il apparaît
3. Switcher filtre vers LD03 (Health) → le projet LD01 disparaît
4. DevTools → IndexedDB → `aspace-fw-para` (config) + `aspace-ld01-business` (données)
5. Vérifier que PARA n'écrit JAMAIS dans `aspace-fw-ikigai` ou autre FW

### Checklist
- [ ] `register.ts` conforme CONTRACTS.md §1
- [ ] LD-Router créé et fonctionnel
- [ ] Config PARA dans `aspace-fw-para` (PAS dans un LD)
- [ ] Données projets dans les 8 LD via LD-Router
- [ ] Dashboard accessible standalone ET embedded dans CC
- [ ] ParaApp.tsx < 200 lignes

### Condition de sortie
Phase 7 passée → `git tag v0.1.2-baseline` → Transition V0.1.3
