# PRD-081: B2 Council Engine & 8 VP Managers Roster

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Socle B2 — dépendants : PRD-082, PRD-085, PRD-075 (baromètre santé B2).

- **Dépendances PRD réelles** : PRD-041 (cat 4) est propriétaire du contrat roster des identités — ce PRD définit le roster des 8 VP Managers B2 mais ne doit pas recréer le mécanisme d'identités de PRD-041 ; il s'aligne dessus. PRD-091 (cat 9) est propriétaire de la matrice rôles B3 : pas de chevauchement. Aucune dépendance amont interne à la catégorie.
- **Risque mesuré** : `src/config/` n'existe pas (dossier à créer). `src/types/` existe et ne contient aucun type de gouvernance : aucune collision attendue.
- **Write_scope (chemins concrets)** : `src/types/b2-council.ts` (création), `src/config/b2-council.config.ts` (création du dossier config). Interdiction de modifier `ld01.store.ts` à `ld08.store.ts` et `agents.store.ts` existants.
- **Critères positifs** : `VpRole` union stricte des 8 rôles déclarés (growth_superman, sales_martian, product_flash, ops_batman, it_cyborg, finance_wonderwoman, people_greenlantern, legal_aquaman) ; `DomainHealthStatus` (score 0-100, blocages, lead/lag indicators) ; `VpCouncilDecision` typé ; la config expose exactement 8 VP et échoue au typage si un 9e apparaît ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun score de santé inventé à l'affichage (les données viennent des services aval) ; pas de télémétrie fictive ; pas de deuxième définition d'identité en concurrence avec PRD-041 ; pas de secret dans la config.
- **Sécurité & isolation** : les types sont purs (aucun I/O) ; les autorisations de chaque VP restent déclaratives, l'exécution réelle est réglée par PRD-072 (mandat B1) et PRD-091 (vecteurs B3).
- **Idempotence & persistance** : types + config statiques, pas d'état ; la santé de domaine persistée relève du blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas de second schéma, pas de substitution par IndexedDB navigateur par décret.
- **Reprise / rollback non destructif** : 2 fichiers exclusivement nouveaux ; rollback = suppression sans impact sur le shell ni les stores.

## Objectif
Creer l infrastructure TypeScript et le moteur de gouvernance meso representant le Conseil des 8 VP Managers B2.

## Specifications
- Definir src/types/b2-council.ts :
  - `VpRole`: 'growth_superman' | 'sales_martian' | 'product_flash' | 'ops_batman' | 'it_cyborg' | 'finance_wonderwoman' | 'people_greenlantern' | 'legal_aquaman'.
  - `DomainHealthStatus`: Score 0-100, blocages actifs, lead indicators, lag indicators.
  - `VpCouncilDecision`: Arbitrage collegial sur les priorites de la semaine.
- Exposer la configuration des 8 VP dans src/config/b2-council.config.ts.
- Valider avec npm run lint (tsc --noEmit) et npm run build.