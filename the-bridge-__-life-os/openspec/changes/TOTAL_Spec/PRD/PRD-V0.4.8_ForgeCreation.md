# PRD: V0.4.8 Le Workflow de la Forge (Création Injectée)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. L'infrastructure `ItemModal` existe déjà.
*   **Valeur (V)** : Énorme gain de temps (Friction Zéro). Plus besoin de spécifier à qui appartient une nouvelle ressource.
*   **Réutilisabilité (R)** : Le pattern "Context-Aware Modal" standardisera toutes les créations d'entités depuis d'autres vues.

## 2. User Stories (Phase B - Création Silencieuse)

*   **US-59 [Command Card Hook]** : "En tant que Commandant, je veux trouver un bouton `+ Create Resource` clairement visible dans la section 'Geordi/Resources' de ma carte de Projet."
*   **US-60 [Modale Épurée]** : "En tant qu'Opérateur, je veux qu'un clic sur ce bouton ouvre un mini-formulaire où je ne saisis que le Nom et l'URL/Contenu de la ressource. Les champs de type (Area/Project selection) doivent être absents ou verrouillés."
*   **US-61 [Auto-Injection Silencieuse]** : "En tant que Système (LD-Router), je veux capturer le `projectId` courant et son `domain` au moment du clic sur 'Valider', et forcer ces valeurs dans le payload de création vers `addResource`."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Forcer l'utilisateur à scroller un \<select> | Masquage pur et simple des meta-data de liaison si passés en props |
| Ajouter un nouveau Store | Réutiliser `addResource` du `fw-para.store.ts` avec le paramètre `projectId`. |

## 4. Fichiers Impactés
*   `apps/para/components/ProjectCommandCard.tsx` (Bouton et état modal)
*   `stores/fw-para.store.ts` (Extension `Resource` pour accepter `projectId`)
