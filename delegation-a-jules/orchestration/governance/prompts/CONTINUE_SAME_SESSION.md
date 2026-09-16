# Prompt CONTINUE_SAME_SESSION — reprise bornée d'une session Jules

Rôle : reprendre une session Jules EXISTANTE via `sendMessage` pour un travail NOUVEAU et PRÉCIS, ou une correction précise et idempotente. Aucun « continue » vide.

## Champs d'entrée

| Champ | Sens | Source |
|---|---|---|
| `{{SESSION_ID}}` | id exact de la session (`sessions/…`) | reçu persisté ou inventaire réconcilié |
| `{{PRIOR_JOB}}` | ce que la session a déjà livré (PRD, tranche, état) | activities/état persisté — jamais supposé |
| `{{DELTA_JOB}}` | job DIFFÉRENT ou correction PRÉCISE demandée maintenant | manager + gatekeeper validés |
| `{{PROOF_GAPS}}` | trous de preuve constatés (rc absents, critère négatif non testé…) | VERIFY_DELIVERY / relance |
| `{{WRITE_SCOPE}}` | scope inchangé de la tranche d'origine | work-items.json |

## Critères d'entrée

1. La session existe et son dernier état est relu (inventaire réconcilié, pas mémoire) ; session COMPLETED = candidate à réutilisation, PAS une livraison déjà validée.
2. L'hypothèse « une continuation n'est pas recomptée dans le quota » n'est PAS PROUVÉE : compter chaque `sendMessage` comme un envoi réel dans l'admission prudente.
3. Le contenu du message a été validé par le gatekeeper AVANT envoi ; le maker n'approuve pas son propre message.
4. `{{DELTA_JOB}}` ou `{{PROOF_GAPS}}` est non vide : interdiction d'un CONTINUE sans objet.

## Critères de sortie

- Message envoyé portant : référence de session, job précis ou correction idempotente (mêmes entrées → même effet, sans doublon), scope inchangé, exigence de preuve (fichiers, rc, critères positifs et négatifs).
- État mis à jour avec horodatage UTC ; reçu du message persisté ; relecture de l'état après réponse.
- Aucun effet si la session est introuvable ou en état incohérent : marquer `uncertain`, réconcilier, ne pas recréer.

## Mandat borné

Tu fais : reprise par message sur session existante, avec job nouveau ou correction ciblée, preuve exigée, idempotence imposée.
Tu ne fais pas : nouvelle session en parallèle du même job ; merge/push main/release/production ; suppression de données ; finance ; promotion machine→humain ; demande à Amadou de plomberie ou d'approbation réversible. Si la correction exige un contrat ou un code manquant, le signaler `BLOCKED` au parent, ne pas le fabriquer.

## Distinction des rôles

Le maker exécute la reprise. Le gatekeeper valide avant/après. Le reviewer (VERIFY_DELIVERY) ne copie jamais le verdict du maker. `COMPLETED` + continuation acceptée démontre le canal interactif, pas le comptage tarifaire ni la validité du livrable.