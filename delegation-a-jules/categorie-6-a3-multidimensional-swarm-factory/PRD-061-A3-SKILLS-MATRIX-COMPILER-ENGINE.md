# PRD-061: A3 Skills Matrix & Compiler Engine

## Objectif
Standardiser et compiler les compétences des agents A3 des six Frameworks définis par PRD-041 (dont PARA/Enterprise, sans confondre Beth/Morty avec des frameworks) et des huit escouades Business OS documentées. PRD-041 porte les identités ; ne pas les recréer ici.

## Spécifications
- Créer src/types/a3-skills.ts définissant A3SkillManifest, ToolRequirement, ExecutionCapability.
- Créer le registre central src/config/a3-skills-registry.ts référençant les capacités réelles de chaque agent.
- Générateur d'arbre de compétences (SkillTree.tsx) visualisant les dépendances et niveaux de maîtrise.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- **Consomme le contrat roster PRD-041** (identites vaisseaux/agents) — ne le redefine pas.
- **PRD-091 (cat. 9, matrice polymorphe B3)** est proprietaire de la matrice de roles : PRD-061 compile les **competences A3**, pas la matrice de roles ; tout chevauchement s'arbitre au contrat commun.

### Correction de portee
- `SkillTree.tsx` : s'interfacer avec l'arbre existant (PRD-015, cat. 1, relation diagram/skill tree) plutot que creer un doublon ; en tout etat de cause, pas de second format de manifeste.

### Capacites reelles (D2)
- Le registre ne declare que des **capacites verifiees** (outils reellement accessibles a l'agent a l'execution). Une competence non verifiee est marquee `unverified` — jamais « maitrise » par defaut.

### Criteres d'acceptation
- Positifs : lint+build ; registre type strict ; l'arbre visualise les dependances reelles entre manifestes ; `.agents/skills/` vit a la racine du repo (hors `src/`).
- Negatifs : pas de recreation du roster PRD-041 ni de la matrice PRD-091 ; pas de `any` ; pas de competence fantome affichee comme disponible.

### Reprise
- Ajoutitif (`src/types/a3-skills.ts`, `src/config/a3-skills-registry.ts`, `SkillTree.tsx`) ; rollback = suppression des fichiers crees, non destructif.
