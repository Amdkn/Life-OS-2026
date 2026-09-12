# PRD-034 — Cycle de Vie des Archives & Radar d'Entropie

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
