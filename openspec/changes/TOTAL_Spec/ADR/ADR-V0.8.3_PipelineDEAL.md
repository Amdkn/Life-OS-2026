# ADR-V0.8.3 — Le Pipeline D-E-A-L (Machine à États)

## 1. Contexte & Problème
Actuellement dans DEAL, la seule option est de créer un texte (Define) et de le promouvoir miraculeusement en Muse (Liberate). Les étapes `eliminate` et `automate` sont des strings morts. 

## 2. Décisions (Flow DYNAMIQUE)

### 2.1 Update Method standard
Création de `updateDealItem(id, patch)` comme sur GTD. L'UI (Drag&Drop implicite ou boutons "Move Right") appliquera simplement `{ step: 'automate' }`.

### 2.2 Scission de Rendu (UI)
Les Vues correspondantes (`Define`, `Eliminate`, `Automate`) ne devront faire qu'un filtre local sur l'array `items`. Par exemple, la vue `Eliminate` affichera un `.filter(i => i.step === 'eliminate')`.

### 2.3 Promotion vers Muse (Le Sacrifice)
L'ancien comportement qui consite à supprimer un `DealItem` lorsqu'il devient une Muse doit être revu.
Désormais, `promoteToMuse` fera deux choses :
1. Patcher le `DealItem` original : `{ status: 'completed' }` (Archive morte).
2. Créer une nouvelle `Muse` et la set/sauvegarder.
Cela permet de garder l'historique de la réflexion.

## 3. Conséquences & Isolation
*   Pipeline robuste, similaire au fonctionnement fluide d'un tableau Kanban.
*   Les performances UI sont assurées par des sélecteurs stricts par vue (Mémoïsation nécessaire).

## 4. Étapes DDD (A3)
*   **Étape A** : Coder `updateDealItem` dans le store.
*   **Étape B** : Implémenter le comportement "Archivage de trace" dans `promoteToMuse`.
*   **Étape C** : Rajouter quelques boutons d'avancement d'états dans les listes des Vues DEAL.
