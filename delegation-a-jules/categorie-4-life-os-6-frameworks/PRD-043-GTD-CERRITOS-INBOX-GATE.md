# PRD-043: Pipeline GTD Cerritos (Capture, Clarify, Engage)

## Objectif
Remplacer le simple bloc-notes par le flux structuré GTD inspiré de l'équipage Cerritos (Mariner, Boimler, Rutherford, Tendi, Freeman).

## Spécifications
- Créer src/apps/frameworks/gtd/GtdCerritosPipeline.tsx.
- Implémenter les 5 étapes : Capture (Mariner), Clarify (Boimler), Organize (Rutherford), Review (Tendi), Engage (Freeman).
- Permettre la promotion d'un item GTD vers un Projet ou une Tâche 12WY.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Consomme PRD-041 (roster Cerritos). Promotion 12WY via le store existant `src/stores/fw-12wy.store.ts` (mesure) — pas de second store 12WY.

### Correction de portee (mesuree)
- `src/apps/gtd/` existe deja : implementer `GtdCerritosPipeline.tsx` **dedans** (ex. `src/apps/gtd/GtdCerritosPipeline.tsx`), pas sous `src/apps/frameworks/gtd/`.

### Criteres d'acceptation
- Positifs : lint+build ; les 5 etapes Capture / Clarify / Organize / Review / Engage sont parcourables ; un item promu vers projet ou tache 12WY quitte l'inbox sans doublon.
- Negatifs : pas d'appel reseau dans ce composant ; pas de secret ; pas d'ecriture directe SQLite (le pont Blackboard est PRD-045) ; pas d'ecrasement d'une tache 12WY existante a la promotion.

### Idempotence / persistance / reprise
- Persistance IndexedDB additive ; la promotion change un statut (reversible par reclassement), elle ne supprime pas l'item ; rollback code = `git checkout`.
