# PRD-034 — Cycle de Vie des Archives & Radar d'Entropie


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-031 (archiveProject s'applique aux PRJ-PICARD-* comme aux projets créés) ; PRD-033 (les resources des projets archivés restent consultables) ; PRD-035 (distillation vers l'ontologie au lieu de la perte sèche).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : **`src/apps/para/components/ArchiveRadar.tsx` EXISTE DÉJÀ** (vérifié au 2026-09-12) : le PRD dit « Implémenter le composant ArchiveRadar.tsx » — remplacer par « étendre l'existant », pas de second fichier du même nom ; onglet 'archives' déjà présent dans `fw-para.store.ts` (activeTab) ; présence d'une action `archiveProject` dans le store : A SOURCER avant d'ajouter.
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** transition active->archived avec raison et lessonsLearned horodatées ; désarchivage possible ; historique consultable.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de suppression destructrice au déplacement en archives ; pas de réécriture de l'historique ; pas de distillation automatique vers OKF sans validation humaine (le verrou humain reste) ; pas d'archivage automatique par entropie calculée sans seuil sourcé.

**Sécurité / isolation / idempotence / persistance :** archivage réversible (désarchivage) ; horodatage et raison obligatoires ; le bilan d'apprentissage est une saisie utilisateur, jamais générée.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** archiveProject est réversible par design : rollback = désarchiver ; revert du composant/store sans perte de données.

## 1. Valeur et Remplacement
- **Origine V2 :** Projets abandonnés ou dormants accumulant de la dette technique.
- **Obstacle dans Life OS :** L'onglet **ARCHIVES** est inerte ; pas de protocole pour archiver proprement un projet avec bilan d'apprentissage.
- **Remplacement :** Implémenter le composant `ArchiveRadar.tsx` et le protocole d'archivage avec horodatage, raison d'arrêt et synthèse de liquidation (anti-paperclip).

## 2. Périmètre et Implémentation
- Action `archiveProject(id, reason, lessonsLearned)` dans `fw-para.store.ts`.
- Vue dédiée aux projets archivés avec possibilité de désarchivage ou de distillation vers la mémoire OKF.
- Liaison avec le journal DOX d'audit.

## 3. Acceptation Fonctionnelle
- Déplacement fluide d'un projet de `active` à `archived`.
- Visualisation de l'historique et des motifs d'archivage.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
