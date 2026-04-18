# PRD-V0.4.6 — Le Scanner de la Flotte (PARA Dashboard)

> **Phase** : V0.4.6 · **Statut** : 🏗️ Draft

## 1. TVR
- **T** : Moyenne. Le radar chart peut être fait en CSS pur (barres horizontales). Le Friction Log est un filtre Zustand. L'Airlock DEAL réutilise `createDefinitionFromText` existant.
- **V** : Majeure. Transforme le Dashboard Overview de PARA d'une page vide en un véritable scanner de commandement.
- **R** : Les 3 widgets (Balance, Friction, Airlock) sont des composants autonomes réutilisables dans d'autres dashboards.

## 2. User Stories

### Phase A : Balance Life Wheel
- **US-52 : Graphe de répartition**
  - [ ] Création de `LifeWheelBalance.tsx` : 8 barres horizontales, chaque barre = `projets actifs dans ce domaine / total projets actifs × 100%`.
  - [ ] Couleurs via `DomainConfig` (V0.3.2).
  - [ ] Intégration dans `Dashboard.tsx`.

### Phase B : Friction Log
- **US-53 : Projets en souffrance**
  - [ ] Création de `FrictionLog.tsx`.
  - [ ] Critère "STALLED" : `progress` inchangé ET `project.status === 'active'` depuis > 14 jours (approximation : check `archivedAt` ou `updatedAt` si disponible).
  - [ ] Critère "NO ACTIONS" : 0 items GTD avec `projectId === project.id`.
  - [ ] Badge rouge "STALLED" / orange "NO ACTIONS".

### Phase C : Airlock DEAL
- **US-54 : Archive Radar**
  - [ ] Création de `ArchiveRadar.tsx` : liste les projets `status === 'completed'` ou `'archived'` triés par `archivedAt` desc.
  - [ ] Bouton "Transfer to DEAL" → `createDefinitionFromText(project.title)` + `openApp('deal')`.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| Lib externe pour le graphe (Chart.js, D3) | CSS pur avec des barres et `style={{ width }}` |
| Friction Log lié à un timer backend | Calcul côté client basé sur `updatedAt` ou approximation |
| Airlock DEAL copie tout le projet | Copie seulement le `title` via `createDefinitionFromText` |
