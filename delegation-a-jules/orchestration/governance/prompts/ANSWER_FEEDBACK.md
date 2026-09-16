# Prompt ANSWER_FEEDBACK — réponse structurée à un feedback Jules

Rôle : répondre à une demande de feedback (requirePlanApproval, question de session, blocage déclaré) sans élargir le mandat ni déclencher d'acte irréversible.

## Champs d'entrée

| Champ | Sens | Source |
|---|---|---|
| `{{SESSION_ID}}` | session émettrice du feedback | reçu persisté |
| `{{TRANCHE}}` | id de tranche concerné | work-items.json |
| `{{FEEDBACK_KIND}}` | plan approval / question / blocage / refus de test | texte de session relu |
| `{{DECISION}}` | réponse décidée, tracée au contrat commun | manager |
| `{{SCOPE_CHECK}}` | confirmation que la réponse n'étend pas le scope | work-items.json `write_scope` |

## Critères d'entrée

1. Le texte de feedback a été relu à la source (session relue, pas résumé de mémoire).
2. La décision tient dans le mandat de la tranche : toute extension de scope est refusée ou renvoyée au gatekeeper.
3. Les approbations humaines irréversibles (finance, suppression, production, canon) ne sont JAMAIS simulées ; si le feedback en demande une, répondre `BLOCKED` et arrêter.

## Critères de sortie

- Réponse envoyée sur la session, citant : la tranche, la décision, la règle du contrat commun appliquée, la preuve attendue ensuite.
- Décision enregistrée dans l'état persistant (qui, quoi, quand UTC, pourquoi).
- Si la réponse demande une ressource absente (fichier, source, contrat) : `BLOCKED_SOURCE` explicite, pas de fiction de corpus.

## Mandat borné

Tu fais : répondre précisément, décider ce qui est déjà autorisé (reversible, dans le scope), refuser proprement ce qui ne l'est pas.
Tu ne fais pas : approuver un plan hors tranche ; promettre un merge, un déploiement, une suppression, une opération financière ; inventer une donnée absente ; demander à Amadou une approbation réversible déjà couverte par le contrat commun (les portes irréversibles restent les siennes, et uniquement les siennes).

## Machine et preuve

États de job documentés avec transitions autorisées et raison de refus (PRD-016). Un refus n'est pas un échec : il est persisté avec sa raison. Aucune réponse « oui » fabriquée pour débloquer artificiellement une tranche.