# ADR-V0.4.7 — La Fractale de Summers

## 1. Contexte & Problème
Un Projet appartenant au domaine `business` doit pouvoir détailler son état d'avancement selon les 8 piliers (Growth, Ops, Product, etc.) sans créer de sous-entités lourdes. Il est nécessaire de persister ce contenu localement au sein du projet, tout en gardant une UI élastique.

## 2. Décision (Type Contract)
Nous étendons le type structurant `Project` dans `fw-para.store.ts` avec la propriété `pillarsContent`.

**AVANT :**
```typescript
export interface Project extends ParaItem {
  domain: LifeWheelDomain;
  pillars: BusinessPillar[];
  progress: number;
}
```

**APRÈS :**
```typescript
export interface Project extends ParaItem {
  domain: LifeWheelDomain;
  pillars: BusinessPillar[];
  progress: number;
  pillarsContent?: Partial<Record<BusinessPillar, string>>; // V0.4.7 — The Summers Fractal
}
```

## 3. Conséquences & Isolation
*   Seuls les projets ayant `domain === 'business'` rendront le composant `ProjectFractal`.
*   Le composant `ProjectFractal` gérera un `activePillar` (state local) pour l'effet "Onglet".
*   La sauvegarde dans IndexedDB utilisera `writeToLD` avec debounce, et seulement lors de la mise à jour d'un texte.

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `pillarsContent` au contrat `Project`.
*   **Étape B** : Créer `ProjectFractal.tsx` (Grid de 8 slots, state local, textArea).
*   **Étape C** : Intégrer `<ProjectFractal />` conditionnellement dans `ProjectCommandCard.tsx`.
