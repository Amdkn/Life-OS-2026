# ADR-FWK-015 — Structure d'Exécution V0.1.5 (12WY Strategy) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Implémentation du cycle 12WY (LD05). Focus sur la planification hebdomadaire et les tactiques.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.5)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Suppression de la duplication de logique entre 12WY et PARA.
2. Étape 2 : Correction du calcul des "Tactical Scores".
3. Étape 3 : Nettoyage du registre des événements 12WY passés.
4. Étape 4 : Harmonisation de la police monospace pour les dates techniques.

### Phase 3 : Renforcement des Fondations (LD05 DB)
1. Étape 1 : Création de `aspace-ld05` (Stores: `cycles`, `weeks`, `tactics`).
2. Étape 2 : Schéma de liaison : Tactic ↔ Project (LD01).
3. Étape 3 : Moteur de calcul de "Week Score" automatique.
4. Étape 4 : Isolation LD05.

### Phase 4 : Renforcement des Fondations (Sprint Logic)
1. Étape 1 : Hook `use12WYCycle` (Gestion du cycle courant / passé / futur).
2. Étape 2 : Logique de rollover (Passage d'une semaine à l'autre).
3. Étape 3 : Validation du chargement asynchrone des tactiques.
4. Étape 4 : API interne pour le Shield `Veto Ready`.

### Phase 5 : Nouvelles Features (Tactical Dashboard)
1. Étape 1 : Grille symétrique W1-W12.
2. Étape 2 : Tactical Hub Central (Focus mode).
3. Étape 3 : Barre de navigation Strategy (Vision, Planning, Control, Measure).
4. Étape 4 : Cartes de progression dynamiques avec mini-graphes.

### Phase 6 : Nouvelles Features (Visual Convergence)
1. Étape 1 : Lignes de Bézier animées reliant les semaines au centre.
2. Étape 2 : Styles néon-glass Archo-Futuristes.
3. Étape 3 : Bouton "Commit Week" avec animation solarpunk.
4. Étape 4 : Deep Linking `aspace://app/12wy?week=current`.

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Test de cohérence : Une tactique doit être réalisable en < 7j.
2. Étape 2 : Audit de performance sur le rendu des 12 graphes simultanés.
3. Étape 3 : Test de résilience lors des sauts de cycles (Semaine 13/Reset).
4. Étape 4 : Veto Beth : Empêcher le "Commit" si fatigue détectée (Life Wheel Health).
