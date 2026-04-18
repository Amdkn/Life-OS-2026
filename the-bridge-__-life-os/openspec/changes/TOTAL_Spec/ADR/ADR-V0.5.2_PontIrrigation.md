# ADR-V0.5.2 — Le Pont d'Irrigation (Ikigai ↔ PARA)

## 1. Contexte & Problème
Une "Vision" Ikigai ou une "Ambition" Wheel définie dans la V0.5.1 est inerte sans un moyen organique de voir comment elle s'incarne dans la réalité. Le projet exécutif dans PARA (Picard) doit pointer vers la Constitution (Ikigai/Wheel). 

## 2. Décisions (Type Contract)

### 2.1 Extension du Contrat Project (PARA)
La responsabilité du lien incombe à l'entité la plus "tardive" du flux (Le Projet pointe vers la Vision, pas l'inverse).

**APRÈS :**
```typescript
export interface Project extends ParaItem {
  // ...
  ikigaiVisionId?: string; // V0.5.2 — Le Pont Bottom-Up
  wheelAmbitionId?: string; // V0.5.2 — Optionnel, si applicable
}
```

### 2.2 Lecture Inverse (Sélecteurs Zustand)
Dans l'UI de l'Ikigai (lorsqu'on sélectionne une Vision détaillée), le composant extrait sa liste de preuves d'exécution en temps réel :
```typescript
const activeProjects = useParaStore(s => 
  s.projects.filter(p => p.ikigaiVisionId === currentVision.id && p.status === 'active')
);
```
*(NOTE GRAVITY: Le `.filter` doit toujours se faire APRÈS l'extraction complète de la liste pour ne pas provoquer d'infinite updates, comme validé en V0.4.5).*

## 3. Conséquences & Performance
*   Zéro contrainte de base de données : Le croisement se fait localement via array filtering en mémoire dans React, garantissant une UI sous les 16ms.
*   Dans l'interface de PARA, un selecteur natif `IkigaiAligner.tsx` permettra d'attacher un `ikigaiVisionId` à un projet en cours d'édition (similairement au `ResourceLinker`).

## 4. Étapes DDD (A3)
*   **Étape A** : Mettre à jour `fw-para.store.ts` pour inclure `ikigaiVisionId` et `wheelAmbitionId`.
*   **Étape B** : Créer un `VisionAligner.tsx` dans PARA (ProjectCommandCard) pour attacher une Vision existante.
*   **Étape C** : Dans `IkigaiDetailPanel.tsx`, afficher l'accordéon "Execution Proofs" (projets PARA liés).
