# ADR-FWK-011 — Structure d'Exécution V0.1.1 (Cœur / Command Center)🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Le Commandinaire (A0) a validé le PRD V0.1.1. Nous devons maintenant structurer l'exécution technique pour garantir la stabilité du Cœur de l'OS. Ce cycle suit le modèle d'idempotence en 7 phases.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.1)

### Phase 1 : Nettoyage & Dette Technique (Partie A)
**Objectif** : Assainir la base de code existante.
1. Étape 1 : Audit des imports dans `src/apps/` (Suppression des résidus de la V0.1).
2. Étape 2 : Harmonisation des noms de fichiers (PascalCase pour les composants).
3. Étape 3 : Suppression du fichier `src/store.ts` obsolète après migration ShellStore.
4. Étape 4 : Nettoyage des styles CSS ad-hoc dans les fichiers TSX (Migration vers `index.css`).

### Phase 2 : Nettoyage & Dette Technique (Partie B)
**Objectif** : Stabiliser le comportement visuel de base.
1. Étape 1 : Fix de la régression du z-index des Toasts (ils doivent être au-dessus du Dock).
2. Étape 2 : Optimisation du rendu du `GlassCard` (Standardisation des filtres `backdrop-blur`).
3. Étape 3 : Révision du système de log console (Suppression des logs bruyants en prod).
4. Étape 4 : Validation de la structure des dossiers `specs/` dans le répertoire de change.

### Phase 3 : Renforcement des Fondations (Shell)
**Objectif** : Sécuriser l'armature de l'OS.
1. Étape 1 : Implémentation des butées physiques du `WindowFrame` (Fix Titlebar Loss).
2. Étape 2 : Ajout de la protection anti-collision des ID de fenêtres dans `shell.store.ts`.
3. Étape 3 : Structuration du système de persistence `localStorage` avec versioning de schéma.
4. Étape 4 : Intégration du composant `ViewportGuard` wrapant l'application hôte.

### Phase 4 : Renforcement des Fondations (BDD & Registre)
**Objectif** : Préparer l'isolation et le routage.
1. Étape 1 : Initialisation de la base IndexedDB `aspace-ld00` (Core Meta).
2. Étape 2 : Implémentation du routeur `useDeepLink` dans le Shell.
3. Étape 3 : Validation de l'intégrité du `AppRegistry` lors du boot.
4. Étape 4 : Sécurisation du `Breadcrumbs` contre les routes inexistantes.

### Phase 5 : Nouvelles Features (Trinity Header)
**Objectif** : Déployer l'innovation de navigation.
1. Étape 1 : Création du composant `DashboardHeader` (Style OpenAI Plateform).
2. Étape 2 : Implémentation du switch d'état entre les 3 vues (Standard, Focus, Strategy).
3. Étape 3 : Création du squelette visuel de la vue "Strategy" (12WY Overview).
4. Étape 4 : Création du squelette visuel de la vue "Focus" (GTD Overview).

### Phase 6 : Nouvelles Features (Archaeo-Futurism Design)
**Objectif** : Injecter l'identité visuelle sacrée.
1. Étape 1 : Injection des variables CSS `--copper` et `--brass` dans le thème global.
2. Étape 2 : Refonte des bordures de `WindowFrame` avec texture métallique "Laiton".
3. Étape 3 : Implémentation de la micro-animation d'éclosion du Scarabée (Transition CSS).
4. Étape 4 : Style "Sablé" pour les fonds de verre (`glass-card-matte`).

### Phase 7 : Audit, Tests & Conformité
**Objectif** : Zéro Erreur / Anti-Écran Blanc.
1. Étape 1 : Déploiement des Error Boundaries globaux sur le Desktop.
2. Étape 2 : Test de résilience : Suppression manuelle de localStorage (Auto-heal check).
3. Étape 3 : Test de performance : FPS lors du drag massif de fenêtres.
4. Étape 5 : Audit d'isolation : Vérification qu'aucune donnée CC ne fuit hors de LD00.
5. Étape 6 : Validation finale de conformité TVR par Beth (Veto Review).

## Conséquences
### Positives
- Modularité totale et prévisibilité de l'exécution.
- Protection contre la perte de la barre de titre.
- Alignement esthétique avec la vision Archaeo-Futuriste.

### Négatives
- Complexité accrue de la phase de planification A2.

## Impact sur l'Isolation
| Ressource | Avant | Après |
|-----------|-------|-------|
| Database | Globale | `aspace-ld00` (Core) |
| Filesystem | Ad-hoc | `src/apps/command-center/` isolé |

## Vérification
Comment vérifier ? Lancer `npm run audit:v0.1.1` (Script à créer par A3).
