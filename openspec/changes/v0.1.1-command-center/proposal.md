# PRD : V0.1.1 — Le Cœur (Command Center) 🧿

## Problem Statement
Le Command Center est actuellement une interface statique et rigide. Il manque de profondeur visuelle, de flexibilité de navigation (Trinity Dashboard) et souffre d'un bug critique permettant aux fenêtres de sortir du viewport, rendant l'OS inutilisable (Technician Trap).

## Target User
- **Amadeus (A0)** : Orchestrateur cherchant une vue holistique de ses systèmes.
- **A1/A2/A3 Crew** : Agents ayant besoin d'un hub de monitoring stable.

## Success Criteria (V0.1.1)
- [ ] Le `WindowFrame` ne peut plus jamais disparaître derrière le `TopBar` ou sortir des limites latérales.
- [ ] Le Dashboard propose un Header Menu avec 3 vues (Standard, Focus, Strategy).
- [ ] L'esthétique "Archaeo-Futuriste" (Cuivre/Laiton/Verre Sablé) est initiée.
- [ ] Le protocole `aspace://` est capable d'ouvrir le Command Center sur une page spécifique.

## Scope
### IN
- Finalisation du `WindowFrame` avec contraintes physiques.
- Refonte du `DashboardPage` avec Triple View (Standard/GTD/12WY).
- Intégration du Design System "Copper-Glass V1".
- Système de Deep Linking pour la navigation interne.

### OUT
- Développement complet de l'App PARA (prévu en V0.1.2).
- Intégration réelle du moteur de rendu 3D des Agents (prévu en V0.1.8).
