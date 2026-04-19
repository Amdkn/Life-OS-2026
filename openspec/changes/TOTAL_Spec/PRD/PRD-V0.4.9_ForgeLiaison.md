# PRD: V0.4.9 Le Workflow de Liaison (Link & Preview)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Modérée. Nécessite un sélecteur croisé pour éviter de cloner les données, et une extension du type `Project`.
*   **Valeur (V)** : Haute. Permet de créer un véritable intranet de la connaissance interconnecté.
*   **Réutilisabilité (R)** : Le composant Mini-Preview pourra être utilisé globalement dans le moteur de recherche OS.

## 2. User Stories (Phase C - Liaison & Affichage)

*   **US-62 [Search & Link]** : "En tant que Geordi, je veux un bouton `Link Existing` qui déploie une barre de recherche rapide."
*   **US-63 [Checkboxes]** : "En tant qu'Opérateur, la recherche affiche les ressources globales (non déjà liées). Je peux les cocher (checkboxes) et valider. L'ID de chaque ressource s'ajoute alors au tableau `linkedResources` de mon Projet."
*   **US-64 [Previews]** : "En tant que Commandant consultant ma carte de Projet, je veux voir l'ensemble des Ressources liées (nouvelles + existantes) affichées sous forme de mini-cartes épurées. Un clic sur une carte envoie vers le lien externe (ou ouvre la ressource)."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Cloner les ressources dans le projet | Le projet doit contenir uniquement `linkedResources: string[]`. |
| Recherche lointaine (HTTP) | Filtrer localement `useParaStore(s => s.resources)` avec `.filter()` via le texte entré. |

## 4. Fichiers Impactés
*   `stores/fw-para.store.ts` (Extension `Project` + relation type)
*   `apps/para/components/ProjectCommandCard.tsx` (Section Resources)
*   `apps/para/components/ResourceLinker.tsx` (NOUVEAU - Selecteur/Recherche)
*   `apps/para/components/ResourceMiniCard.tsx` (NOUVEAU - View)
