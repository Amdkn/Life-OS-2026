# PRD-003 — Historique distinct du plan actif


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-002 (provenance et horizons) ; PRD-005 (le score ne compte que les engagements du plan actif, jamais les cartes historiques importées) ; PRD-001 pour la persistance locale.

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/twelve-week/components/GoalCommandCard.tsx`, `GoalForgeModal.tsx`, store 12WY `src/stores/fw-12wy.store.ts`, source `vue.html` (racine repo).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** second import sans doublon ; aucun objectif actif créé par le seul import ; sélection utilisateur explicite retrouvée identique après reload ; historique intact après édition du plan actif.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucun OBJ-01..07 inventé ; aucune activation ni antidatation automatique de septembre 2026 ; les huit jauges vertes de l'ancien sprint restent une citation historique, jamais une condition de succès ; aucune bannière de validation humaine générée par le code.

**Sécurité / isolation / idempotence / persistance :** identifiants d'import stables explicitement non canoniques liés à leur repère de source ; espace historique séparé du plan actif ; idempotence par identifiant déterministe.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** l'import est additif et isolé : rollback = suppression des enregistrements d'import par leur marqueur de provenance, sans toucher le plan actif ni l'historique Ikigai.

## Valeur et remplacement
Obstacle : faux engagements préremplis. Remplacer les sept objectifs codés en dur et les alias inventés par un import explicite, traçable et idempotent des cartes historiques de `vue.html`.

## Périmètre et données
Réutiliser `src/apps/twelve-week/components/GoalCommandCard.tsx`, `GoalForgeModal.tsx` et le store 12WY existant. Ne pas recréer les cartes.
Ne pas inventer OBJ-01..07. Préserver tout identifiant réellement disponible dans la source ; pour une carte sans identifiant, créer un identifiant technique d'import stable explicitement non canonique, lié à son repère de source. Ne pas confondre les IDs de référence des actions hebdomadaires avec ceux des cartes.
Importer en espace historique séparé du plan actif, sans duplication au second import. Conserver titre, provenance, statut et liens proposés. Une sélection utilisateur explicite seule crée un engagement courant ; elle n'est pas une certification humaine du canon.
L'ancien sprint qui exigeait huit jauges vertes reste une citation historique, jamais une condition de succès. Pour une revue courante : faits sourcés, besoins, maintenir/avancer/reporter ; santé inconnue ne bloque pas mécaniquement l'économie et ne devient pas verte.
Conserver la contradiction W4/W13. Dates de cycle choisies explicitement ; aucune activation ou antidatation automatique de septembre 2026. W1-W12 et buffer W13 sont relatifs au cycle sélectionné. Filtrer LD01-LD08 sans réduire Life OS à Business.

## Acceptation fonctionnelle
Importer deux fois sans doublon ; aucun objectif actif à l'import seul. Sélectionner un objectif, recharger et retrouver le même engagement. Historique intact après édition du plan. Tester conflit calendrier, source manquante et filtres vides ; aucun statut ratifié créé par le code.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.
