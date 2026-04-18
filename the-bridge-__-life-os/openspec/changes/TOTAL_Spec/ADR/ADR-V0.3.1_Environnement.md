# ADR-V0.3.1 — Environnement & VFS

> **PRD** : PRD-V0.3.1 · **Exécuteur** : A3

## Décision
Utiliser IndexedDB pour les wallpapers. Implémenter une **Architecture de Couches (Layering)** stricte pour éviter l'occlusion visuelle. Adopter un **Moteur de Thèmes à 3 Variables** (`bg`, `accent`, `text`) injectées globalement.

## Phase A : Wallpaper Manager (6 étapes)

### Contrats
```typescript
// useWallpaper.ts
// Gère asynchronisme, isMounted et revokeObjectURL pour éviter les fuites.
export function useWallpaper(): string;

// Layering dans Desktop.tsx
// L-10: fixed inset-0 z-[-10] (Wallpaper)
// L-9:  fixed inset-0 z-[-9] bg-black/40 (Overlay)
// L0:   relative z-0 (Interface)
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | NEW `wallpaper.idb.ts` | CRUD IndexedDB pour blobs wallpaper. |
| A.2 | MODIFY `Desktop.tsx` | Appliquer Layering L-10/L-9/L0. Supprimer `bg-black` du parent. |
| A.3 | NEW `useWallpaper.ts` | Hook réactif avec gestion de cycle de vie des URLs de blobs. |
| A.4 | REFACT `Desktop.tsx` | Ajouter `key={activeWallpaperId}` sur la div wallpaper pour forcer le refresh. |
| A.5 | MODIFY `index.css` | Passer `body { background: transparent }`. |
| A.6 | Gate | Upload + switch + visibilité garantie à travers le Glassmorphism. |

## Phase B : Theme Switcher (4 étapes)

### Contrats
```typescript
// THEME_TOKENS strict contract
'--theme-bg': string;
'--theme-accent': string;
'--theme-accent-rgb': string; // Calculé dynamiquement pour les opacités
'--theme-text': string;
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `theme-tokens.ts` | Map thèmes → 3 variables de base + RGB. |
| B.2 | MODIFY `useThemeApply.ts` | Injecter `hexToRgb` pour transformer l'accent en variables utilisables en `rgba()`. |
| B.3 | GLOBAL PURGE | Supprimer `text-white`, `text-emerald-*` etc. Remplacer par `text-[var(--theme-text)]`. |
| B.4 | Gate | Thème clair lisible (texte sombre) et thème sombre contrasté. |
