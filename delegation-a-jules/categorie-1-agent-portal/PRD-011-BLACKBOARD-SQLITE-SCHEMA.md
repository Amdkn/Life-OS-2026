# PRD-011 — Blackboard Workspace Local SQLite & Event Store


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** consommateurs déclarés : PRD-012 (Outbox Blackboard, `linear_team_id` du schéma), PRD-013 (registry crons), PRD-021 (`life-os blackboard events`), PRD-022 (`life_os_blackboard_post`). PRD-052 (catégorie 5) consomme ce schéma SANS en créer un second. PRD-001 (catégorie 0) reste sur IndexedDB navigateur et ne définit aucun schéma blackboard.

**Périmètre d'écriture (write_scope) :**
- Existant à LIRE : app Agent Portal et stores appelants ; pas de réécriture générale de ces consommateurs dans la première tranche du socle.
- Proposé (à créer) : migrations et repository sous `server/blackboard/`, adaptateur navigateur sous `src/lib/blackboard/`, tests d'intégration sous `tests/blackboard/`. Réutiliser le backend s'il est découvert ; sinon créer une seule entrée serveur dans cette tranche avec ownership de sa configuration. La première tranche PRD-011 ne modifie PAS les vues AgentPortal ni les stores génériques : leur intégration relève des PRD consommateurs.

**Critères d'acceptation positifs :** émission/lecture d'événements sans perte ni altération de JSON ; acquisition/libération de verrous déterministes avec `expires_at` ; append-only sans altération rétroactive ; ids d'événements déterministes pour l'idempotence des reposts.

**Critères d'acceptation négatifs (doivent rester vrais) :** le moteur SQLite ne vit JAMAIS dans le bundle navigateur React (pas de better-sqlite3/sqlite natif côté UI) — c'est un service local backend (Node/Express, express déjà déclaré) ; DomainDB/IndexedDB navigateur n'est pas remplacé par décret ; aucun second schéma blackboard créé ailleurs (PRD-052 consomme) ; aucun secret dans le schéma ou les payloads.

**Sécurité / isolation / idempotence / persistance :** cette PR est propriétaire unique du schéma : la section schéma doit couvrir les 4 tables annoncées — `workspaces`, `events`, `locks` ET `artifacts` (annoncée dans le remplacement mais absente du schéma typé : compléter), plus les index requis ; verrous à TTL explicite ; isolation par `domain_id` et `actor_layer`.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** désactiver le nouvel adaptateur, revenir au code antérieur sur branche de revue et conserver la DB, ses événements et sa sauvegarde. Aucune suppression de dossier de données pour annuler une activation.

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre les interfaces Zustand, IndexedDB et le manque d'état partagé concurrent.
- **Remplacement :** Implémenter le socle Blackboard SQLite local-first dans Life OS (`src/lib/blackboard/`), fournissant une table relationnelle d'événements append-only (`events`), de threads (`workspaces`), de verrous (`locks`) et d'artefacts (`artifacts`).

## 2. Périmètre et Données
- Réutiliser les contrats existants sans confondre les connexions : SQLite côté service, IndexedDB côté navigateur ; pas de driver SQLite natif dans React.
- Schéma typé :
  - `workspaces` (id, name, domain_id, status, linear_team_id, created_at, updated_at)
  - `events` (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
  - `locks` (id, resource_key, locked_by, expires_at)
- Pont réactif vers `useAgentsStore` et `shell.store.ts`.

## 3. Acceptation Fonctionnelle
- Émission et lecture d'événements sans perte ni altération de JSON.
- Acquisition et libération de verrous déterministes.
- Exécuter des tests fonctionnels réels et fournir les commandes/rc ; `npm run lint` et `npm run build` à 0 erreur sont des contrôles supplémentaires, pas les tests métier.
