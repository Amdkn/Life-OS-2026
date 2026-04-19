# ADR-V0.4.9 — Le Workflow de Liaison (Link & Preview)

## 1. Contexte & Problème
Un projet (Piccard) doit pouvoir s'appuyer sur des ressources (Geordi) déjà existantes dans la base PARA (par exemple un outil universel, ou un tutoriel). Il faut les lier san cloner les datas.

## 2. Décision (Type Contract)
Nous étendons le type `Project` avec un tableau de références vers les ID des ressources.

**AVANT :**
```typescript
export interface Project extends ParaItem {
  // ... propriétés existantes + pillarsContent
}
```

**APRÈS :**
```typescript
export interface Project extends ParaItem {
  // ...
  linkedResources?: string[]; // Array of Resource IDs (V0.4.9)
}
```

## 3. Conséquences & Performance
*   **Lecture via Selector** : Au sein du `ProjectCommandCard`, l'affichage de ces ressources ne se fait PAS par clé étrangère SQL-like complexe, mais via un `filter` en mémoire dans Zustand :
    `const attachedRes = resources.filter(r => r.projectId === project.id || project.linkedResources?.includes(r.id));`
*   **La Barre de Recherche** : S'exécute sur le state local Zustand des `resources` via un `.filter` texte, garantissant une UI instantanée (zéro latence réseau).

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `linkedResources` au contrat `Project`.
*   **Étape B** : Créer `ResourceLinker.tsx` (Barre de recherche rapide avec checkboxes).
*   **Étape C** : Créer `ResourceMiniCard.tsx` pour l'affichage épuré des prévisualisations.
*   **Étape D** : Assembler le tout dans la section "Resources" du `ProjectCommandCard`.
