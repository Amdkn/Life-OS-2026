# ADR-FWK-019 — Structure d'Exécution V0.1.9 (Settings & Store) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Finalisation de l'écosystème : Launchpad, Préférences Système et Registre d'Applications.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.9)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Audit final du bundle (Suppression des libs inutilisées).
2. Étape 2 : Unification des modales de paramètres.
3. Étape 3 : Correction des fuites de mémoire lors des builds production.
4. Étape 4 : Nettoyage des assets statiques volumineux.

### Phase 3 : Renforcement des Fondations (App Registry V2)
1. Étape 1 : Finalisation du `app-registry.ts` avec support des icônes Archo-Futuristes.
2. Étape 2 : Persistence du layout utilisateur (Positions fenêtres & Dock).
3. Étape 3 : Système de lazy-loading prédictif (Load on hover).
4. Étape 4 : Sécurisation du mode "Guest" vs "Owner".

### Phase 4 : Renforcement des Fondations (Config Logic)
1. Étape 1 : Store `settings.store.ts` (Thèmes, API Keys, Privacy levels).
2. Étape 2 : Hook `useTheme` (Injection dynamique de variables CSS).
3. Étape 3 : Validation des configurations critiques avant reboot.
4. Étape 4 : Chiffrement du localStorage sensible.

### Phase 5 : Nouvelles Features (Launchpad Grid)
1. Étape 1 : Interface Launchpad (Grille icônes custom).
2. Étape 2 : Système de Catégories (Apps, Tools, Agents).
3. Étape 3 : Animation de zoom "Archo-Futuriste" à l'ouverture.
4. Étape 4 : Barre de recherche Launchpad globale.

### Phase 6 : Nouvelles Features (Preference Panel)
1. Étape 1 : Dashboard de configuration de l'OS.
2. Étape 2 : Sélecteur de thèmes (Copper, Bronze, Solar, Void).
3. Étape 3 : Deep Linking `aspace://view/settings`.
4. Étape 4 : Intégration des badges de versioning V0.1.9 (Final Release).

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Audit de performance : Launchpad opening < 200ms.
2. Étape 2 : Test de résilience multithème (No layout break).
3. Étape 3 : Validation complète du parcours utilisateur (Onboarding à Settings).
4. Étape 4 : Veto Beth : Verrouillage total de l'OS via le panneau de sécurité.
5. Étape 5 : PRÉPARATION V0.2 : Gel du code et archivage final du change V0.1.x.
