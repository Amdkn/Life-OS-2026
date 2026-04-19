# ADR-FWK-013 — Structure d'Exécution V0.1.3 (Ikigai Protocol) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Déploiement du framework Ikigai (LD03). Focus sur les horizons temporels et la boussole décisionnelle.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.3)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Nettoyage du registre des sous-agents obsolètes.
2. Étape 2 : Harmonisation des styles de cartes Ikigai avec le Design System global.
3. Étape 3 : Correction des calculs de dates pour les horizons (H1=365j glissants).
4. Étape 4 : Suppression des constantes de "Vision" hardcodées.

### Phase 3 : Renforcement des Fondations (LD03 DB)
1. Étape 1 : Création de la DB `aspace-ld03` (Stores: `ikigai_piliers`, `horizons`).
2. Étape 2 : Implémentation de la persistance des 4 cercles (Passion, Mission, etc.).
3. Étape 3 : Mise en place du tracker de "Raison d'Être" (Score Ikigai).
4. Étape 4 : Validation de l'isolation LD03.

### Phase 4 : Renforcement des Fondations (Logic Horizon)
1. Étape 1 : Développement du moteur de projection temporelle (H1..H90).
2. Étape 2 : Liaison des horizons avec les objectifs PARA de haut niveau (LD01).
3. Étape 3 : Système de "Crew Manifest" (Assignation d'agents aux horizons).
4. Étape 4 : Hook `useIkigai` pour accès global sécurisé.

### Phase 5 : Nouvelles Features (Visual Components)
1. Étape 1 : Composant `IkigaiCompass` (SVG interactif des 4 cercles).
2. Étape 2 : Composant `HorizonSlider` (Navigation entre les 5 horizons).
3. Étape 3 : Section "Solarpunk Sage" (AI Interaction panel spécialisé).
4. Étape 4 : Intégration des cartes cliquables pour routage vers détails.

### Phase 6 : Nouvelles Features (Identity & Flow)
1. Étape 1 : Deep Linking `aspace://app/ikigai?view=horizon`.
2. Étape 2 : Animation d'éclosion du Scarabée sur le centre de la boussole.
3. Étape 3 : Thème "Aura" réagissant aux cercles Ikigai complétés.
4. Étape 4 : Intégration du Header Menu Strategie.

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Audit de cohérence : Un objectif H90 ne peut pas être déconnecté d'actions H1.
2. Étape 2 : Test de résilience de la DB lors du changement d'année.
3. Étape 3 : Vérification de la compatibilité Screen Reader pour le diagramme SVG.
4. Étape 4 : Veto Beth : Verrouillage de la "Mission" si incohérente.
