# PRD-V0.3.2 — Noyau d'Identité (Zora Core)

> **SDD** : SDD-V0.3 · **TVR** : ✅T · ✅V (personnalisation = engagement) · ✅R

## User Stories

### US-22 : User Profile (Phase A)
> En tant qu'utilisateur, mon profil (nom, avatar, timezone, locale) est configurable et persisté.

- [ ] Champs : displayName, avatar upload, timezone dropdown, locale FR/EN
- [ ] Avatar stocké en IndexedDB (blob)
- [ ] Timezone : liste Intl.supportedTimezoneNames

### US-23 : Life Wheel Configuration (Phase B)
> En tant qu'utilisateur, je personnalise les 8 domaines Life Wheel (labels, couleurs, icônes).

- [ ] 8 cartes domaines éditables (label + color picker + emoji/icône)
- [ ] Changements reflétés dans PARA et 12WY (cross-framework)
- [ ] Couleurs par défaut cohérentes avec le thème actif
