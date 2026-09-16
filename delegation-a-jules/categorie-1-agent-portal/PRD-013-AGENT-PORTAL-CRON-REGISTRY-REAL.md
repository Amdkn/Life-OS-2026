# PRD-013 — Agent Portal : Remplacement des Mocks du Cron Registry


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (les heartbeats/derniers pulses peuvent transiter par le blackboard events) ; PRD-014/PRD-015 pour la télémétrie de flotte affichée à côté.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/CronsView.tsx` avec `MOCK_CRONS` (vérifié présent au 2026-09-12).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** remplacement intégral de MOCK_CRONS ; lecture dynamique d'un registre de jobs réel déclaré dans le repo ; statut live et dernier pulse exacts ; activation/désactivation avec retour visuel.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune lecture au runtime du corpus ASpace OS V3 ni de `C:/Users` (le registre est une source de données du repo, exportée/distillée, jamais un chemin disque privé) ; l'exécution cron réelle est côté service/backend (Node), jamais des `setInterval` React prétendus crons ; aucune fréquence inventée sans source (Heartbeat 15m, Circadien 24h, Revue Hebdo W13 à sourcer dans le registre) ; aucun statut vert simulé.

**Sécurité / isolation / idempotence / persistance :** le registre est en lecture seule côté UI ; l'activation/désactivation passe par une API du service local, pas par une mutation directe de fichier ; idempotence des bascules.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** la vue statique MOCK_CRONS est remplacée : rollback = revert de CronsView ; conserver le mock sous feature flag le temps de la PR est acceptable mais il doit rester identifiable comme mock.

## 1. Valeur et Remplacement
- **Obstacle :** La vue `CronsView.tsx` affiche un tableau statique fictif (`MOCK_CRONS`, 32 crons fantômes).
- **Remplacement :** Connecter `CronsView.tsx` aux véritables tâches planifiées et aux heartbeats déterministes de Life OS et ASpace OS V3.

## 2. Périmètre et Données
- Lecture dynamique de la table des jobs réels ou du store des automatisations.
- Prise en charge des fréquences réelles (Heartbeat 15m, Circadien 24h, Revue Hebdo W13).
- Interface d'activation/désactivation de crons réels avec retour visuel d'exécution.

## 3. Acceptation Fonctionnelle
- Remplacement intégral de `MOCK_CRONS`.
- Affichage exact du statut live des tâches et du dernier pulse.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
