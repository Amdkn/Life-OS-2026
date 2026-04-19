# ADR-V0.4.8 — Le Workflow de la Forge

## 1. Contexte & Problème
La création d'une nouvelle "Resource" depuis la carte d'un projet demande théoriquement à l'utilisateur de spécifier à la main le domaine de cette ressource et de la lier. C'est une friction inacceptable (Anti-Pattern BMad).

## 2. Décision (Type Contract)
La `Resource` générique doit pouvoir porter l'empreinte de son projet parent de la même manière que `GTDItem` et `Goal` en Phase 2.

**AVANT :**
```typescript
export interface Resource extends ParaItem {
  url: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'other';
}
```

**APRÈS :**
```typescript
export interface Resource extends ParaItem {
  url: string;
  type: 'article' | 'video' | 'book' | 'tool' | 'other';
  projectId?: string; // V0.4.8 — The Forge Context
}
```

## 3. Conséquences & Mécanique (Auto-Injection)
*   La fonction `addResource` du fichier `paraAdapter.ts` n'a pas besoin d'être modifiée si elle accepte déjà un type `Resource` complet.
*   Le bouton "Create" dans `ProjectCommandCard` passera les métadonnées implicites au composant Modal ou effectuera directement l'action.
*   **Contrainte UI** : Les sélecteurs de `domain` et `pillars` dans le formulaire de base seront masqués si le composant est invoqué en mode "Forge" (depuis un projet).

## 4. Étapes DDD (A3)
*   **Étape A** : Mettre à jour l'interface `Resource` dans `fw-para.store.ts`.
*   **Étape B** : Ajouter un mode simplifié à `ItemModal.tsx` (ou créer `ForgeModal.tsx`).
*   **Étape C** : Câbler le bouton "Create Resource" dans la section Geordi de la carte Piccard.
