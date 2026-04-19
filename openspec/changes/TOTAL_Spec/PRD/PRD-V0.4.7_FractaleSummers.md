# PRD: V0.4.7 La Fractale de Summers (UI/UX Intra-Projet)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. L'architecture UI de la Modal/Card est déjà modulaire. Compléter le type `Project` dans TS est trivial.
*   **Valeur (V)** : Majeure. Transpose la puissance du Business Pulse directement dans le périmètre d'exécution d'un projet complexe.
*   **Réutilisabilité (R)** : Ce pattern "Elastic Slots" pourra être cloné plus tard pour d'autres frameworks (les 12 semaines du 12WY intra-projet par ex).

## 2. User Stories (Phase A - Fractale UI/UX)

*   **US-55 [Isolation de Rendu]** : "En tant que Commandant, je veux que la matrice des 8 piliers Business ne s'affiche dans la Carte de Projet QUE si le projet en question appartient au domaine 'business', pour ne pas polluer les projets personnels."
*   **US-56 [Grille de Piliers]** : "En tant que Product Owner, je veux voir une grille de 8 'slots' (boutons) représentant les 8 piliers (Growth, Ops, Product...) dans l'interface de mon projet Business."
*   **US-57 [Élasticité Visuelle]** : "En tant qu'UX Designer, je veux que les slots inactifs soient visuellement discrets (grisés), et qu'un clic sur un slot l'active (couleur d'accent), déployant un éditeur de texte en dessous pour ce pilier."
*   **US-58 [Persistance Découplée]** : "En tant qu'Architecte Data, je veux que le contenu textuel saisi dans un pilier soit sauvegardé dans un champ `pillarsContent` (dictionnaire) du type `Project` au moment de la frappe ou lors du clic de validation (blur/save)."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Afficher la fractale partout | Condition stricte `if (project.domain === 'business')` |
| Boucle de composants lourde | Utiliser un composant stateless enfant `ProjectFractal` pour l'UI, géré par le ProjectCommandCard. |
| Sauvegarder l'état "Onglet Ouvert" | L'onglet actif (quel pilier est déployé) est géré localement (`useState`). |

## 4. Fichiers Impactés
*   `stores/fw-para.store.ts` (Ajout type `pillarsContent`)
*   `apps/para/components/ProjectCommandCard.tsx` (Appel composant enfant)
*   `apps/para/components/ProjectFractal.tsx` (NOUVEAU - UI)
