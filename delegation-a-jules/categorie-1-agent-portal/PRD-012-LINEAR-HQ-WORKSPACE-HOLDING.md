# PRD-012 — Linear comme Holding de Workspaces & QG de Flotte


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (outbox Blackboard pour la file hors-ligne ; `linear_team_id` câblé dans le schéma blackboard) ; PRD-024 (scopes pour isoler les identifiants de mapping) ; PRD-014 (items ScoreCard : même source que les payloads Linear).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : aucun code Linear dans `src/lib` au 2026-09-12 (recherche 'linear' vide) ; `src/stores/fw-para.store.ts`, `src/stores/fw-12wy.store.ts` comme sources des données mappées.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** mapping bidirectionnel sans écrasement ; items ScoreCard transformés en payloads Linear valides ; résolution des statuts Todo/In Progress/Done sans conflit ; mise en file locale hors-ligne puis rejeu à la reconnexion.

**Critères d'acceptation négatifs (doivent rester vrais) :** aucune clé API Linear dans le bundle navigateur ni dans un `VITE_*` (le secret vit dans l'environnement du service local, jamais dans le code client) ; aucun écrasement distant sans conflit visible ; aucune écriture Linear depuis un composant React en direct.

**Sécurité / isolation / idempotence / persistance :** le token Linear appartient au service backend local, jamais au bundle ; retries bornés et idempotents sur la file ; le statut local reste la vérité du store même si Linear est indisponible.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** adaptateur isolé : rollback = désactiver l'appel et vider la file sans toucher les stores ; le mapping est additif (champs de liaison), jamais destructeur sur les tâches locales.

## 1. Valeur et Remplacement
- **Obstacle :** Dispersion des tâches entre les vues locales sans synchronisation avec le QG stratégique Linear.
- **Remplacement :** Établir l'adaptateur de synchronisation Linear (`src/lib/linear/`) reliant les projets PARA et les domaines LD01-LD08 aux équipes et cycles Linear.

## 2. Périmètre et Données
- Mapping bidirectionnel sans écrasement :
  - Équipes Linear <=> Domaines Life Wheel & Projets PARA.
  - Issues Linear <=> Tâches ScoreCard / Tactiques 12WY.
- Préservation du mode hors-ligne : mise en file d'attente locale (Outbox Blackboard) en cas d'absence de réseau.

## 3. Acceptation Fonctionnelle
- Transformation des items ScoreCard en payloads Linear valides.
- Résolution sans conflit des statuts Todo / In Progress / Review / Done.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
