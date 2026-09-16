# PRD-041: Modélisation Canonique des 6 Frameworks & Roster des Vaisseaux

## Objectif
Créer les contrats TypeScript et interfaces des six frameworks : Ikigai/Orville, Life Wheel/Discovery (Zora), PARA/Enterprise, 12WY/SNW, GTD/Cerritos, DEAL/Protostar. Beth/Morty sont des rôles de gouvernance, pas un septième framework ni un remplacement de PARA. Vérifier les identifiants des manifests existants avant de figer les IDs ; un équipage non documenté reste A SOURCER.

## Spécifications
- Créer src/types/frameworks.ts définissant FrameworkId, VesselConfig, AgentCrewMember.
- Exposer le roster complet des agents par vaisseau dans src/config/vessels.config.ts.
- Intégrer un sélecteur de Frameworks dans la barre latérale ou le Header de Life OS.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **PRD-041 est le PROPRIETAIRE du contrat roster** (`FrameworkId`, `VesselConfig`, `AgentCrewMember`). PRD-042 a 045 (cat. 4), PRD-061 (cat. 6) et PRD-091 (cat. 9, matrice de roles B3) doivent **consommer** ces types, jamais les redeclarer.
- Aucune autre dependance : ce PRD est la racine du groupe.

### Perimetre d'ecriture (write_scope)
- `src/types/frameworks.ts` (creation — n'existe pas au 2026-09-12, mesure).
- `src/config/vessels.config.ts` (creation ; `src/config/` existe et est vide, mesure).
- Selecteur : modification minimale du composant header/sidebar existant ; pas de refonte de navigation.

### Criteres d'acceptation
- Positifs : `npm run lint` et `npm run build` passent ; le roster expose les 6 vaisseaux FW01-FW06 ; types exportes importables sans cycle d'import.
- Negatifs : **pas** de second schema roster ailleurs (aucun doublon de `VesselConfig`) ; pas de donnees d'equipage codees en dur dans les composants ; pas de `any`.

### Securite / isolation
- Configuration statique uniquement : aucun secret, aucun appel reseau, aucune PII.

### Idempotence / persistance / reprise
- Fichiers purs et additifs. Rollback : désactiver leur intégration et conserver le patch sur branche dédiée ; aucun effacement de données. Première tranche : contrats/config/tests seulement ; header/sidebar intégrés ensuite par leur writer unique.
