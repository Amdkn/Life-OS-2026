# DDD-V0.1.9 — Meta-Prompt App Store & Settings 🧿

> **Contexte** : V0.1.9 (Écosystème — Launchpad, Paramètres globaux, Installation de modules)
> **ADR** : `_SPECS/ADR/ADR-FWK-019_Settings_Structure.md`
> **Dépendance** : Tag `v0.1.8-baseline`

---

## ⚠️ PRÉ-REQUIS
1. Lire `_SPECS/CONTRACTS.md`
2. `npx tsc --noEmit` — Baseline stable

---

## Phase 1 & 2 : Nettoyage

### Fichiers existants
- `src/apps/store/AppStore.tsx` — App Store existant
- `src/apps/store/register.ts` — Valider CONTRACTS.md
- `src/components/AppDrawer.tsx` — Le Launchpad/Drawer existant

### Étapes concrètes
1. Audit de AppStore : vérifier que la liste d'apps est dynamique (pas hardcodée)
2. Fusionner les fonctions Store + Settings dans une app unifiée
3. Créer les types `InstalledApp`, `AppListing`, `OsSettings`
4. Tabs : Dashboard, Browse Apps, Installed, OS Settings, Theme

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1-2 OK"
```

---

## Phase 3 : Renforcement (Settings persistent)

### Schéma localStorage (pas IndexedDB — petites données)
```typescript
// Clé : 'aspace-os-settings-v1'
interface OsSettings {
  theme: 'solarpunk' | 'cyberpunk' | 'minimal';
  wallpaper: string;  // URL ou nom prédéfini
  vetoDefaultStatus: boolean;
  dockPosition: 'bottom' | 'left';
  language: 'en' | 'fr';
  animations: boolean;
}

// Les apps installées sont lues depuis app-registry.ts (pas dupliquées)
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 3 OK"
```

---

## Phase 4 : Marketplace Logic

1. `AppListing` — catalogue d'apps disponibles (hardcoded pour V0.1.9, API future)
2. Système d'installation : `registerApp()` dynamique (existe déjà)
3. Système de désinstallation : `unregisterApp()` à créer
4. Score de "Santé OS" : nombre d'apps installées, espace LD utilisé

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Dashboard Store & Settings (Pattern 7)

### Contrat Dashboard
```typescript
interface StoreDashboardProps {
  embedded?: boolean;
}

// Sections obligatoires :
// 1. Apps installées (grille avec icônes)
// 2. Santé OS (nombre d'apps, taille IDB, erreurs récentes)
// 3. Thème actuel (preview)
// 4. Quick Settings (toggle animations, veto default, language)
```

### Intégration CC
```typescript
// Le Store est accessible depuis le Dock (dernier slot)
// Pas d'intégration dans le sidebar CC — c'est une app système
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 : Thème & Personnalisation

1. Switcher de thème : Solarpunk (défaut) / Cyberpunk / Minimal
2. Sélecteur de wallpaper (3 options prédéfinies)
3. Toggle animations on/off
4. Deep linking `aspace://settings?tab=theme`

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 6 OK"
```

---

## Phase 7 : Audit Final V0.1.x

### Tests V0.1.9 spécifiques
1. Ouvrir Store → Dashboard avec apps installées, santé OS
2. Changer de thème → reload → thème persiste
3. Toggle animations → transitions changent
4. Voir la liste des apps → correspond à app-registry

### Audit GLOBAL de la série V0.1.x
Ce dernier cycle doit aussi valider :
- [ ] Toutes les apps (CC, PARA, Ikigai, Wheel, 12WY, GTD, DEAL, Agents) chargent
- [ ] Tous les Dashboards sont accessibles standalone ET embedded dans CC
- [ ] Tous les stores LD00-LD08 sont isolés
- [ ] `npm run gate` passe sans erreur
- [ ] Aucune donnée ne fuit entre les LDs

### Condition de sortie
Phase 7 passée → `git tag v0.1.9-baseline` → **V0.2 READY** 🎉
