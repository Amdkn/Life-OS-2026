# ADR-FWK-014 — Structure d'Exécution V0.1.4 (Life Wheel) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Déploiement du dashboard d'équilibre de vie Life Wheel (LD04).

## Décision : Cycle d'Exécution en 7 Phases (V0.1.4)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Refonte du radar-chart SVG actuel (trop statique).
2. Étape 2 : Correction des pondérations entre les 8 domaines de vie.
3. Étape 3 : Suppression des mockups d'historique.
4. Étape 4 : Optimisation de la lib de graph pour le mobile (si responsive).

### Phase 3 : Renforcement des Fondations (LD04 DB)
1. Étape 1 : Création de `aspace-ld04` (Store: `wheel_history`).
2. Étape 2 : Schéma d'historisation (Date, ScoreGlobal, DomainScores[]).
3. Étape 3 : Middleware d'agrégation (Calcul du score Pondéré).
4. Étape 4 : Isolation LD04 stricte.

### Phase 4 : Renforcement des Fondations (Domain Mapping)
1. Étape 1 : Système de synchronisation : LD04 lit LD01, LD02, LD03... pour s'auto-noter.
2. Étape 2 : Hook `useLifeWheelData` centralisé.
3. Étape 3 : Protection contre les scores aberrants (Out-of-range fix).
4. Étape 4 : Routage inverse : Clic radar → Ouvre l'App du domaine.

### Phase 5 : Nouvelles Features (Visual Hub)
1. Étape 1 : Radar Chart dynamique (Animations de morphing entre les scores).
2. Étape 2 : Grille de 8 `DomainGaugeCard` (Jauges interactives).
3. Étape 3 : Tooltips d'explication Archo-Futuristes au hover.
4. Étape 4 : Intégration dans le Dashboard Standard (Vue compacte).

### Phase 5 & 6 (Fusion) : Evolution & Style
1. Étape 1 : Graphique d'évolution historique (Line Chart "Solarpunk Glow").
2. Étape 2 : Styles métalliques "Brass/Copper" sur les contours du radar.
3. Étape 3 : Micro-animations de "battement de cœur" sur le score global.
4. Étape 4 : Deep linking `aspace://view/dashboard/standard?domain=ldxx`.

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Test de performance pendant l'animation de morphing du radar.
2. Étape 2 : Audit de précision : Vérifier que le score reflète bien la réalité IDB.
3. Étape 3 : Test de résilience de l'historique (5 ans de données simulées).
4. Étape 4 : Validation Veto Beth (Verrouillage du radar en mode Veto).
