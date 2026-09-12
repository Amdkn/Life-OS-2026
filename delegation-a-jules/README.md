# Délégations Jules — contrôle avant lancement

Statut : briefs corrigés localement, non publiés. Aucun lancement autorisé par cet index seul.

## Ordre et dépendances
| Ordre | Brief | Dépendances |
|---|---|---|
| 1 | [PRD-001](PRD-12WY-SQLITE-GLASSMORPHISM.md) — local-first | Inspecter persistance et consommateurs existants |
| 2 | [PRD-002](PRD-002-12WY-VISION-SOLARPUNK.md) — vision | Contrat de données/persistance de 001 stabilisé |
| 3 | [PRD-003](PRD-003-12WY-PLANNING-OBJECTIFS.md) — planning | 001 + séparation horizons de 002 |
| 4 | [PRD-004](PRD-004-12WY-PROCESS-CONTROL-TACTICS.md) — tactiques | Objectifs et cycle de 003 |
| 5 | [PRD-005](PRD-005-12WY-MEASUREMENT-85PERCENT.md) — mesure | États/engagements de 004 |
| 6 | [PRD-006](PRD-006-12WY-TIME-USE-BLOCKS.md) — temps | Liens tactique/cycle de 004 ; score compatible 005 |

Un seul worker écrivain initial : les briefs partagent composants/stores. Pas de plancher de sessions. Chaque lancement éventuel reçoit un seul PRD, une branche et un commit source exacts, périmètre, budget plafond, preuve attendue et condition d'arrêt. Vérifier PRs/sessions déjà ouvertes avant lancement ; ne pas doubler un travail en cours. Une dépendance n'est satisfaite qu'après revue/tests et disponibilité dans le commit source suivant, pas sur annonce d'un worker.

## Contrat données
`../vue.html` est une vue dérivée historique, non une source de ratification. Aucun `plan.json` n'est présumé livré au clone. Les sources V3 citées par cette vue ne sont pas accessibles à Jules : références de provenance seulement, A SOURCER si non consultables. Ne pas transférer de corpus privé supplémentaire. Historique, proposition, engagement actif et certification humaine restent distincts.

## Contrôle local
Depuis la racine : `python delegation-a-jules/scripts/validate_briefs.py` puis `python delegation-a-jules/scripts/validate_briefs.py --self-test`.
Ces tests vérifient des invariants documentaires limités, PAS le fonctionnement de Life OS ni la disponibilité distante. Les PRD contiennent les tests fonctionnels que Jules devra exécuter en plus de `npm run lint` et `npm run build`.

## Porte distante
Avant tout lancement : revue du diff et de la confidentialité du contenu déjà présent dans vue.html ; publier uniquement le périmètre choisi après autorisation appropriée, puis vérifier le SHA et la présence des briefs sur la branche distante effectivement fournie à Jules. Une modification locale n'est pas visible dans son clone. Aucun push, merge, déploiement, élargissement de budget ou signature human:amdkn automatique.

## Remplacement et retour arrière
Ces briefs remplacent les consignes antérieures contradictoires ; ils n'ajoutent ni cadence, ni base, ni moteur SQLite obligatoire. Les versions précédentes restent dans Git. Restaurer uniquement les fichiers de ce dossier depuis la révision antérieure après revue du diff, sans toucher aux autres travaux.
