# PRD-044: Matrice DEAL Protostar (Élimination & Automatisation)

## Objectif
Fournir le tableau de bord d'optimisation opérationnelle selon la méthode DEAL (Definition, Elimination, Automation, Liberation - Holo-Janeway & Protostar).

## Spécifications
- Créer src/apps/frameworks/deal/DealProtostarView.tsx.
- Interface pour classifier les goulots d'étranglement : Éliminer (Rok-Tahk), Automatiser (Zero), Déléguer/Libérer (Gwyn).
- Connecter aux suggestions proactives d'Antigravity et Jules.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Protostar) ; store existant `src/stores/fw-deal.store.ts` (mesure).
- Suggestions proactives : la classification locale n'attend pas PRD-051. Les délégations de code déjà autorisées passent par PRD-051/056 lorsqu'ils sont intégrés, sans nouvelle approbation humaine de convenance. Une suggestion hors mandat ou irréversible exige un arbitrage distinct. La vue n'appelle jamais Jules directement.

### Correction de portee (mesuree)
- `src/apps/deal/` existe deja : implementer `DealProtostarView.tsx` dedans, pas sous `src/apps/frameworks/deal/`.

### Criteres d'acceptation
- Positifs : lint+build ; classification Eliminer / Automatiser / Deleguer persistee et reclassifiable ; chaque suggestion affiche sa source.
- Negatifs : pas de declenchement automatique de session Jules depuis cette vue ; pas de metrique inventee ; pas de secret.

### Idempotence / persistance / reprise
- Classification persistee de facon additive ; une reclassification ecrase deterministiquement l'ancienne valeur ; rollback code = `git checkout`.
