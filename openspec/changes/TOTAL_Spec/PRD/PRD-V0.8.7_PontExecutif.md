# PRD: V0.8.7 Le Pont Exécutif (Webhooks)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Basique. Appel API asynchrone standard (`fetch`).
*   **Valeur (V)** : Transforme A'Space OS qui passe de l'état de "carnet de bord" à l'état de "tour de contrôle exécutive".
*   **Réutilisabilité (R)** : Le pattern webhook est réutilisable pour de futurs agents d'IA.

## 2. User Stories (Phase C)

*   **US-128 [Url Exécutive]** : "Dans l'édition ou les paramètres d'une 'Muse', un champ de texte privé permet d'enseigner une URI de webhook (Ex: https://n8n.my-server.com/webhook/muse-trigger)."
*   **US-129 [The Big Red Button]** : "Sur la carte de la Muse (dans le Dashboard), si l'URL est spécifiée de manière valide, un bouton 'RUN PROTOCOL' ou 'EXECUTE' est disponible."
*   **US-130 [Feedback Silencieux]** : "Au clic sur ce bouton, une requête POST est émise sans rechargement de page. Le statut UI du bouton passe en `pending` (Loader), puis `success` (Toast) ou `error` selon le code HTTP retourné par l'API (ex: 200). En cas d'erreur consécutive, le système peut inviter à marquer la muse en 'failing'."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Exposer le webhook dans le DOM public | Sécurisation minimum. Mais le `localStorage`/`IndexedDB` local fait l'affaire étant donné que l'OS ne tourne que sur le terminal privé d'Amadeus. Aucune transmission à un cloud tiers de l'OS. |
| Bloquer l'UI locale pendant le POST | Gérer la requête de manière asynchrone via des promesses non bloquantes. L'OS ne doit pas *freeze* en attendant le retour d'un serveur lointain. |

## 4. Fichiers Impactés
*   `src/stores/fw-deal.store.ts` (Ajout field `webhookUrl` sur Muse)
*   `src/apps/deal/pages/Muses.tsx` (Intégration du bouton et fonction du fetch API).
