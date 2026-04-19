# PRD: V0.6.4 La Forge de Vision (Pike's Console)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Exige un couplage en LECTURE simple depuis le store Ikigai.
*   **Valeur (V)** : Majeure. Transforme "La Vision Globale" en un maillon traçable depuis l'Ikigai (Le Pourquoi).
*   **Réutilisabilité (R)** : Composant Modale standard ré-utilisant la patte graphique Glassmorphism établie dans V0.5 (`VisionModal`).

## 2. User Stories (Phase A - Pike's Console)

*   **US-83 [Remplacement Prompt]** : "En tant que Commandant, lorsque je clique sur `+ New Vision` dans l'application 12WY, aucune popup native Chrome ne s'ouvre. À la place, un overlay translucide magnifique s'affiche au centre de l'écran."
*   **US-84 [Le Moteur de Titre]** : "La Forge Vison me demande de saisir le titre textuel."
*   **US-85 [Nexus Ikigai]** : "La Forge me présente un menu déroulant ou une liste élégante qui tire toutes les visions définies dans l'Ikigai (`ikigaiVisionId`). Je peux optionnellement lier ma vision temporelle 12WY à l'une de mes visions constitutionnelles."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| `window.prompt` de 1995 | Destruction formelle de l'appel natif dans `TwelveWeekApp.tsx`. |
| Liste Déroulante Native Laide | Le `select` Ikigai doit s'insérer proprement dans le thème sombre (ou custom UI). |

## 4. Fichiers Impactés
*   `apps/twelve-week/TwelveWeekApp.tsx` (Suppression des prompts et gestion des states d'ouverture des modales).
*   `apps/twelve-week/components/VisionForgeModal.tsx` (NOUVEAU - UI Component).
