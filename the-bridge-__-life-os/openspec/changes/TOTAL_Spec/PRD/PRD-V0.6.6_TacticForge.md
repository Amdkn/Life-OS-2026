# PRD: V0.6.6 La Forge Tactique (M'Benga's Console)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Facile à coder, puissant à utiliser.
*   **Valeur (V)** : C'est le composant qui génère le sang (Les Tactiques). Il doit être rapide, lisible, tactique.
*   **Réutilisabilité (R)** : Préparation du terrain pour la V0.7 (GTD).

## 2. User Stories (Phase C - M'Benga's Console)

*   **US-90 [Console Tactics]** : "En tant d'Exécutant, je clique sur `+ Tactic` sous le panneau d'un Objectif. La 'Tactic Forge Modal' s'ouvre, pré-configurée pour le Goal en question."
*   **US-91 [Contrôle de Semaine]** : "Le formulaire me demande le Titre de la tactique, et surtout à GAUCHE, je dispose de 12 petits carrés numérotés W1..12 pour indiquer le timing (`week`). Si la modale est lancée depuis la vue d'une semaine spécifique, la case est pré-cochée."
*   **US-92 [Préparation V0.7 : Next Actions Generator]** : "En bas du formulaire, se trouve un Toggle Design : *[✓] Send to GTD Inbox as Next Actions*. Ce toggle est décoratif pour l'instant (visuellement existant), mais préparera psychologiquement (et dans un commentaire TODO du code) le pont V0.7 qui créera des actions granulaires."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Saisie du numéro de semaine fastidieuse | Fournir des boutons cliquables `[W1] [W2]` beaucoup plus adaptés. |
| Sauvegarde longue | Une validation avec `Enter` fermera et persistera la Tactique immédiatement. |

## 4. Fichiers Impactés
*   `apps/twelve-week/TwelveWeekApp.tsx` / `TacticsBoard.tsx`
*   `apps/twelve-week/components/TacticForgeModal.tsx` (NOUVEAU)
