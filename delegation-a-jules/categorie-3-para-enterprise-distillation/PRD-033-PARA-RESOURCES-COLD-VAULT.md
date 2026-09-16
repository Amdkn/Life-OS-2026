# PRD-033 — Coffre de Ressources Découplé (Resources Vault & SOPs)


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (liaison bidirectionnelle vers PRJ-PICARD-*) ; PRD-032 (domaine Life Wheel) ; PRD-034 (une resource peut être distillée en archive).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/para/components/ResourceCard.tsx` (vérifié) ; type réel `ResourceType = 'book' | 'tool' | 'contact' | 'template' | 'course' | 'article' | 'video' | 'other'` dans `fw-para.store.ts` — **'sop' n'existe pas** : étendre le type ou mapper SOP->'template', ne pas prétendre que le champ existe.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** recherche et filtrage dynamiques ; injection d'une ressource avec liaison immédiate à un projet ; liaison bidirectionnelle cohérente (projet.resources <-> ressource.projects).

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune URL/Path fictive ; les ressources canoniques citées (SOPs Marina, Ownerbook OMK, Manifeste Summers's Verse, Spécifications Plane/Linear) sont des ENTRÉES de catalogue (titre + type + provenance), pas des documents à importer depuis le disque privé ; pas de doublon de liaison.

**Sécurité / isolation / idempotence / persistance :** pas de secrets ni identifiants dans les resources ; URL externes validées comme chaînes, pas exécutées ; idempotence de la liaison par identifiant.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** ajout d'entités : rollback = retirer les records ; aucune donnée projet touchée.

## 1. Valeur et Remplacement
- **Origine V2 :** `03_Resources_Berman` et les SOPs opérationnelles (Marina SOPs, Ownerbooks OMK).
- **Obstacle dans Life OS :** L'onglet **RESOURCES** est vide (0 items).
- **Remplacement :** Créer la bibliothèque de ressources classifiées par type (`book`, `tool`, `template`, `sop`, `contact`) avec liaison bidirectionnelle vers les Projets Picard.

## 2. Périmètre et Implémentation
- Modélisation de l'entité `Resource` enrichie :
  - Type, URL/Path, Domaine Life Wheel, Projets associés.
- Intégration des ressources canoniques :
  - SOPs de nettoyage Marina Cleaning.
  - Ownerbook OMK Services.
  - Manifeste Summers's Verse.
  - Spécifications Plane & Linear.

## 3. Acceptation Fonctionnelle
- Recherche et filtrage dynamique dans `ResourceCard.tsx`.
- Injection d'une nouvelle ressource avec liaison immédiate à un projet.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
