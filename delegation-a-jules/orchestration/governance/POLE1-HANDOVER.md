# POLE1-HANDOVER — transfert pôle 0 → pôle 1

**Statut : `WAITING_USER_INPUT`.**

Les résumés de vidéos Gemini ne sont pas encore fournis. Tant qu'ils manquent,
le pôle 1 n'est pas admis : ni catégories, ni projets, ni code, ni session.

## 1. Ce qui est attendu de l'utilisateur (contrat d'entrée)

| Entrée | Format | Critère de réception |
|---|---|---|
| Résumés de vidéos Gemini | fichiers déposés dans ce dépôt (ex. `delegation-a-jules/pole1/gemini/`), un fichier par vidéo, avec provenance (URL vidéo, date, méthode d'extraction) | fichier lisible, provenance tracée, aucun secret |
| Décision d'orientation Pôle 1 | choix des livrables visés (site, agent, vidéo) | écrit du propriétaire, cité dans la tranche d'ouverture |

Les annonces Gemini de création OKF/DOX sont un **rapport fourni par
l'utilisateur, pas des écritures vérifiées** par ce programme : elles ne
constituent pas une entrée validée.

## 2. Critères de valeur Pôle 1 (résultat mesurable, pas activité)

Un livrable Pôle 1 est fini si, et seulement si :

- **Site utilisable** : URL atteinte, parcours réel effectué, état vide/erreur
  géré, preuve = capture ou log du parcours + URL/port exacts.
- **Vidéo livrée** : fichier livré (chemin + durée + format), pas un brief ni
  une intention de brief.
- **Agent avec consommateur** : un consommateur réel branché (un appel
  documenté consomme la sortie de l'agent), pas un agent qui « fonctionne »
  sans consommateur.

Tout autre énoncé (« avancement », « sessions lancées ») n'est pas de la
valeur. Les quatre franchises mentionnées (ABC, RILCOT, Alikaly, Marina) sont
du **contexte d'orientation**, pas des exigences produit suffisantes ni une
autorisation de déployer.

## 3. Conditions de départ (fondations, non négociables)

Le pôle 1 ne code rien avant validation des fondations nécessaires :

- persistance navigateur stabilisée : PRD-001 (+ PRD-007) ;
- blackboard service unique : PRD-011 (+ moteur PRD-052) ;
- contrats inter-catégories : PRD-016 ;
- client Jules serveur : PRD-051.

Une dépendance Pôle 1 qui exige un contrat ou un code manquant est déclarée
`BLOCKED` au parent — on ne fabrique ni contrat ni code manquant, et on
n'invente ni dix catégories ni dix projets pour remplir une structure.

## 4. Règles qui restent en vigueur au passage de pôle

`CONTRAT-COMMUN.md` et `E-MYTH-CHARTER.md` s'appliquent intégralement : tranches
testables, scopes exclusifs, gatekeeper avant/après, `COMPLETED` ≠ `integrated`,
interdits (merge, push main, release, production, suppression, finance,
promotion machine→humain), notifications compactes, horizon et budget inchangés.