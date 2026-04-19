# DDD-V0.1.1 — Meta-Prompt Cœur / Command Center 🧿

> **Contexte** : V0.1.1 (Cœur de l'OS + Command Center)
> **Directives pour Ralph (A3 Engine)**
> **Source de vérité** : `_SPECS/CONTRACTS.md` (Contrats d'API — LECTURE OBLIGATOIRE)

---

## ⚠️ PRÉ-REQUIS ABSOLU
Avant toute modification, Ralph DOIT :
1. Lire `_SPECS/CONTRACTS.md` pour connaître les contrats d'API
2. Exécuter `npx tsc --noEmit` pour vérifier le baseline
3. Si le build échoue → MODE RCA (ne pas continuer)

---

## Phase 1 : Nettoyage & Dette Technique (Partie A)

### Fichiers à auditer
- `src/apps/*/register.ts` — Tous doivent suivre le template CONTRACTS.md §1
- `src/stores/shell.store.ts` — Vérifier qu'aucun import fantôme ne référence `src/store.ts`
- `src/components/*.tsx` — Aucun style inline, tout dans `index.css`

### Étapes concrètes
1. Lister tous les fichiers `register.ts` et valider la signature `registerApp({...manifest, component})`
2. Harmoniser les noms : `PascalCase` pour composants, `kebab-case` pour IDs
3. Supprimer tout fichier `src/store.ts` ou `src/Store.ts` obsolète
4. Migrer les styles CSS ad-hoc vers les tokens dans `index.css`

### Anti-patterns à traquer
- ❌ `registerApp(manifest, component)` — L'ancienne API à 2 arguments
- ❌ `this.children` dans ErrorBoundary — DOIT être `this.props.children`
- ❌ Template literals sans backticks : `return ${...}` au lieu de `` return `${...}` ``

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1 OK"
```

---

## Phase 2 : Nettoyage & Dette Technique (Partie B)

### Fichiers concernés
- `src/components/Toast.tsx` — z-index doit être > 1000 (au-dessus du Dock)
- `src/components/WindowFrame.tsx` — Standardiser `backdrop-blur` via classes CSS
- Supprimer les `console.log` sauf ceux préfixés par `A'Space:`

### Étapes concrètes
1. Audit z-index : Toast > Dock > Windows > Wallpaper
2. Refactoriser les filtres blur en classes CSS réutilisables (`glass`, `glass-card`, `glass-opaque`)
3. Supprimer les logs bruyants, garder uniquement `console.error("A'Space...")` dans ErrorBoundary
4. Valider que `openspec/changes/v0.1.1-command-center/` est structuré

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 2 OK"
```

---

## Phase 3 : Renforcement des Fondations (Shell)

### Fichiers à modifier
- `src/components/WindowFrame.tsx` — Butées physiques (CONTRACTS.md §3)
- `src/stores/shell.store.ts` — Anti-doublon d'ID (CONTRACTS.md §4)
- `src/components/ViewportGuard.tsx` — Wrapper du Desktop

### Étapes concrètes
1. Implémenter `clampPosition()` dans shell.store.ts (✅ déjà fait — valider)
2. Ajouter protection anti-doublon dans `openApp()` (✅ déjà fait — valider)
3. Ajouter versioning de schéma dans `localStorage` (✅ déjà fait avec `SCHEMA_VERSION`)
4. Vérifier que `ViewportGuard` est bien le wrapper racine de Desktop

### Invariants à protéger (CONTRACTS.md §4)
- `zIndex` capé à 1000 via `nextZ()`
- Position clampée : `y >= TOPBAR_HEIGHT + 10`, `y <= vHeight - DOCK_SAFE_AREA - 100`
- Schema version : `'0.1.1'` dans `LAYOUT_KEY`

### Build Gate ✅
```bash
npx tsc --noEmit && npx vite build --mode production 2>&1 | head -20
```

---

## Phase 4 : Renforcement des Fondations (BDD & Registre)

### Fichiers à créer
- `src/stores/ld00.store.ts` — Base méta pour le Core (IndexedDB `aspace-ld00`)
- `src/lib/routing/deep-linker.ts` — Parseur `aspace://app/[id]`

### Fichiers à modifier
- `src/lib/app-registry.ts` — Validation de l'intégrité au boot
- `src/components/Breadcrumbs.tsx` — Guard contre routes inexistantes

### Étapes concrètes
1. Créer le schéma IndexedDB `aspace-ld00` avec dexie ou idb
2. Ajouter `validateRegistry()` dans app-registry (vérifier que chaque manifest a un `component`)
3. Sécuriser Breadcrumbs : si la route n'existe pas → fallback sur "Dashboard"
4. Créer le parseur deep-link (stub pour l'instant, activation en V0.1.6)

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Nouvelles Features (Trinity Header)

### Fichiers à créer/modifier
- `src/apps/command-center/components/DashboardHeader.tsx` (✅ existe)
- `src/apps/command-center/pages/FocusView.tsx` (✅ existe)
- `src/apps/command-center/pages/StrategyView.tsx` (✅ existe)
- `src/apps/command-center/pages/DashboardPage.tsx` (✅ existe)

### Contrat du DashboardHeader
```typescript
type DashboardView = 'STANDARD' | 'FOCUS' | 'STRATEGY';
// Props : { activeView: DashboardView, onViewChange: (v) => void }
```

### Étapes concrètes
1. Valider que DashboardHeader switch correctement entre les 3 vues
2. Valider que FocusView rend les cartes GTD (StatCard)
3. Valider que StrategyView rend la barre de semaines 12WY
4. Vérifier template literals : tous doivent avoir des backticks `` ` ``

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 : Nouvelles Features (Archaeo-Futurism Design)

### Fichiers à modifier
- `src/index.css` — Variables `--copper-*`, `--brass-*`
- `src/components/WindowFrame.tsx` — Bordure `border-brass`
- `src/index.css` — Animation `scarabHatch`

### Étapes concrètes
1. Injecter `--copper-glow`, `--brass-glow` dans `:root` de index.css
2. Appliquer `border-brass` à WindowFrame (classe existante dans index.css)
3. Implémenter l'animation `scarabHatch` (transition opacity + scale)
4. Créer la classe `glass-card-matte` pour les fonds sablés

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 6 OK"
```

---

## Phase 7 : Audit, Tests & Conformité

### Tests automatisés OBLIGATOIRES
```bash
# Gate finale — TOUT doit passer
npx tsc --noEmit                          # 1. Zero erreurs TypeScript
npx vite build --mode production          # 2. Build réussi
```

### Tests manuels
1. Ouvrir `localhost:3000` — Le Shell doit afficher le Desktop avec le Dock
2. Cliquer sur Command Center — Le Dashboard doit afficher le Radar, les Tasks, la Fleet
3. Switcher entre Overview/Focus/Strategy — Les 3 vues doivent rendre du contenu
4. Supprimer `aspace-shell-layout-v1` du localStorage → Recharger → L'app doit auto-heal
5. Ouvrir toutes les apps → Chaque fenêtre montre soit du contenu soit le placeholder 🚧

### Checklist de conformité
- [ ] CONTRACTS.md §1 : Tous les `register.ts` respectent le template
- [ ] CONTRACTS.md §2 : ErrorBoundary utilise `this.props.children`
- [ ] CONTRACTS.md §3 : WindowFrame clamp les positions
- [ ] CONTRACTS.md §5 : Chaîne de rendu Desktop intacte
- [ ] Aucune donnée CC ne fuit hors de LD00

### Condition de sortie
Si Phase 7 passe → Git tag `v0.1.1-baseline` → Transition vers V0.1.2
