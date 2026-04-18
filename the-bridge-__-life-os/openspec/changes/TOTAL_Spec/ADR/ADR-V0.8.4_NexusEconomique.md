# ADR-V0.8.4 — Le Nexus Économique Ascendant

## 1. Contexte & Problème
L'objectif de l'A'Space OS est que les choix pris dans une App influencent la vie globale. Les temps sauvés et l'argent généré par les Muses DEAL ne remontent nulle part.

## 2. Décisions (Le Flux Méta-Zustand)

### 2.1 Projection Financière -> Life Wheel
`useWheelStore` ne va pas écouter directement Zustand DEAL (pour éviter les dépendances circulaires ou le couplage dur de store).
La projection se fera **au niveau de l'interface** Life Wheel.
Dans le composant affichant les détails ou métriques du nœud "FINANCE", le composant React invoquera `useDealStore(s => s.muses)` et additionnera dynamiquement les `revenueEstimate` des Muses `achieved` pour afficher la métrique : *"Passive Income: $X/mo"*.

### 2.2 Projection Temporelle -> 12WY
De la même manière, dans `<TimeUseMatrix />` du 12WY, nous invoquerons `useDealStore(s => s.muses)` pour additionner `timeCost` et créer visuellement une ligne non-éditable *(Spacedock Tax)*. Cela réduit dynamiquement le temps libre hebdomadaire réel du commandant.

## 3. Conséquences & Isolation
*   Les différents Stores Zustand (`fw-deal`, `fw-wheel`, `fw-12wy`) NE SE CONNAISSENT PAS, assurant l'absence totale de dette technique et d'infinite loop lors des modifications d'état.
*   L'intégration se fait dans le dernier kilomètre (la React View) en superposant les Layers.

## 4. Étapes DDD (A3)
*   **Étape A** : Coder le calcul dynamique dans la Life Wheel App (Section Finance).
*   **Étape B** : Coder la soustraction de "Maintenance Tax" dans la grille de charge de `fw-12wy` (TimeUseMatrix).
