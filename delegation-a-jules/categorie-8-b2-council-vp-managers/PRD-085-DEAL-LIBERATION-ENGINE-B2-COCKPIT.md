# PRD-085: DEAL Liberation Engine & B2 Command Cockpit

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-081 (roster et santé des 8 domaines) ; PRD-082 (file des DoD en attente de validation) ; données DEAL existantes mesurées : `ld01.store.ts` (LD01 Business et Carrière) et `fw-deal.store.ts` — le moteur DEAL s'aligne sur ces stores, pas de second modèle DEAL ; consommateur : PRD-075 (baromètre B1).
- **Write_scope (chemins concrets)** : `src/apps/agent-portal/components/B2CouncilCommandCenter.tsx` (chemin corrigé : `src/apps/portal/` n'existe pas — l'app réelle est `src/apps/agent-portal/`) ; composants du cockpit dans le même dossier. Interdiction de modifier `ld01.store.ts`/`fw-deal.store.ts`.
- **Critères positifs** : radar des 8 domaines alimenté par PRD-081 ; jauge de libération DEAL calculée depuis `ld01.store.ts` (E = tâches éliminées, A = automatisées via A3, L = heures d'attention libérées) ; file des DoD en attente branchée sur PRD-082 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune jauge à valeur par défaut décorative — jauge vide + « source non connectée » quand ld01/PRD-081 sont vides ; pas de télémétrie fictive ; pas de recréation du roster (PRD-041) ni de la matrice B3 (PRD-091) ; pas de second schéma DEAL.
- **Sécurité & isolation** : cockpit lecture seule sur les domaines ; toute action d'arbitrage VP passe par la file PRD-072/082, jamais en écriture directe ; aucun secret dans le composant.
- **Idempotence & persistance** : la jauge DEAL est une projection déterministe du store ; l'historique de libération persisté côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) si l'utilisateur veut l'historique inter-session — pas de décret IndexedDB=blackboard.
- **Reprise / rollback non destructif** : composant ajouté à la navigation existante sans toucher les autres pages ; rollback = retrait du composant et de sa route.

## Objectif
Construire le cockpit de pilotage des 8 VP Managers dans Agent Portal et instrumenter la matrice de liberation DEAL pour le domaine LD01 (Business et Carriere).

## Specifications
- Creer src/apps/agent-portal/components/B2CouncilCommandCenter.tsx.
- Composants visuels :
  - Radar des 8 Domaines B2 (jauges de sante en temps reel).
  - Jauge de liberation DEAL : volume de taches eliminees (E), automatisees via A3 (A), et heures d attention liberees pour le CEO (L).
  - File d attente des validations DoD en attente.
- Valider avec npm run lint (tsc --noEmit) et npm run build.