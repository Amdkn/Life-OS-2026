# REVIEW-GROUPE-4-6 — Audit PRD catégories 4, 5, 6

- **Date** : 2026-09-12
- **Worker** : jules-audit-worker (groupe 4-6), mandat `jules-audit-worker.md`
- **Périmètre lu** : `delegation-a-jules/categorie-4-*`, `categorie-5-*`, `categorie-6-*` (15 PRD + 3 README), `package.json`, `src/` (inspection bornée, jamais node_modules).
- **Périmètre modifié** : uniquement les PRD + README de mes catégories, plus ce rapport et son JSON homonyme. Aucune application, config, commit, push, appel Jules.
- **Méthode** : lecture intégrale des 15 PRD, inspection mesurée de `src/` (types, config, apps, services, stores), patch déterministe par script (contenu spécifique rédigé par PRD), vérification anti-résidus (caractères de contrôle, `\'`, ligne de validation corrompue) → `OK aucun residu`, rc=0.

## Défauts transversaux trouvés et corrigés (F1–F5)

| ID | Défaut (mesuré) | Correction |
|---|---|---|
| F1 | Les 15 PRD finissent par « Valider avec `pm run build` et `sc --noEmit` » — contient des octets de contrôle 0x0A/0x09 physiques ; commandes `pm` et `sc` inexistantes | Remplacé par : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build` |
| F2 | Apostrophes échappées `\'` héritées d'un générateur Python, dans cat-4/cat-5 et leurs README | Apostrophes normales |
| F3 | Caractères de contrôle d'échappement Python : PRD-051 `\approvePlan` → `pprovePlan` ; PRD-052 `\blackboard_items \agent_locks \vessel_states \action_receipts` → noms tronqués ; PRD-062 `\any`, `\action_receipts` | Noms restaurés : `approvePlan`, `blackboard_items`, `agent_locks`, `vessel_states`, `action_receipts`, `any` |
| F4 | Aucun PRD ne portait de dépendances, périmètre ni critères d'acceptation | Ajout d'une section `## Correctif de délégation (audit 2026-09-12)` en tête de chaque PRD : dépendances, write_scope, critères positifs ET négatifs, sécurité/isolation/idempotence/persistance, reprise/rollback non destructif + pointeur `../CONTRAT-COMMUN.md` (créé par le parent) |
| F5 | README cat-4 titré « Catégorie 6 », README cat-5 titré « Catégorie 7 » | Renumérotés 4 et 5 |

## Audit par PRD

### PRD-041 — Frameworks Canon Roster (cat. 4)
- **Findings** : cible `src/types/frameworks.ts` inexistante (mesuré) ; `src/config/` vide. Aucun fichier demandé n'existe : tout est à créer, rien à écraser.
- **Rôle structurant** : PRD-041 est le **propriétaire du contrat roster** (`FrameworkId`, `VesselConfig`, `AgentCrewMember`). PRD-042→045, PRD-061 (cat. 6) et PRD-091 (cat. 9, matrice de rôles) doivent consommer, jamais redéclarer.
- **Write_scope** : `src/types/frameworks.ts`, `src/config/vessels.config.ts`, modification minimale du header/sidebar existant.
- **Statut** : patched (docs). 

### PRD-042 — Ikigai & Horizons (cat. 4)
- **Findings** : chemin demandé `src/apps/frameworks/ikigai/` créerait un arbre parallèle alors que `src/apps/ikigai/` existe déjà (avec `components/`, mesuré). IndexedDB pour les fiches : correct, mais à ne pas confondre avec le Blackboard SQLite service (les deux plans ne se remplacent pas).
- **Corrections** : implémentation dans `src/apps/ikigai/` existant ; migrations IndexedDB additives uniquement ; « non mesuré » interdit de masquer.
- **Dépendances** : PRD-041 (types). **Statut** : patched.

### PRD-043 — GTD Cerritos Inbox Gate (cat. 4)
- **Findings** : même défaut de chemin (`src/apps/gtd/` existe déjà). Promotion 12WY : le store `src/stores/fw-12wy.store.ts` existe (mesuré) — pas de second store.
- **Corrections** : pipeline dans `src/apps/gtd/` ; promotion = changement de statut réversible, jamais une suppression.
- **Dépendances** : PRD-041, fw-12wy.store. **Statut** : patched.

### PRD-044 — DEAL Protostar (cat. 4)
- **Findings** : même défaut de chemin (`src/apps/deal/` et `src/stores/fw-deal.store.ts` existent, mesurés). « Suggestions proactives d'Antigravity et Jules » ambigu : risque de déclenchement automatique.
- **Corrections** : suggestions affichées via PRD-051 uniquement ; aucune exécution automatique sans approbation humaine (Amadou n'est pas exécutant technique ; l'agent outille, l'humain arbitre).
- **Dépendances** : PRD-041, PRD-051. **Statut** : patched.

### PRD-045 — Pont Frameworks → Blackboard & Linear (cat. 4)
- **Findings** : le pont écrit « l'état partagé du Blackboard » sans déclarer de dépendance au propriétaire du schéma ; risque d'un second canal d'écriture.
- **Corrections** : dépend explicite PRD-052 (moteur) + PRD-011 (cat. 1, schéma) ; aucune table propre ; navigateur ne parle jamais SQLite natif ; canal d'écriture unique ; resynchronisation complète après coupure.
- **Dépendances** : PRD-052, PRD-011, PRD-041. **Statut** : patched.

### PRD-051 — Client Jules API & Dispatcher (cat. 5)
- **Findings (bloquant sécurité)** : tel que rédigé, le client appelle l'API depuis l'interface — la clé finirait dans le bundle (`VITE_*` exposé au navigateur). **Findings (données)** : « affichant les quotas quotidiens » sans source ; l'API n'expose pas de compteur utilisateur prouvé.
- **Corrections** : clé API uniquement côté service local Node, jamais `VITE_*` ni code navigateur ; quotas affichés = « quota inconnu » si l'API ne renvoie pas de compteur (docs officielles Pro : 100 tâches/24 h glissantes, 15 concurrentes — mentionnées comme contexte, pas comme compteur UI) ; `AUTO_CREATE_PR` désactivable, `approvePlan` humain par défaut ; création de session idempotente (clé PRD+hash brief) ; API injoignable = UI vide/erreur explicite.
- **Rôle structurant** : PRD-051 est le propriétaire du client Jules (044, 054, 055 consomment le dispatcher).
- **Dépendances** : service local Node (backend). **Statut** : patched.

### PRD-052 — Blackboard Shared SQLite Engine (cat. 5)
- **Findings** : le PRD se déclare créateur du schéma (`tables blackboard_items, agent_locks, vessel_states, action_receipts`) alors que **PRD-011 (cat. 1) est le propriétaire du schéma Blackboard** → risque de second schéma. « IndexedDB sous le capot » brouille la frontière navigateur/service.
- **Corrections** : PRD-052 = moteur/consommateur référençant le schéma PRD-011, sans second schéma ; SQLite côté service Node uniquement, IndexedDB = cache de lecture ; verrous avec TTL (reprise non destructive après crash) ; sauvegarde avant migration, migrations additives.
- **Dépendances** : PRD-011 (schéma, arbitrage parent si divergence). **Statut** : patched.

### PRD-053 — Life Wheel Discovery Engine (cat. 5)
- **Findings** : chemin demandé `src/apps/frameworks/wheel/` alors que `src/apps/life-wheel/` existe (contenu substantiel, mesuré) ; « synchronisation des jauges avec les livrables concrets » sans règle de mesure → risque de valeurs plausibles non sourcées.
- **Corrections** : moteur dans `src/apps/life-wheel/` ; cartographie LD01-LD08 ↔ escouades = config versionnée ; jauge sans source = « non mesuré » (D2) ; pas de sync Linear directe ici.
- **Dépendances** : PRD-041, canaux Linear PRD-012/PRD-063. **Statut** : patched.

### PRD-054 — Pipeline Autonome GTD & DEAL (cat. 5)
- **Findings** : « télémétrie d'économie de temps et de tokens affichée en direct » — sans règle de mesure, c'est de la télémetrie fictive garantie ; « tri automatique routé » sans garde sur l'exécution.
- **Corrections** : télémétrie = valeurs mesurées uniquement (tokens réels si l'API les expose, durées horodatées), estimations libellées, défaut « non mesuré » ; le tri **propose** un routage, l'exécution reste soumise à approbation ; idempotence au rejeu (routage exactement une fois) ; traçage dans `action_receipts`.
- **Dépendances** : PRD-052 (verrous), PRD-062 (gates), PRD-051 (Jules), PRD-041. **Statut** : patched.

### PRD-055 — Dashboard Unifié de Convergence (cat. 5)
- **Findings** : « pont bidirectionnel avec Linear » sans canal désigné → risque d'un second client Linear en concurrence avec PRD-012 (cat. 1) ; agrégation de 6 sources sans déclaration de dépendances.
- **Corrections** : dépendances explicites (041, 051, 052, 054, 064) ; Linear via PRD-012 et/ou PRD-063 uniquement ; composant de présentation (lecture via services, zéro écriture directe) ; données réelles ou état vide/erreur explicite.
- **Dépendances** : PRD-012, PRD-063 + agrégés. **Statut** : patched.

### PRD-061 — A3 Skills Matrix & Compiler (cat. 6)
- **Findings** : chevauchements non arbitrés avec PRD-041 (roster) et PRD-091 (cat. 9, matrice de rôles B3) ; « capacités réelles de chaque agent » sans définition de « réel ».
- **Corrections** : PRD-061 **consomme** PRD-041, ne le redéfinit pas ; les rôles restent propriété de PRD-091 (arbitrage au contrat commun en cas de chevauchement) ; compétence non vérifiée = `unverified`, jamais « maîtrise » par défaut ; `.agents/skills/` à la racine du repo ; interface avec PRD-015 (skill tree existant, cat. 1) plutôt que doublon.
- **Dépendances** : PRD-041, PRD-091 (externe), PRD-015. **Statut** : patched.

### PRD-062 — A3 5D Hooks & Veto Circuit Breakers (cat. 6)
- **Findings** : les 4 critères étaient déclaratifs, non exécutables ; « horodatage strict Kentucky/Ohio » n'est pas un identifiant de fuseau ; rien ne disait où tourne le gate (risque : gate navigateur contournable) ; les preuves allaient dans `action_receipts` sans référence au propriétaire du schéma.
- **Corrections** : critères rendus exécutables (grep placeholders sur diff, `tsc --noEmit` strict, existence d'un `action_receipts`, fuseau IANA `America/New_York`) ; gate côté service Node, distinct de `npm run build` ; échec = statut bloqué persisté, jamais un warning ; déterministe au réévaluage ; rejet = livrable intact.
- **Dépendances** : PRD-052/011 (receipts). **Statut** : patched.

### PRD-063 — A3 Specialized MCP Tools Harness (cat. 6)
- **Findings (bloquant sécurité)** : HoldingStripeTool sans contrainte de localisation de clés (risque `VITE_`/bundle) ; client MCP placé côté interface alors que les serveurs MCP sont des processus (navigateur ne peut ni les lancer ni y parler) ; Playwright sans isolation définie.
- **Corrections** : MCP côté service Node, l'UI (PRD-065) affiche sans exécuter ; clés Stripe côté service uniquement, opérations de paiement = approbation humaine (porte irréversible) ; navigateur headless isolé (profil jetable) ; échec d'outil = erreur propagée, jamais un succès simulé ; coordonné avec PRD-012 pour Linear (un seul workspace).
- **Dépendances** : PRD-012 (externe), PRD-065 (consommateur). **Statut** : patched.

### PRD-064 — A3 Real Crons & Heartbeats (cat. 6)
- **Findings** : `src/services/telemetry/a3-cron-dispatcher.ts` tel quel = crons dans le bundle React (mort à la fermeture de l'onglet — ce ne sont pas des crons) ; persistance « SQLite/IndexedDB » ambiguë ; MOCK_CRONS à retirer si encore présent.
- **Corrections** : dispatcher = processus Node persistant, persistance dans le Blackboard SQLite (052/011), IndexedDB = cache de lecture ; chaque cron avec verrou anti-chevauchement (052), jitter, preuve horodatée `America/New_York` ; cron raté = rattrapé ou marqué `missed`, jamais prétendu exécuté ; reprise depuis le dernier état persisté.
- **Dépendances** : PRD-052, PRD-011, PRD-065 (vue). **Statut** : patched.

### PRD-065 — A3 Swarm Visualizer & Roster Plugin UI (cat. 6)
- **Findings** : statuts « live » sans source désignée → risque de statuts simulés ; jauge de budget tokens sans règle de mesure.
- **Corrections** : statuts issus de l'état réel du service (063/064) ; service injoignable = bannière d'erreur + statut `Unknown`, jamais de démo ; jauge mesurée ou « non mesuré » ; `ProofReceiptModal.tsx` lit des reçus réels du Blackboard ; lecture seule via service, zéro écriture directe SQLite.
- **Dépendances** : PRD-061, PRD-064, PRD-052, PRD-041. **Statut** : patched.

## Tests fonctionnels exigés (uniformisés)

- `npm run lint` (= `tsc --noEmit`) et `npm run build` exigés dans les 15 PRD.
- `lint` n'exécute **pas** de tests ; aucun script `test` n'existe dans `package.json` (mesuré) et aucun PRD n'en invente.
- Critères d'acceptation fonctionnels positifs ET négatifs ajoutés par PRD (voir sections « Correctif de délégation »).

## Limites et dépendances externes (hors de mon périmètre)

- `../CONTRAT-COMMUN.md` : **pointé par les 15 PRD, créé par le parent** — les PRD seront en lien mort jusqu'à sa création.
- PRD-011 (cat. 1) : propriétaire du schéma Blackboard — arbitrage parent requis si PRD-052/045 divergent.
- PRD-012 (cat. 1) : canal Linear unique (PRD-053/055/063 s'y coordonnent).
- PRD-091 (cat. 9) : propriétaire de la matrice de rôles (chevauchement PRD-061 à arbitrer).
- Exécution des PRD (création des fichiers `src/`) : hors mandat worker — audit et patch de docs uniquement.
- Correctifs rédigés sans accents (ASCII) : contenu prioritaire, aucun impact fonctionnel.

## Coverage

| Catégorie | PRD lus | PRD patchés | README |
|---|---|---|---|
| 4 — life-os-6-frameworks | 5/5 | 5/5 | patché (titre, apostrophes, contrat) |
| 5 — convergence-blackboard-jules-api | 5/5 | 5/5 | patché (titre, apostrophes, contrat) |
| 6 — a3-multidimensional-swarm-factory | 5/5 | 5/5 | patché (contrat) |

18 fichiers modifiés au total, 0 résidu détecté (vérification scriptée rc=0). Rapport homonyme : `REVIEW-GROUPE-4-6.json`.
