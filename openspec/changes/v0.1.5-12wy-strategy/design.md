# Design : V0.1.5 — 12WY Execution Engine 🧿

## Architecture UI
Layout symétrique autour d'un noyau central :
- `WeekNavigationGrid` : Deux colonnes de 6 cartes `WeekCard`.
- `TacticalCentralHub` : Conteneur focal affichant les objectifs à haute priorité.
- `StrategyToolbar` : Composant de navigation transversale.

## Flux de Données
Le store `twelve-wy.store.ts` agrège les données de LD05 (Semaines/Tactiques) et LD01 (Projets liés).

## Style Visuel
Bordures néon-glass "Archo-Futuriste".
Utilisation de courbes de Bézier pour relier les semaines au hub central (simulant la convergence vers les objectifs).
Grille de fond type "Blueprint Solarpunk".
