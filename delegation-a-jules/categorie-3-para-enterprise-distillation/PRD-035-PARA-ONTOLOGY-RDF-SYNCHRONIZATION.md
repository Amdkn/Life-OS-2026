# PRD-035 — Synchronisation Bidirectionnelle PARA <=> Ontologie RDF Graham


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031/032/033/034 (les exports portent projets, areas, resources, archives — une seule source : fw-para.store) ; aucun doublon d'export ailleurs.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/stores/fw-para.store.ts` comme seule source ; **les chemins V3 cités (`70_Onthologies/sujets/*.ttl`, `onto_gate.py`) sont HORS REPO (corpus privé)** : le repo ne peut pas les lire au runtime.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** export propre de l'état PARA au format Turtle/JSON-LD ; triplets aspace:Document/aspace:covers/aspace:partOf générés depuis le store ; vérification de cohérence exécutée quand l'environnement la fournit.

**Critères d'acceptation négatifs (doivent rester vrais) :** **la ligne d'acceptation citée ne couvre que `npm run build` : ajouter `npm run lint` (tsc --noEmit, pas un test)** ; aucune synchronisation bidirectionnelle au runtime avec le disque privé (l'import V3->UI est une opération manuelle/scriptée hors repo, jamais un watcher) ; aucun triplet inventé pour combler un projet absent.

**Sécurité / isolation / idempotence / persistance :** export en lecture seule : aucun écriture du store depuis l'ontologie sans validation humaine ; l'export ne contient ni secrets ni corpus privé ; idempotence de l'export (sortie déterministe pour un état donné).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** exportateur additif : rollback = supprimer le module et le dossier exports/ généré.

## 1. Valeur et Remplacement
- **Origine V3 :** `70_Onthologies/sujets/01_Projects_Picard.ttl` (938 documents) et `02_Areas_Spock.ttl` (263 documents).
- **Obstacle dans Life OS :** L'interface UI de Life OS ignore les triplets RDF de l'ontologie de Graham et vice versa.
- **Remplacement :** Mettre en place la passerelle d'export/sync entre le store `fw-para.store.ts` et le graphe RDF (`aspace:Document`, `aspace:covers`, `aspace:partOf`).

## 2. Périmètre et Implémentation
- Exportateur JSON-LD / Turtle des projets et areas actifs.
- Vérification de cohérence avec `onto_gate.py`.
- Intégration de la télémétrie de synchronisation dans le header PARA.

## 3. Acceptation Fonctionnelle
- Export propre de l'état PARA au format Turtle validé par Graham.
- Zéro régression TypeScript (`npm run build` à 0 erreur).
