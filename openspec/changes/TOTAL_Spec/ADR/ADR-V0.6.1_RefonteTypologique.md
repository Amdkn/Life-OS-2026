# ADR-V0.6.1 — Destruction du Mirage (Refonte Typologique & DB)

## 1. Contexte & Problème
Le store `fw-12wy.store.ts` utilisait un type `Goal` informe qui mélangeait les visions à 3 ans, les objectifs trimestriels et les actions de la semaine (tactiques). De plus, les données étaient en localStorage (non-souverain). 

## 2. Décisions (Type Contract)

Nous supprimons le type `Goal` et instaurons la Trinité Temporelle, héritant de `ParaItem`.

**Nouveaux Contrats :**
```typescript
import type { ParaItem } from './fw-para.store';

// 1. La Vision à 3 Ans (souvent liée à Ikigai H3)
export interface WyVision extends ParaItem {
  type: 'wy-vision';
  ikigaiVisionId?: string; // Connexion Optionnelle à l'Ikigai V0.5
}

// 2. L'Objectif du Trimestre (12 Semaines)
export interface WyGoal extends ParaItem {
  type: 'wy-goal';
  visionId: string; // Pointe vers la WyVision parente
  targetWeek: number; // 1-12 (La deadline du trimestre)
}

// 3. La Tactique d'Exécution Hebdomadaire
export interface WyTactic extends ParaItem {
  type: 'wy-tactic';
  goalId: string; // Pointe vers le WyGoal parent
  week: number; // La semaine d'exécution (1 à 12)
  status: 'pending' | 'completed' | 'failed'; // Binaire, pas de "in-progress" pour Moran
}
```

## 3. Conséquences & Isolation
*   Le store `fw-12wy.store.ts` perd son middleware `persist`.
*   Un hook d'hydratation (ou la méthode native Zustand `readFromLD`) sera mis en place pour charger la DB `system/12wy` (ou `ld01/12wy` selon conventions).
*   L'UI nécessitera de passer l'ID de la Vision pour créer un Goal, et l'ID du Goal pour créer une Tactic. On instaure la contrainte d'alignement absolu.

## 4. Étapes DDD (A3)
*   **Étape A** : Substituer le `persist` Zustand et le `SEED_GOALS` par les appels `ld-router.ts`.
*   **Étape B** : Mettre en place les nouveaux types TypeScript structurés.
*   **Étape C** : Refactorer l'UI (`VisionTable`, `GoalTable`, `TacticsBoard`) pour gérer la création hiérarchique : On ne crée une tactique qu'en sélectionnant un Goal.
