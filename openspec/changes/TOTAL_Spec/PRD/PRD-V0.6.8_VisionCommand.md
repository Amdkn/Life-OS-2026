# PRD: V0.6.8 Vision Central Command (Carte Stratégique)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Clone logique du composant `ProjectCommandCard` de façon simplifiée.
*   **Valeur (V)** : Pulvérise l'effet "todolist". Une Stratégie à 3 ans s'explore, elle ne se coche pas.
*   **Réutilisabilité (R)** : Standardisation du Pattern "Central Command" sur tous les hubs majeurs.

## 2. User Stories (Phase B)

*   **US-95 [Ouverture de Salle]** : "Quand je clique sur une de mes Visions dans l'onglet 'Visions' du dashboard 12WY, au lieu d'une ligne d'édition minuscule, une immense `<VisionCommandCard>` (Fullscreen overlay ou remplacement d'écran) s'ouvre."
*   **US-96 [Header Constitutionnel]** : "Tout en haut de cette carte, j'ai une section visuelle nommée *The Constitution Nexus* qui m'indique le composant Ikigai qui a engendré cette vision, et le Life Domain attaché. S'ils sont manquants, le dashboard affiche 'Unlinked Nexus' discrètement."
*   **US-97 [Child Goals]** : "Le Cœur de la carte est composé d'une belle grille listant les `WyGoals` trimestriels qui sont rattachés spécifiquement à cette Vision parente."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Afficher les Tactiques de semaine | Hérésie contextuelle. Une Vision à 3 ans ne regarde pas les tâches de la Semaine 2. Seuls les Goals Trimestriels s'affichent sous une Vision. |

## 4. Fichiers Impactés
*   `apps/twelve-week/components/VisionCommandCard.tsx` (NOUVEAU - Le hub stratégique)
*   `apps/twelve-week/pages/VisionTable.tsx` (Lien de clic déclencheur)
