# PRD-011 — Blackboard Workspace Local SQLite & Event Store

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre les interfaces Zustand, IndexedDB et le manque d'état partagé concurrent.
- **Remplacement :** Implémenter le socle Blackboard SQLite local-first dans Life OS (`src/lib/blackboard/`), fournissant une table relationnelle d'événements append-only (`events`), de threads (`workspaces`), de verrous (`locks`) et d'artefacts (`artifacts`).

## 2. Périmètre et Données
- Réutiliser la connexion SQLite / IndexedDB locale sans dépendance réseau bloquante.
- Schéma typé :
  - `workspaces` (id, name, domain_id, status, linear_team_id, created_at, updated_at)
  - `events` (id, workspace_id, actor_id, actor_layer, event_type, payload_json, timestamp)
  - `locks` (id, resource_key, locked_by, expires_at)
- Pont réactif vers `useAgentsStore` et `shell.store.ts`.

## 3. Acceptation Fonctionnelle
- Émission et lecture d'événements sans perte ni altération de JSON.
- Acquisition et libération de verrous déterministes.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
