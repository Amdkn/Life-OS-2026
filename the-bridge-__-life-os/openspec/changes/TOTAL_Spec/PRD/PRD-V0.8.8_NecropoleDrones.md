# PRD: V0.8.8 La Nécropole des Drones (Graveyard)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Très Haute. Variante de tri par statut dans l'interface et filtrage strict.
*   **Valeur (V)** : Haute. Maintient un historique des succès et des investissements passés, tout en nettoyant le Dashboard actif.
*   **Réutilisabilité (R)** : Similaire au principe d'Archive dans PARA.

## 2. User Stories (Phase D)

*   **US-131 [Le Sunsetting Graceful]** : "Une Muse 'Operational' ou 'Failing' ne peut plus être effacée chimiquement du disque. Elle présente un bouton 'DECOMMISSION'."
*   **US-132 [Retrait Financier]** : "Au "Decommission", le statut de la Muse passe à `deprecated`. IMMÉDIATEMENT, ses revenus ($MRR) sortent du radar et sa taxe temporelle est effacée du module 12WY, signalant que le commandant n'attache plus d'importance ni de ressource à cette Muse."
*   **US-133 [L'Archive Visuelle]** : "Un toggle ou un onglet 'Graveyard / Archives' dans le Dashboard des Muses affiche en opacité réduite toutes les Muses décommissionnées, avec un badge 'HONORABLY DISCHARGED'."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Vraie Suppression via l'UI | Comme un vaisseau, une Muse reste dans les logs marins (IndexedDB). Seul un script de nettoyage lourd (GC) par un Agent Infra L0 pourra effacer physiquement la base `ld06`. |

## 4. Fichiers Impactés
*   `src/apps/deal/pages/Muses.tsx` (Création de la vue d'archives / du filtre).
*   `src/stores/fw-deal.store.ts` (Status type extension & decommission action).
