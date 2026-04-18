# ADR-V0.8.2 — Le Sas de Décompression (Absorption PARA)

## 1. Contexte & Problème
L'utilité d'archiver un Projet dans PARA n'est que documentaire si ce projet n'est pas "détissé" (Reverse Engineered) pour identifier ses frictions et créer des automatisations futures.

## 2. Décisions (Crosstalk Action)

### 2.1 Injection Unidirectionnelle
Plutôt que PARA n'écrive brutalement dans le `ld-router` de DEAL (ce qui brise les frontières formelles), PARA fera appel à un hook public du store DEAL.

```typescript
// fw-deal.store.ts
absorbProjectAsFriction: async (projectId: string, projectTitle: string) => {
   const newFriction: DealItem = {
      //...
      title: `[ARCHIVE] Deconstruct ${projectTitle}`,
      projectId: projectId, // Le pont est soudé
      step: 'define',
      //...
   };
   // zustand set + ldRouter save
}
```

### 2.2 Déclencheur PARA
Dans le composant `<ArchiveProjectButton>` ou similaire de PARA, après avoir switché le status du projet sur `archived`, le composant demandera au store DEAL d'absorber l'archive via `useDealStore.getState().absorbProjectAsFriction(id, title)`.

## 3. Conséquences & Isolation
*   Maintient l'indépendance de PARA. PARA n'a pas besoin de connaître la logique interne du pipeline DEAL.
*   Assure la traçabilité.

## 4. Étapes DDD (A3)
*   **Étape A** : Créer l'action `absorbProjectAsFriction`.
*   **Étape B** : Ajouter un bouton "Transfer to Spacedock" dans l'UI des Archives PARA pointant sur cette méthode.
