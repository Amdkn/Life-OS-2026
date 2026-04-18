# SDD — Spec-Driven Development (The Gravity Bridge)

## Méta-Données
* **Version** : V0.7 (V0.7.1 à V0.7.4)
* **Nom de Code** : "The Cerritos Tactical Deck" (GTD Profond)
* **Auteur** : A'"0 (GravityClaw)
* **Architecte Ciblé** : A"1 (Rick) / A"2 (Doctors)
* **Exécutant Ciblé** : A3 (Gemini CLI / IronClaw)
* **Statut** : Approuvé

---

## 1. L'Intention Stratégique (Le Pourquoi)
Si PARA donne la structure, l'Ikigai le sens, et 12WY le cap et la temporalité, le flux vital quotidien se fait via **GTD**. Actuellement, le module GTD (USS Cerritos) est un prototype isolé. Il faut l'ancrer dans le stockage asynchrone (IndexedDB) et l'ouvrir au monde via une Capture Omniprésente et des liaisons de bout de chaîne vers les projets PARA et les tactiques 12WY.

---

## 2. Décisions Architecturales Majeures (ADR-Core)

### 2.1 Destitution de `persist`
* Par principe d'idempotence et de robustesse de l'OS, le store zustand de GTD (`fw-gtd.store.ts`) sera purgé du middleware `persist` (qui utilise LocalStorage et ses 5Mo de limite) pour adopter l'architecture de synchronisation base64 via le `ld-router.ts`, permettant ainsi l'échange massif sans perte (Base `ld05/actions` par exemple).

### 2.2 Extraction du Workflow
* La Capture ne doit pas s'effectuer uniquement dans le composant `GTD Dashboard`. Un système de productivité exige du *Capture Context-Free*. Un Omni-Shortcut déclenchera `<OmniCaptureModal />` n'importe où.

### 2.3 Câblage de Fermeture Domaniale (The Final Nexus)
* GTD est l'exécuteur. À ce titre, une tâche peut être :
    * Indépendante (Maintenance, Tâche ménagère).
    * Fille d'un Projet PARA (`projectId`).
    * Fille d'un Objectif 12WY (`goalId`).
    * Fille d'une Tactique 12WY (`tacticId`).
* L'ajout de ces 3 clés au type `GTDItem` rendra vivants les panneaux "Ghost" conçus en V0.6 (Goal Command Card).

### 2.4 Engage View Strict
* Captain Freeman ne regarde pas l'Inbox. La création d'une vue "Engage" séparée du Clarify implémente la loi GTD : Le passage à l'action (`context` et `energy`) ne doit pas être perturbé par le tri de l'Inbox.

---

## 3. Plan de Décomposition (Pipeline S-P-A-D)

### Itération V0.7.1 — La Loi de la Persistance
**Cible :** `stores/fw-gtd.store.ts`
* Re-factor du store pour brancher le Ld-Router. Purge des `SEED_ITEMS` de démo. Création des fonctions `loadFromLd` et `syncToLd`.

### Itération V0.7.2 — Le Triple Câblage
**Cible :** `stores/fw-gtd.store.ts`
* Ajout de `projectId`, `goalId`, et `tacticId` sur `GTDItem`.

### Itération V0.7.3 — OmniCapture Modal
**Cible :** `Capture`
* Composant UI global `<OmniCaptureModal>` lié à un raccourci clavier ou un bouton nav, expédiant l'input directement dans l'état `inbox` du `fw-gtd.store.ts`.

### Itération V0.7.4 — Machine à États & Engage
**Cible :** Vues GTD
* Refonte du Dashboard monolithique pour utiliser les onglets existants (Clarify, Organize, Engage). La page Engage utilisera un sélecteur mémoïsé filtrant `status === 'actionable'`.
