# PRD-062: A3 5D Hooks & Veto Circuit Breakers

## Objectif
Empêcher les agents A3 d'introduire des régressions, des mocks vides ou des fuites de données grâce à des validation gates déterministes.

## Spécifications
- Créer src/services/hooks/a3-validation-gate.ts.
- Valider les 4 critères obligatoires d'un livrable A3 :
  1. Zéro placeholder (TODO, FIXME, mock non résolu).
  2. Typage strict sans type any permissif.
  3. Preuve d'exécution enregistrée (action_receipts).
  4. Horodatage strict Kentucky/Ohio (EDT/EST).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Enregistre ses preuves dans `action_receipts` du Blackboard (PRD-052 moteur, PRD-011 schema).
- Execution **cote service Node** (hook/gate) : un gate dans le navigateur ne protege rien (contournable) et le build Vite n'est pas un garde-fou runtime.

### Specification des 4 criteres (rendue executable)
1. Zero placeholder : detection automatisee (recherche `TODO|FIXME|mock` sur le diff livre) — resultat mesure, pas declare.
2. Zero `any` : `tsc --noEmit` strict (+ regle de lint dediee si disponible).
3. Preuve d'execution : un `action_receipts` correspondant doit exister, sinon rejet.
4. Horodatage : fuseau IANA `America/New_York` (EDT/EST) — « Kentucky/Ohio » designe la zone geographique, le code utilise l'identifiant IANA.

### Criteres d'acceptation
- Positifs : un livrable conforme passe ; chacun des 4 criteres produit un verdict explicite ; gate distinct de `npm run build` (le build ne remplace pas le gate).
- Negatifs : pas de contournement silencieux (echec de gate = statut bloque persiste, pas un warning) ; pas de PII dans les receipts.

### Idempotence / reprise
- Reevaluer un meme livrable donne le meme verdict (deterministe) ; un rejet laisse le livrable intact sur disque (rien d'ecrase) ; rollback code = `git checkout` du gate.
