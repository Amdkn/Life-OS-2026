# PRD: V0.6.7 Les Formulaires de Genèse (Routage à la Création)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Les modales V0.6.4 existent, il suffit d'y brancher un `useWheelStore` et un nouveau `<select>`.
*   **Valeur (V)** : Majeure. Cela oblige l'intégration top-down : "Aucune réflexion stratégique 12WY ne peut exister hors d'un système de vie global".
*   **Réutilisabilité (R)** : Motif de cross-store data querying.

## 2. User Stories (Phase A)

*   **US-93 [Domaine de la Life Wheel]** : "En tant que Stratège, la modale `<VisionForgeModal>` exige que je choisisse, via un menu déroulant, sur quel domaine de ma Life Wheel (ou Area Spock) cette Vision va impacter le plus (ex: Business, Cognition, Health)."
*   **US-94 [Renforcement du form Goal]** : "Dans `<GoalForgeModal>`, la sélection de la `Vision` parente n'est pas qu'un champ texte inerte. Une fois la `Vision` choisie, la modale affiche en grisé les attributs de la vision mère (ex: 'Rattaché au domaine Business' et 'Horizon H30') pour conforter ma décision."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Enregistrer le nom textuel du domaine ("Business") | On n'enregistre que l'ID unique (UUID ou string clé) du composant WheelNode pointé (`domainId`). |
| Rendre le select optionnel | L'attachement au domaine est OBLIGATOIRE (Required) sur la modale Vison. |

## 4. Fichiers Impactés
*   `stores/fw-12wy.store.ts` (Ajout formel de `domainId` dans l'interface `WyVision`)
*   `apps/twelve-week/components/VisionForgeModal.tsx` (Refonte avec pont vers fw-wheel.store)
*   `apps/twelve-week/components/GoalForgeModal.tsx` (Amélioration UI)
