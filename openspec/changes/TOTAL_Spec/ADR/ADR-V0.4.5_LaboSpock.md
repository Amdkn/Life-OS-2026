# ADR-V0.4.5 — UX Spock : Laboratoire Areas

> **Phase** : V0.4.5

## Décision : Pillar Dashboard en Overlay Local (pas de route)

Le `PillarDashboard` est un overlay qui apparaît au sein de la vue Areas quand on clique sur un pilier. Il NE crée PAS de nouvelle fenêtre, il NE modifie PAS l'URL. C'est un composant d'inspection pure (Spock observe).

La jauge de santé est un `useState` local — délibérément non persisté car c'est un outil de réflexion instantanée, pas un KPI contractuel.

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `ParaApp.tsx` | Masquer `+ New` sur areas | `tsc` |
| B.1 | `PillarDashboard.tsx` | Créer composant : projets actifs + actions GTD + jauge slider | `tsc` |
| B.2 | `DomainCard.tsx` | Clic pilier → state local `selectedPillar` → affiche PillarDashboard | `npm run gate` |

---

# ADR-V0.4.6 — Le Scanner de Flotte (PARA Dashboard)

> **Phase** : V0.4.6

## Décision : CSS Pure pour les Visualisations

Pas de library de graphiques (Chart.js, D3, Recharts). La Balance Life Wheel est faite avec 8 `<div>` horizontaux dont la `width` est calculée en pourcentage. Le Friction Log est un filtre `.filter()` sur le store Zustand. L'Airlock DEAL réutilise l'action `createDefinitionFromText` existante dans `fw-deal.store.ts`.

### Contrat : `updatedAt` dans Project
Pour le Friction Log, le type `Project` nécessite un champ `updatedAt?: number` pour détecter les projets stagnants. Ce champ sera mis à jour à chaque `updateProject()`.

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `LifeWheelBalance.tsx` | Barres horizontales 8 domaines, couleurs DomainConfig | `tsc` |
| A.2 | `Dashboard.tsx` | Intégrer le composant | `tsc` |
| B.1 | `FrictionLog.tsx` | Filtre projets stagnants (0 GTD actions OU vieux) | `tsc` |
| B.2 | `Dashboard.tsx` | Intégrer sous la Balance | `tsc` |
| C.1 | `ArchiveRadar.tsx` | Liste archived + bouton DEAL | `tsc` |
| C.2 | `Dashboard.tsx` | Intégrer | `npm run gate` |
