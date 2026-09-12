# PRD-012 — Linear comme Holding de Workspaces & QG de Flotte

## 1. Valeur et Remplacement
- **Obstacle :** Dispersion des tâches entre les vues locales sans synchronisation avec le QG stratégique Linear.
- **Remplacement :** Établir l'adaptateur de synchronisation Linear (`src/lib/linear/`) reliant les projets PARA et les domaines LD01-LD08 aux équipes et cycles Linear.

## 2. Périmètre et Données
- Mapping bidirectionnel sans écrasement :
  - Équipes Linear <=> Domaines Life Wheel & Projets PARA.
  - Issues Linear <=> Tâches ScoreCard / Tactiques 12WY.
- Préservation du mode hors-ligne : mise en file d'attente locale (Outbox Blackboard) en cas d'absence de réseau.

## 3. Acceptation Fonctionnelle
- Transformation des items ScoreCard en payloads Linear valides.
- Résolution sans conflit des statuts Todo / In Progress / Review / Done.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
