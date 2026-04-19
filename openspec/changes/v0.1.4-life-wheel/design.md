# Design : V0.1.4 — Life Wheel Dashboard 🧿

## Architecture
Le composant `LifeWheelApp` orchestre 3 sous-systèmes :
1. `DomainRadar` : Moteur de rendu SVG/Canvas pour le radar chart.
2. `DomainMetricList` : Grille réactive de cartes `DomainGaugeCard`.
3. `EvolutionChart` : Intégration d'un mini-moteur de graphique (ou composant custom Archo-Futuriste).

## Routage
Toutes les interactions (Axe du radar, Carte de jauge) déclenchent un routage vers le détail du domaine spécifique via le Command Center (Loi du Dualisme).
Exemple : `aspace://view/dashboard/strategy?domain=ld02`

## Éléments de Style
Utilisation de gradients denses sur l'octogone pour simuler le "flux d'énergie" entre les domaines.
Bordures des jauges en cuivre ciselé.
