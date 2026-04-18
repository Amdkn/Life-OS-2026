# PRD: V0.8.4 Le Nexus Économique Ascendant (Holo Janeway's ROI)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Complexe. Requiert des calculs financiers injectés de manière asynchrone sur d'autres apps.
*   **Valeur (V)** : Inestimable. C'est l'essence du système. La création d'une Muse justifie enfin sa présence si elle remplit mon Ikigai.
*   **Réutilisabilité (R)** : Cross-store calculation.

## 2. User Stories (Phase D)

*   **US-121 [Score de Finance Life Wheel]** : "La Life Wheel doit refléter ma véritable économie. Une fonctionnalité (soit au montage de la Wheel, soit dans la couche composant) doit additionner le champ `revenueEstimate` de TOUTES les Muses au statut `achieved`, et afficher ce total mensuel dans le tableau de bord de ma 'Life Wheel' (sous le nœud FINANCE si possible, format '$XX/mo')."
*   **US-122 [Taxe Temporelle 12WY]** : "Toutes les Muses, même autonomes, demandent une surveillance (`timeCost`). Dans le module 12WY, le composant `TimeUseMatrix` intègre une ligne supplémentaire ou un badge indiquant '[X] hrs/week Maintenance Taxe' issue du cumul temporel des Muses DEAL actives."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Calculer récursivement dans les sélecteurs | Tout doit être géré avec précaution via `useMemo` ou via un Helper calculé en amont, sous peine de crash React ! |
| Casser la Wheel si on supprime une Muse | La somme doit être réactive. Si je passe une Muse en "Trash", mon revenu mensuel visuel chute au prochain rendu. |

## 4. Fichiers Impactés
*   `src/apps/deal/pages/Muses.tsx` (ou dashboard contenant les compteurs)
*   `src/apps/ikigai/pages/LifeWheel.tsx` (ou Dashboard) - Intégration du pont financier.
*   `src/apps/twelve-week/components/TimeUseMatrix.tsx` - Intégration de la taxe temporelle.
