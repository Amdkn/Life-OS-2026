# PRD-053: Moteur Discovery Wheel (LD01 à LD08) & Swarms Métier

## Objectif
Connecter les 8 domaines de la Discovery Wheel (ZORA, Saru, Culber, Tilly, Stamets, Burnham, Reno, Georgiou) aux 8 escouades métier de Business OS (Guardians, Illuminati, Avengers, Fantastic4, Kang, Thunderbolts, X-Men, Eternals).

## Spécifications
- Créer src/apps/frameworks/wheel/DiscoveryWheelEngine.tsx.
- Cartographie dynamique associant chaque domaine de vie à son sous-système de valeur réelle et de protection.
- Synchronisation des jauges avec les livrables concrets (ex: LD01/Business -> JaaS Landing & OMK Mobile).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Zora/Discovery) ; la cartographie LD01-LD08 <-> escouades Business OS est une **donnee de configuration** (`src/config/`), pas de la logique dispersee dans les composants.

### Correction de portee (mesuree)
- `src/apps/life-wheel/` existe deja (contenu substantiel) : implementer `DiscoveryWheelEngine.tsx` dedans, pas sous `src/apps/frameworks/wheel/`. Pas de second moteur de roue.

### Donnees reelles (D2)
- Les jauges reflètent des livrables **mesures** (ex. LD01/Business <-> JaaS Landing & OMK Mobile : liens vers artefacts reels). Une jauge sans donnee source affiche « non mesure » — jamais une valeur plausible.

### Criteres d'acceptation
- Positifs : lint+build ; les 8 domaines LD01-LD08 mappes vers les 8 escouades ; chaque jauge cite sa source de donnee.
- Negatifs : pas de score invente ; pas de synchronisation Linear directe ici (canaux : PRD-012 cat. 1 et PRD-063) ; pas de secret.

### Persistance / reprise
- Cartographie versionnee en config (diffable) ; jauges alimentees par les stores existants ; rollback = `git checkout`.
