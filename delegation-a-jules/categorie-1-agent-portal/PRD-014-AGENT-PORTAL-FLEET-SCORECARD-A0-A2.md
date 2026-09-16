# PRD-014 — Agent Portal : ScoreCard Transversal & Télémétrie A0-A2


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (télémétrie via blackboard/stores) ; PRD-012 (attribution des items, même roster) ; PRD-013 (heartbeats pour le statut online/idle/busy).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/dashboards/ScoreCard.tsx`, `src/apps/agent-portal/components/AgentStats.tsx` (vérifiés) ; `src/stores/` comme source.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** attribution et transitions réelles des tâches Kanban avec notification d'agent ; jauges de charge et statut fondés sur des données de store réelles ; télémétrie synchronisée au panneau latéral.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun statut green simulé ; les placeholders « Awaiting V0.7 Neural Link » cités n'ont été retrouvés au 2026-09-12 que dans `src/apps/twelve-week/components/GoalCommandCard.tsx` (12WY, pas agent-portal) — relocaliser l'ancre avant de supprimer, et ne pas prétendre qu'il pollue les vues de détail de l'agent-portal sans l'avoir vérifié ; aucune télémétrie fictive.

**Sécurité / isolation / idempotence / persistance :** roster A0/A1/A2 déclaré comme données locales du repo (pas de disque privé) ; transitions idempotentes (double clic sans double notification).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** revert des composants listés ; le Kanban conserve son état de store, un rollback n'efface pas les tâches.

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre la ScoreCard Kanban et l'état réel des agents A0 (Amadeus), A1 (Beth+Morty) et A2 (Orville, Discovery, Enterprise).
- **Remplacement :** Rendre la télémétrie de flotte réactive dans `ScoreCard.tsx` et `AgentStats.tsx` avec les métriques réelles de progression.

## 2. Périmètre et Données
- Relier chaque tâche Kanban à son agent assigné (couche A1/A2).
- Intégrer les jauges de charge réelle, de statut (online/idle/busy) et d'historique de log d'agent.
- Éliminer les faux placeholders "Awaiting V0.7 Neural Link" dans les vues de détail.

## 3. Acceptation Fonctionnelle
- Attribution et transition réelles des tâches entre états Kanban avec notification d'agent.
- Télémétrie de l'Armada synchronisée sur le panneau latéral droit.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
