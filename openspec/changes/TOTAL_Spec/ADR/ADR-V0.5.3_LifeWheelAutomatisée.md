# ADR-V0.5.3 — Life Wheel Automatisée

## 1. Contexte & Problème
La fonction `calculateGlobalScore` de la Life Wheel V0.2.5 utilisait un `d.score` défini manuellement par l'utilisateur. C'est subjectif. Un A'Space OS n'a pas besoin de l'avis humain, il a les données. Le score d'un domaine doit être un reflet pur du ratio Projets Actifs vs Complétés et Actions GTD exécutées.

## 2. Décisions (Logique de Moteur)

### 2.1 Le Moteur de Télémétrie (`calculateExecutionScore`)
Le store `fw-wheel.store.ts` cesse d'exposer la méthode d'update manuelle du score global pour un hook/sélecteur qui recalcule le "vrai" score :

```typescript
// Algo simplifié de scoring de réalité par domaine (sur 100) :
// Poids des projets complétés (60%) + Ratio Actions GTD Done (40%)
// -> Limité à max 100% de la jauge.
```

### 2.2 UI : Le Double Calque CSS
Plutôt qu'une seule barre, le composant `WheelDomainCard` / `Radar` affichera un visuel hybride :
1.  **L'Aim (L'Ambition - Cible)** : Représentation visuelle de "Ce qu'on souhaite accomplir" (texte d'ambition).
2.  **L'Exécution (Reality)** : Représenté par la jauge de "Santé", évaluée dynamiquement. 

## 3. Conséquences & Protection CPU
*   La fonction de croisement qui compte pour tous les domaines les "Completed Projects" de PARA peut s'avérer lourde. Elle ne s'exécutera qu'au moment d'afficher l'onglet "Dashboard" de la Life Wheel, non pas en tâche de fond.
*   Interdiction d'utiliser des bibliothèques externes type `Chart.js`. 

## 4. Étapes DDD (A3)
*   **Étape A** : Substituer la logique statique de `fw-wheel.store` par `calculateExecutionScore`.
*   **Étape B** : Mettre à jour `Dashboard.tsx` dans `life-wheel` pour déclencher les calculs localement.
*   **Étape C** : Créer le composant visuel (CSS/SVG) représentant le dual-state (Ambition vs Execution).
