# PRD-032 — Intégration des Domaines d'Action (Areas Spock & Jerry Pulse)


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (les projets se rattachent aux areas) ; PRD-033/034 ; `fw-wheel.store.ts` et stores `ld01..ld08` pour les domaines LD01-LD08.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/para/components/DomainCard.tsx` (vérifié) ; **`AreasView` NON RETROUVÉ dans src/apps/para au 2026-09-12** — l'onglet 'areas' existe dans `fw-para.store.ts` (activeTab), localiser le composant réel ou créer la vue : ne pas présumer le fichier.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** filtrage interactif par Area/domaine sans carte orpheline ; chaque Area liée à son escadre Jerry canonique ; projets rattachés affichés par pilier.

**Critères d'acceptation négatifs (doivent rester vrais) :** « Structuration des 8 Areas » vs liste de 4 lignes regroupées : trancher explicitement (8 domaines LD01-LD08 mappés sur 4 escadres J01-J04) et aligner le texte ; aucune métrique de responsabilité ou veille inventée sans source ; pas de doublon avec les domaines du Wheel.

**Sécurité / isolation / idempotence / persistance :** liens Area<=>escadre déclarés comme données du repo (pas de disque privé) ; idempotence de la structuration.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** liaisons additives : rollback = retirer les champs de liaison ; DomainCard retombe sur son affichage actuel.

## 1. Valeur et Remplacement
- **Origine V2 :** `02_Areas_Spock` (J01 Jerry Prime LD01, J02 Jerry Bio LD03/04, J03 Jerry Nexus LD02/06, J04 Jerry Solarpunk LD05/07/08).
- **Obstacle dans Life OS :** L'onglet **AREAS** (`AreasView` / `DomainCard.tsx`) n'a pas de liens vivants vers les capitaines B1 Jerry et leurs standards (FIP Standard, E-Myth, Vitality).
- **Remplacement :** Relier chaque Area de Life OS à son escadre Jerry canonique et afficher les métriques de responsabilité et de veille.

## 2. Périmètre et Implémentation
- Structuration des 8 Areas dans `fw-para.store.ts` :
  - Business (J01 Prime / E-Myth SYSTEMIZE).
  - Finance & Habitat (J03 Nexus / FIP Standard).
  - Health & Cognition (J02 Bio / Vitalité & Nutrition).
  - Relations, Creativity, Impact (J04 Solarpunk / Sunday Uplink).
- Affichage des projets rattachés par pilier dans `DomainCard.tsx`.

## 3. Acceptation Fonctionnelle
- Filtrage interactif par Area et par domaine sans carte orpheline.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
