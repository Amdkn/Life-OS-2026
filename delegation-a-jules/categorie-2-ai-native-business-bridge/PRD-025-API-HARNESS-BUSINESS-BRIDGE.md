# PRD-025 — Pont API REST & Harness d'Orchestration Life OS <=> Business OS


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (les événements de pont transitent par le blackboard si partagés) ; PRD-006 (les Strategic Time Blocks proviennent des blocs de temps, pas d'une estimation) ; PRD-005 (le bilan temps/énergie utilise les mesures réelles).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `express` déclaré dans dependencies ; **aucun serveur `api/` ni `src/lib/bridge/` présent au 2026-09-12** — l'API est à créer côté backend Node (express), jamais dans le bundle Vite.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** payloads typés échangés sans régression ; GET retourne des jalons sourcés du repo Business OS, jamais des deadlines inventées ; commutateur trimodal affiché dans le header.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de secret dans les payloads ou le bundle navigateur ; pas d'appel réseau sortant non configuré ; aucun jalon cash-flow fabrique si la source Business OS n'est pas branchée (retourner vide explicite, pas des chiffres plausibles) ; l'API n'écrit pas dans les stores React directement.

**Sécurité / isolation / idempotence / persistance :** endpoints liés à localhost ; validation d'entrée des payloads (pas d'injection) ; CORS borné à l'origine locale ; pas de télémétrie sortante.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** endpoints additifs : rollback = arrêter le serveur et retirer les routes ; Life OS continue hors ligne.

## 1. Valeur et Remplacement
- **Origine Business OS :** `api/chat.ts`, `scripts/build-harness.mjs`, `_runtime/bridge/`.
- **Obstacle dans Life OS :** Fonctionnement en silo isolé sans communication bidirectionnelle avec les métriques et offres réelles de Business OS (The OMK Office, JaaS).
- **Remplacement :** Déployer les endpoints API et le harnais d'orchestration (`src/lib/bridge/business-bridge.ts`) permettant à Life OS de synchroniser le bilan temps/énergie avec le pipeline de valeur de Business OS.

## 2. Périmètre et Implémentation
- Route API de synchronisation :
  - `POST /api/bridge/life-to-business` : Transmission de la capacité de bande passante (Strategic Time Blocks disponibles).
  - `GET /api/bridge/business-to-life` : Réception des jalons critiques de cash-flow et deadlines clients pour alimenter W1-W12.
- Intégration dans le header de l'OS du commutateur trimodal (Tech OS, Life OS, Business OS).

## 3. Acceptation Fonctionnelle
- Échange de payloads typés entre Life OS et Business OS vérifié sans régression.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
