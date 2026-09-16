# Catégorie 3 — Distillation PARA Enterprise V2 (Projets Picard, Areas, Ressources, Archives)


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Ce README est un index des 5 PRD du dossier** : les correctifs détaillés (dépendances, write_scope, critères positifs/négatifs, sécurité, rollback) vivent dans chaque PRD, section « Correctif de délégation ».

**Dépendances PRD :** PRD-031 à PRD-035 de ce dossier ; dépendances croisées listées dans chaque PRD.

**Périmètre d'écriture :** ce README et les PRD du dossier uniquement.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback :** revert du README ; corrections purement éditoriales.

## 1. Vision et Objectif Stratégique
Rapatrier la substantifique moelle de **PARA Enterprise V2** (485 000+ fichiers distillés) dans Life OS sans importer les 11 Go de `node_modules` toxiques :
- Éliminer l'état vide (« 0 Active Projects, 0 Items ») du Dashboard PARA (`127.0.0.1:4444`).
- Intégrer les 9 Projets Picard canoniques (OMK Business OS, ABC OS, RILCOT, Alikaly Bana, Marina Cleaning, Cerritos Plane, ClaudeClaw, Graphify Out, OMK Services).
- Rapatrier les 4 escadres Jerry d'Areas Spock (J01 Prime, J02 Bio, J03 Nexus, J04 Solarpunk).
- Structurer le coffre de Ressources (SOPs, Runbooks) et le cycle de vie des Archives.
- Sceller la synchronisation avec l'Ontologie RDF Graham (`70_Onthologies/`).

## 2. Découpage des 5 PRDs
- **PRD-031 :** Distillation des Projets Picard V2 vers Life OS (`fw-para.store.ts`).
- **PRD-032 :** Intégration des Domaines d'Action (Areas Spock & Jerry Pulse).
- **PRD-033 :** Coffre de Ressources Découplé (Resources Vault & SOPs).
- **PRD-034 :** Cycle de Vie des Archives & Radar d'Entropie.
- **PRD-035 :** Synchronisation Bidirectionnelle PARA <=> Ontologie RDF Graham.
