# PRD-072: B1 Handoff Queue & Decision Charter (B1->B2->B3)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (types `FranchiseInstance`, `b2Gates`) ; consommateur aval : PRD-082 (pipeline DoD B2, cat 8) qui lit cette file. Ne pas démarrer PRD-082 avant intégration de PRD-072.
- **Risque mesuré** : le PRD initial cite `04_B2_HANDOFF_QUEUE.md` et `03_DECISION_CHARTER.md` — documents absents du repo (mesuré : glob sans résultat). Ils vivent dans le corpus privé hors repo. Le PRD doit embarquer l'extrait canonique des règles (les 3 ci-dessous) et ne pas dépendre de fichiers hors repo.
- **Write_scope (chemins concrets)** : `src/services/governance/b1-handoff-queue.ts` (création, dossier à créer), `src/types/governance.ts` (types du ticket handoff, dossier à créer). Interdiction de toucher les PRD des autres catégories et les stores existants.
- **Critères positifs** : un ticket B1→B2 est créé, assigné, refusé ou honoré avec historique ; aucun état de ticket non défini dans un type union strict ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune UI dans ce PRD (le cockpit PRD-075 visualise) ; aucune notification sortante vers Jules ici ; aucun contournement du verrou « pas de mandat B1 → pas de travail B2 » ; pas de données fictives dans la file.
- **Sécurité & isolation** : le ticket ne transporte jamais de secret ; l'alerte de dérive de direction est un événement interne, pas un envoi réseau.
- **Idempotence & persistance** : création de ticket idempotente (clé de déduplication id franchise + référence docket) ; la file persiste côté blackboard SQLite service (schéma propriétaire PRD-011, consommation PRD-052) — pas un localStorage navigateur. Le service n'existe pas encore (mesuré : express en deps, aucun fichier serveur) : à créer dans `src/server/` ou à déclarer dépendance explicite de PRD-011.
- **Reprise / rollback non destructif** : rollback = retrait du service et des 2 fichiers créés ; la file est additive, jamais destructive sur des données existantes.

## Objectif
Materialiser le protocole canonique documente dans 04_B2_HANDOFF_QUEUE.md et 03_DECISION_CHARTER.md pour empecher tout travail d execution sans mandat B1.

## Specifications
- Creer src/services/governance/b1-handoff-queue.ts.
- Implementer les regles d arret :
  - Aucun travail B2 sans ticket dans la file de transmission B1.
  - Aucun travail A3/B3 sans DoD (Definition of Done) validee par B2.
  - Alerte de derive de direction transmise au CEO.
- Valider avec npm run lint (tsc --noEmit) et npm run build.