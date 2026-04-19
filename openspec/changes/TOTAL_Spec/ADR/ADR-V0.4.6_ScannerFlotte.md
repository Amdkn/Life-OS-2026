# ADR-V0.4.6 — Le Scanner de Flotte (PARA Dashboard)

> **Phase** : V0.4.6

## Décision : CSS Pure pour les Visualisations

Pas de library de graphiques (Chart.js, D3, Recharts). La Balance Life Wheel est faite avec 8 `<div>` horizontaux dont la `width` est calculée en pourcentage. Le Friction Log est un filtre `.filter()` sur le store Zustand. L'Airlock DEAL réutilise l'action `createDefinitionFromText` existante dans `fw-deal.store.ts`.

### Contrat : `updatedAt` dans Project
Pour le Friction Log, le type `Project` nécessite un champ `updatedAt?: number` pour détecter les projets stagnants. Ce champ sera mis à jour à chaque `updateProject()`.

```typescript
// APRÈS dans fw-para.store.ts
export interface Project {
  // ... existing ...
  updatedAt?: number; // V0.4.6 — Friction Log tracking
}
// Dans updateProject :
set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...partial, updatedAt: Date.now() } : p) }));
```

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `LifeWheelBalance.tsx` | Barres horizontales 8 domaines, couleurs DomainConfig | `tsc` |
| A.2 | `Dashboard.tsx` | Intégrer le composant | `tsc` |
| B.1 | `FrictionLog.tsx` | Filtre projets stagnants (0 GTD actions OU vieux) | `tsc` |
| B.2 | `Dashboard.tsx` | Intégrer sous la Balance | `tsc` |
| C.1 | `ArchiveRadar.tsx` | Liste archived + bouton DEAL | `tsc` |
| C.2 | `Dashboard.tsx` | Intégrer | `npm run gate` |
