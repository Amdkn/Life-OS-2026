# PRD: V0.8.6 Le Moteur de Rentabilité (Janeway's Calculus)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Moyenne. Modification des types et du design UI des cartes Muses. Implique des mathématiques simples.
*   **Valeur (V)** : Inestimable. Sans la notion de Break-Even (Temps investi vs Temps Sauvé), l'automatisation n'est qu'un hobby de développeur.
*   **Réutilisabilité (R)** : Les statuts dynamiques viendront impacter les exports vers les autres apps.

## 2. User Stories (Phase B)

*   **US-125 [Saisie du Coût d'Implémentation]** : "Lorsque je convertis une friction en Muse (`promoteToMuse`), ou lorsque j'édite une Muse existante, je peux saisir son `buildCost` en heures (ex: J'ai mis 5h à coder ce script)."
*   **US-126 [Calcul du Break-Even Visualisé]** : "Sur la carte visuelle d'une Muse, si elle ne génère pas d'argent mais *sauve du temps*, un calcul indique le ROI. Ex: *Build Cost: 5h. Saves: 1h/week. Break-Even in 5 weeks.*"
*   **US-127 [Le Code Couleur MCO]** : "Une Muse possède un statut `operational` (Bleu/Vert) ou `failing` (Rouge). Si je la marque `failing`, elle affiche une alerte 'MAINTENANCE REQUIRED' en gros sur son UI."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Inclure les Muses Failing dans les Revenus | Une API est cassée ? L'argent n'entre plus. Les projections vers *Life Wheel (Finance)* DOIVENT forcer un filtrage : *`revenue = m.status === 'operational' ? m.revenueEstimate : 0`*. |

## 4. Fichiers Impactés
*   `src/stores/fw-deal.store.ts` (Type `Muse`)
*   `src/apps/deal/pages/Muses.tsx` (Cards UI et modal d'édition)
*   `src/apps/ikigai/pages/LifeWheel.tsx` & `TimeUseMatrix.tsx` (Mise à jour pour respecter le statut d'opérationnalité).
