# PRD-075: B1 Summer-Verse CEO Command Cockpit

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Cockpit terminal B1 — n'affiche que ce qui existe.

- **Dépendances PRD réelles** : PRD-071 (franchises), PRD-072 (file d'arbitrages B1), PRD-073 (CA/trésorerie), PRD-081/PRD-085 (santé des 8 domaines B2, cat 8), PRD-051 (client serveur Jules, cat 5 — le « déclenchement de délégations Jules d'un simple clic » passe par ce client existant, pas un second client). Dépendants : aucun (PRD final de cat 7).
- **Quota Jules — fait mesuré** : docs officiels = 100 tâches/24 h glissantes (Pro) et 15 tâches concurrentes ; l'API ne prouve pas de compteur par utilisateur. Le cockpit n'affiche donc pas un « quota restant » mais le nombre de délégations actives connues localement.
- **Write_scope (chemins concrets)** : `src/apps/agent-portal/components/B1SummerVerseCockpit.tsx` (chemin corrigé : `src/apps/portal/` n'existe pas dans le repo — l'app réelle est `src/apps/agent-portal/`). Interdiction de créer `src/apps/portal/`.
- **Critères positifs** : baromètre des 4 franchises alimenté par PRD-071/073 ; file d'arbitrages branchée sur PRD-072 ; lancement de délégation Jules via PRD-051 ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune métrique simulée quand la source est vide — jauge vide + libellé « source non connectée » ; pas de second client Jules ; pas de chiffre de trésorerie calculé côté navigateur (PRD-073 fournit les états) ; aucune donnée des sociétés réelles codée en dur.
- **Sécurité & isolation** : le cockpit est en lecture/ordonnancement, pas en écriture comptable ; tout déclenchement de délégation passe par la file PRD-072 (pas de travail sans mandat) ; aucun secret dans le composant.
- **Idempotence & persistance** : clic de délégation idempotent (déduplication côté client de l'entrée de file) ; l'état du cockpit est une projection lecture seule des stores existants (`fw-12wy.store.ts`, `ld01.store.ts`) et des services PRD-072/073.
- **Reprise / rollback non destructif** : composant ajouté à la navigation existante sans modifier les autres pages ; rollback = retrait du composant et de sa route.

## Objectif
Construire le tableau de bord de direction supreme dans Agent Portal pour Amadou Kone (CEO B1).

## Specifications
- Creer src/apps/agent-portal/components/B1SummerVerseCockpit.tsx.
- Synthese executive :
  - Barometre des 4 franchises (Chiffre d affaires, Taux de completion 12WY, Sante operationnelle).
  - File d attente des arbitrages B1 (decisions strategiques requises).
  - Declenchement rapide de delegations Jules transversales d un simple clic.
- Valider avec npm run lint (tsc --noEmit) et npm run build.