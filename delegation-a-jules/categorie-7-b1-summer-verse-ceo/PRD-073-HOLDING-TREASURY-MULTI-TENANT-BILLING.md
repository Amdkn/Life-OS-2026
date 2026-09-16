# PRD-073: Holding Treasury & Multi-Tenant Billing Engine

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). PRD à risque financier — lecture obligatoire avant toute exécution.

- **Dépendances PRD réelles** : PRD-071 (modules `billing`, `holding_ledger`) ; PRD-072 (aucune écriture de trésorerie sans ticket B1) ; PRD-011 (schéma blackboard pour la persistance du grand livre) ; consommateur : PRD-074 (factures parents) et PRD-075 (baromètre CA).
- **Risque mesuré** : express est en dependencies mais **aucun fichier serveur n'existe** dans le repo. Ce PRD est fondamentalement backend : moteur de facturation Stripe/ACH, ventilation comptable, écritures de grand livre = service Node, jamais React.
- **Write_scope (chemins concrets)** : `src/server/treasury/holding-treasury-engine.ts` (moteur backend, à créer), `src/server/treasury/ledger.ts` (écritures), UI de lecture seule `src/apps/franchise/billing/HoldingTreasuryEngine.tsx` (dossiers à créer — conserve le chemin initial comme interface UI uniquement).
- **Critères positifs** : chaque écriture comptable porte une clé d'idempotence et un solde recalculable à partir du journal ; ventilation déterministe vers le grand livre holding ; seuils de trésorerie configurés en source ; `npm run lint` + `npm run build` à 0 erreur (le build Vite n'entre pas dans src/server/, vérifier aussi `npx tsc --noEmit`).
- **Critères négatifs** : aucune clé Stripe/ACH dans `VITE_*` ni dans le bundle navigateur ; aucun calcul de marge ou d'encaissement dans React ; sans connexion réelle, l'UI affiche un état vide/erreur explicite — jamais des chiffres de démonstration ni de télémetrie fictive ; pas d'exécution réelle de virement (porte irréversible, hors mandat automatisé).
- **Sécurité & isolation** : secrets uniquement côté service (variables d'environnement serveur) ; isolation multi-tenant stricte par franchise sur chaque requête ; journal d'audit append-only.
- **Idempotence & persistance** : grand livre SQLite côté service avec clés de déduplication (idempotency-key Stripe côté backend) ; écritures immuables + contre-passation, jamais de mise à jour en place ; schéma propriété PRD-011, pas de second schéma.
- **Reprise / rollback non destructif** : une contre-passation annule une écriture, jamais une suppression ; rollback du PRD = retrait du module sans altérer le shell ni les stores existants.

## Objectif
Fusionner le moteur de paiement d ABC Child Care avec la tresorerie inter-societes d Alikaly Bana Holding.

## Specifications
- Creer src/server/treasury/holding-treasury-engine.ts (moteur backend ; HoldingTreasuryEngine.tsx reste la vue de lecture seule).
- Gestion des flux de tresorerie consolides :
  - Encaissements recurrents (frais de garde, cotisations cooperative, prestations nettoyage).
  - Ventilation automatique vers le grand livre de la Holding.
  - Calcul des marges nettes et alertes de seuil de tresorerie.
- Valider avec npm run lint (tsc --noEmit) et npm run build ; le moteur backend est vérifié par npx tsc --noEmit (pas de script `test` dans package.json — ne pas prétendre en exécuter).