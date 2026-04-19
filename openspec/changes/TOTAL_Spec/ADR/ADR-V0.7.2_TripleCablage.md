# ADR-V0.7.2 — Le Triple Câblage (Nexus Final)

## 1. Contexte & Problème
Une tâche GTD (Action) appartient souvent à un ensemble plus vaste. Sans clé étrangère, le composant `GoalCommandCard` (conçu en V0.6.9) ne peut repêcher automatiquement ses actions "enfants".

## 2. Décisions (Clés de Résolution)

### 2.1 Contrat Typologique
Extension de `GTDItem` :
```typescript
export interface GTDItem {
  // ... propriétés de base (id, content, status...)
  projectId?: string; // Lien avec PARA (Summers)
  goalId?: string;    // Lien avec 12WY (Sprint)
  tacticId?: string;  // Lien avec 12WY (Semaine)
}
```

### 2.2 Implémentation du Câblage
Dans la vue `Organize`, lorsqu'une tâche est sélectionnée pour enrichissement, trois composants `<select>` (ou une UI similaire) liront `fw-para.store` et `fw-12wy.store` pour proposer ces attachements.
L'ID est sauvegardé dans IndexedDB. C'est l'UI (le store `fw-12wy`) qui fera la requête inverse : `const myActions = gtdItems.filter(i => i.goalId === thisGoal.id)`.

## 3. Conséquences & Isolation
*   Couplage lâche (Soft Links). Si un projet PARA est supprimé, la tâche GTD garde un `projectId` orphelin (qu'on peut nettoyer via un garbage collector ou laisser tel quel). Aucune erreur fatale `null pointer`.
*   GTD devient le bout de la chaîne alimentaire des data du vaisseau. 

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter les clés au modèle `fw-gtd.store.ts`.
*   **Étape B** : Ajouter des selecteurs UI dans "Clarify" ou "Organize" pour renseigner ces identifiants.
