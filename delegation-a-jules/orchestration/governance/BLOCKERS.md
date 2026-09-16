# BLOCKERS — gouvernance pôle 0 (registre 55 items)

Aucune dépendance réelle n'a été supprimée pour rendre une tranche « prête ».
Les liaisons ci-dessous sont documentées, tranchées par ordre de tranches
(producteur avant consommateur), et restent vérifiables.

## 1. Coordinations résolues par ordre de tranches (pas des depends_on dur)

| Liaison | Sens retenu | Justification |
|---|---|---|
| PRD-002 ↔ PRD-003 (provenance mutuelle) | 002 → 003 | correctif PRD-002 : « aucune en amont » ; la mutuelle est une référence de provenance |
| PRD-003 ↔ PRD-005 (score n'importe pas les cartes historiques) | 003 → 005 | 003 produit les marqueurs d'import ; 005 les consomme. Sans 003, aucune carte historique n'existe : contrainte vacuamente satisfaite |
| PRD-004 ↔ PRD-005 (schéma tactiques ↔ score) | 004 → 005 | 004 définit le dénominateur ; 005 corrige le hook qui le lit. Coordination de schéma, pas un cycle de build |
| PRD-023 ↔ PRD-024 (assistant.store ↔ createScopedStorage) | 024 → 023 | 024 est le producteur de la bibliothèque de scope ; 023 en consomme |
| PRD-012 ↔ PRD-014 (mêmes items ScoreCard) | même source, ordre libre | « même source que les payloads Linear » : contrainte de source, pas de sortie consommée |
| PRD-061 ↔ PRD-091 (compétences A3 vs matrice de rôles B3) | tranches distinctes | chevauchement arbitrable au contrat commun (REVIEW-4-6 et 7-9 s'accordent sur les propriétaires) ; aucun des deux ne bloque le build de l'autre ; 081 dépend de 091, 093 de 061 — pas de cycle |
| PRD-034 ↔ PRD-035 (distillation archives) | 034 → 035 | l'export porte les archives ; la distillation pendante n'empêche pas l'archivage |

## 2. Scopes « proposés » (jamais annoncés comme existants)

Chemins fixés par cette gouvernance faute de chemin explicite dans le PRD ou
l'audit ; le maker doit les confirmer contre le corps du PRD et proposer un
patch d'intégration si divergence :

PRD-045 `src/services/frameworks-bridge/` · PRD-051 `server/jules-client/` ·
PRD-054 `src/services/gtd-deal-pipeline/` · PRD-055 `src/apps/convergence/` ·
PRD-056 `server/dispatch/`, `tests/dispatch/` · PRD-061
`src/services/a3-skills-compiler/` · PRD-062 `server/a3-gates/` · PRD-063
`server/mcp-tools/` · PRD-064 `server/a3-crons/` · PRD-065
`src/apps/agent-portal/components/swarm/` · PRD-026 `server/auth/`,
`tests/auth/`.

## 3. Ancres A SOURCER (audit 2026-09-12, non retrouvées dans le repo)

- PRD-015 : « Observatoire Amy » — A SOURCER avant tout pont.
- PRD-024 : `LAYOUT_KEY='life-os-layout-v1'` — localiser avant d'envelopper.
- PRD-034 : « journal DOX », action `archiveProject` — A SOURCER avant ajout.
- PRD-032 : `AreasView` introuvable — localiser le composant d'onglet réel.

## 4. Sessions à réconcilier (pas des preuves d'integration)

- PRD-003 : session `1391687838750096362` (IN_PROGRESS observée à l'audit).
- PRD-011 : session `sessions/7587937436525114170`, reçu
  `audit/dispatch-state.json` statut `UNCERTAIN` ; continuation
  `[POLE0-EVIDENCE-011-V1]` acceptée (canal interactif prouvé, comptage
  tarifaire non prouvé).

## 5. Sources non fournies ( déclarées, pas cherchées indéfiniment)

- Mandat complémentaire : trouvé sous le nom `EM YTH-MANDAT-COMPLEMENT.md`
  (espace dans le nom de fichier) — lu et appliqué. Recommander un renommage
  `E-MYTH-MANDAT-COMPLEMENT.md` par le parent (non fait : hors scope
  d'écriture).
- Résumés de vidéos Gemini : non fournis → Pôle 1 `WAITING_USER_INPUT`
  (voir POLE1-HANDOVER.md).
- Compteur de quota réel : non observable dans l'API consultée → `UNKNOWN`.