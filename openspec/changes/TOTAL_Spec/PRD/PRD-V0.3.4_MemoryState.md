# PRD-V0.3.4 — Souveraineté des Données (Memory State)

> **SDD** : SDD-V0.3 · **TVR** : ✅T · ✅V (contrôle total = souveraineté) · ✅R

## User Stories

### US-26 : Export/Import State (Phase A)
> En tant qu'utilisateur, j'exporte l'état complet de mon OS en JSON et je peux le restaurer.

- [ ] Bouton "Export System State" → télécharge un fichier JSON agrégé de tous les stores
- [ ] Bouton "Import Backup" → upload JSON + hydratation de tous les stores
- [ ] Overview : tableau de tous les stores (nom, taille en items, dernière modification)

### US-27 : Hard Reset & Diagnostics (Phase B)
> En tant qu'utilisateur, je peux purger complètement mon système avec une confirmation sécurisée.

- [ ] Bouton "Hard Reset" avec modale de confirmation (taper "RESET" pour valider)
- [ ] Purge : localStorage + IndexedDB + reload page
- [ ] Section Diagnostics : compteur d'items par store (Settings: 6, GTD: 15, etc.)
