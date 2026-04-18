# ADR-FWK-012 — Structure d'Exécution V0.1.2 (PARA Business) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Implémentation du framework PARA (LD01). Besoin d'isolation stricte et de gestion CRUD robuste pour les Projets et les Areas.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.2)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Suppression des mockups PARA temporaires dans le Command Center.
2. Étape 2 : Alignement des types TypeScript `Project` et `Area` avec le schéma LD01.
3. Étape 3 : Nettoyage des vieux états Zustand dans `shell.store` liés à PARA.
4. Étape 4 : Vérification de la cohérence des UUIDs dans les tests unitaires PARA.

### Phase 3 : Renforcement des Fondations (Stockage LD01)
1. Étape 1 : Création du schéma IndexedDB pour `aspace-ld01` (Stores: `projects`, `areas`).
2. Étape 2 : Implémentation des index : `status`, `priority`, `type`.
3. Étape 3 : Création du middleware de validation de schéma avant écriture.
4. Étape 4 : Gestion des migrations automatiques (V1 vers V2 si nécessaire).

### Phase 4 : Renforcement des Fondations (Store PARA)
1. Étape 1 : Création de `para.store.ts` avec chargement asynchrone depuis IDB.
2. Étape 2 : Implémentation de la logique de synchronisation IDB ↔ Zustand.
3. Étape 3 : Ajout de la gestion d'erreurs lors des échecs d'écriture.
4. Étape 4 : Intégration du Garbage Collector pour les projets supprimés (Soft Delete).

### Phase 5 : Nouvelles Features (CRUD & Navigation)
1. Étape 1 : Implémentation du composant `ProjectEditor` (Formulaire riche).
2. Étape 2 : Implémentation du composant `AreaGrid` (Visualisation des domaines).
3. Étape 3 : Ajout du filtrage par contexte (Active/Waiting/Archives).
4. Étape 4 : Intégration des Breadcrumbs dynamiques `PARA > [Area] > [Project]`.

### Phase 6 : Nouvelles Features (Deep Linking & Style)
1. Étape 1 : Enregistrement des routes deep-linking `aspace://app/para`.
2. Étape 2 : Application du style "Forge/Gardens/Vault" aux colonnes PARA.
3. Étape 3 : Micro-animations de transition entre les vues liste et détail.
4. Étape 4 : Ajout des badges de prioritéArcho-Futuristes (Cuivre/Bronze).

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Test d'isolation LD01 : Vérifier qu'aucune lecture n'est possible depuis LD02.
2. Étape 2 : Benchmark : Performance d'affichage avec 500 projets simulés.
3. Étape 3 : Audit de sécurité : Validation des entrées textuelles des projets.
4. Étape 4 : Test de conformité Veto : Vérifier que Beth peut bloquer l'archivage.

## Impact sur l'Isolation
- Database: Isolé dans `aspace-ld01`.
- UI: Indépendance totale du composant PARA vis-à-vis du Shell.
