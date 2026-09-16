# PRD-082: B2 DoD & JTBD Translation Pipeline (B1->B2->B3)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-072 (file B1→B2 — le pipeline consomme les tickets de handoff, il ne crée pas de source alternative de mandats) ; PRD-081 (roster VP, attribution des DoD) ; consommateur aval : PRD-061 (cat 6) exécute les compétences, PRD-062/063 les orquestrent — ce pipeline **ne recrée pas** la compilation des compétences de PRD-061 et ne lance pas les A3 avant intégration de PRD-072.
- **Write_scope (chemins concrets)** : `src/services/governance/b2-dod-pipeline.ts` (dossier à créer), types partagés dans `src/types/governance.ts` (même dossier que PRD-072 — coordonner avec la catégorie 7, ne pas dupliquer le type ticket).
- **Critères positifs** : un Rock B1 entre, un ticket DoD sort avec les 4 champs déclarés (critère de complétude fonctionnelle, tests automatisés requis, absence de code mort/placeholder, action receipt attendue) ; la traduction est déterministe (même entrée → même sortie) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune tâche A3 sans DoD validée (règle d'arrêt PRD-072 respectée) ; pas de mock de preuve d'exécution — l'action receipt est une preuve d'environnement (chemin, exit code, HTTP), jamais une affirmation ; pas de contournement du verrou B1 ; pas de données fictives dans la pipeline.
- **Sécurité & isolation** : le ticket ne transporte pas de secret ; la vérification « absence de code mort/placeholder » est déclarée comme règle du DoD, pas comme un scanner exécutable inventé.
- **Idempotence & persistance** : la traduction B1→DoD est idempotente (même Rock → même ticket, clé de déduplication) ; les tickets DoD persistés côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas localStorage navigateur.
- **Reprise / rollback non destructif** : service additif, rollback = retrait du fichier ; les DoD déjà émis restent lisibles (pas de migration destructive).

## Objectif
Implementer le pipeline formel de traduction des demandes strategiques B1 en contrats d acceptation rigoureux (Definition of Done) et en taches executees par les A3 (Jobs to be Done).

## Specifications
- Creer src/services/governance/b2-dod-pipeline.ts.
- Structure d un ticket DoD :
  - Critere de completude fonctionnelle.
  - Tests automatises requis.
  - Verification d absence de code mort et absence de placeholder.
  - Preuve formelle d execution attendue (action receipt).
- Valider avec npm run lint (tsc --noEmit) et npm run build.