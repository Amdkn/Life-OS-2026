# PRD: V0.8.5 Le Radar à Frictions (Pont GTD)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Mêmes mécanismes que pour le pont PARA -> DEAL (Itération V0.8.2).
*   **Valeur (V)** : Majeure. C'est l'essence de l'amélioration continue (Kaizen). Repérer la friction _pendant_ ou _juste après_ l'exécution de la To-Do list.
*   **Réutilisabilité (R)** : Crosstalk inter-applications standardisé.

## 2. User Stories (Phase A)

*   **US-123 [Transfert GTD -> DEAL]** : "Dans la vue Engage de l'application GTD, un bouton secondaire sur la carte d'une tâche (ex: un symbole 'Wrench' ou 'Factory') permet de signaler cette tâche comme une 'Friction Répétitive'."
*   **US-124 [Clone et Délégation Silencieuse]** : "Au clic sur ce bouton, le contenu de la tâche est envoyé à l'Inbox 'Define' de DEAL (store `fw-deal`). La tâche originale GTD est simultanément traitée (`completed` ou transférée au statut "incubating/delegated" selon le design choisi)."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Exiger un titre complexe | Le clic doit être "1-click". Le texte brut de la tâche GTD suffit à générer le `DealItem`. Le raffinement se fera plus tard, dans l'application DEAL. |
| Laisser la tâche dans GTD Actionable | Une tâche désignée comme "Friction à automatiser" est techniquement déléguée au Spacedock. Elle doit disparaître de la vue prioritaire 'Engage'. |

## 4. Fichiers Impactés
*   `src/apps/gtd/pages/EngageView.tsx` (Ajout du bouton)
*   `src/stores/fw-deal.store.ts` (Ajout formel de l'action `absorbGtdTaskAsFriction`)
