# PRD-V0.4.5 — UX Spock : Laboratoire Areas

> **Phase** : V0.4.5 · **Statut** : 🏗️ Draft

## 1. TVR
- **T** : Basse. Masquer un bouton + créer un dashboard de lecture. Pas de changement de modèle de données.
- **V** : Haute. Les Areas passent de "liste passive" à "laboratoire de surveillance" (Spock).
- **R** : Le `PillarDashboard` pourra être réutilisé dans les vues Ikigai et 12WY.

## 2. User Stories

### Phase A : Immutabilité
- **US-50 : Suppression `+ New Area`**
  - [ ] Le bouton `+ New` est invisible quand `activeTab === 'areas'`.
  - [ ] Aucune action `addArea` n'existe ni n'est nécessaire.

### Phase B : Pillar Dashboard
- **US-51 : Dashboard de surveillance Pilier**
  - [ ] Création de `PillarDashboard.tsx` : affiche pour un `(domain, pillar)` donné :
    - Les projets actifs liés (`projects.filter(p => p.domain === domain && p.pillars.includes(pillar))`).
    - Les actions GTD actionables du domaine (`items.filter(i => i.linkedLd === ldId && i.status === 'actionable')`).
    - Une jauge d'activité manuelle (slider 0-100, stockée localement dans un state React, non persistée).
  - [ ] `DomainCard` : le clic sur un pilier ouvre le `PillarDashboard` en overlay local.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| CRUD sur les Areas (creation/suppression de domaines) | Domaines sont des constantes immuables (Life Wheel) |
| Pillar click → ouvre une modale d'édition | Pillar click → ouvre un dashboard de lecture (Spock observe, ne modifie pas) |
| Persister la jauge de santé dans IndexedDB | State local React (info indicative, pas de contrat de données) |
