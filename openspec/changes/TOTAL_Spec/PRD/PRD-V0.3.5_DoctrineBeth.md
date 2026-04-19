# PRD-V0.3.5 — Doctrine Beth (Permissions & Veto)

> **SDD** : SDD-V0.3 · **TVR** : ✅T · ✅V (veto = safety net humaine) · ✅R

## User Stories

### US-28 : Veto Rules (Phase A)
> En tant qu'utilisateur, je configure quelles actions nécessitent une validation manuelle.

- [ ] Liste des actions avec toggle approval on/off
- [ ] Actions par défaut : "Delete Data", "Export External", "Agent Execute", "Hard Reset"
- [ ] Persistance des rules dans le store

### US-29 : Permission Matrix (Phase B)
> En tant qu'utilisateur, je vois un tableau Agent × Action montrant qui peut faire quoi.

- [ ] Matrice visuelle : lignes = agents (Rick, Amy, Clara...), colonnes = actions
- [ ] Checkboxes pour activer/désactiver les permissions
- [ ] Vue d'ensemble : qui peut bypasser le veto
