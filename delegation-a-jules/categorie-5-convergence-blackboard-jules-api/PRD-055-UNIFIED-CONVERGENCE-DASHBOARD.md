# PRD-055: Dashboard Unifié de Convergence & Holding Linear QG

## Objectif
Fournir le poste de pilotage suprême unifiant Life OS et Business OS, affichant l'état de santé des 6 Frameworks, la progression des PRDs Jules et la synchronisation avec le QG Linear.

## Spécifications
- Créer src/apps/convergence/ConvergenceCommandCenter.tsx.
- Vue synoptique : Radar des 6 Vaisseaux, statut des sessions Jules en cours, score 12WY global et télémétrie Blackboard.
- Pont bidirectionnel avec les issues et équipes Linear.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Agrege : PRD-041 (frameworks), **PRD-051** (sessions Jules), **PRD-052** (telemetrie Blackboard), PRD-054 (pipeline), PRD-064 (crons).
- Linear : le canal est **PRD-012 (cat. 1, Linear HQ)** et/ou PRD-063 (LinearSyncTool). **Pas de second client Linear** dans ce dashboard.

### Criteres d'acceptation
- Positifs : lint+build ; radar des 6 vaisseaux alimente par l'etat reel (PRD-045/052) ; sessions Jules = reponses API reelles ; score 12WY depuis `fw-12wy.store.ts` existant.
- Negatifs : aucune donnee de demonstration ; UI vide ou en erreur = etat explicite affiche, jamais des valeurs par defaut flatteuses ; pas de secret dans le bundle.

### Isolation / performance
- Composant de presentation : aucune ecriture directe SQLite/IndexedDB — lecture via services, actions dispatchees aux stores existants.

### Reprise
- Fichier unique `src/apps/convergence/ConvergenceCommandCenter.tsx` (+ sous-composants) : suppression = retour a l'etat anterieur, non destructif.
