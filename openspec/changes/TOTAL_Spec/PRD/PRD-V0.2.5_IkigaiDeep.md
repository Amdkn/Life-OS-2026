# PRD-V0.2.5 — Ikigai Deep Routing

> **SDD** : SDD-V0.2_Micro · **Dépendance** : V0.2.4 (Header Menus)
> **TVR** : ✅T (store + routing state) · ✅V (premier framework complet avec seed data) · ✅R (pattern reproductible)

---

## Problème
L'App Ikigai affiche des Piliers dans la sidebar mais n'a aucun système d'Horizons. Les items ne sont pas filtrables par combinaison Horizon × Pilier. Pas de données d'exemple.

## User Stories

### US-4 : Data Model & Seed Data (Phase A)
> En tant que développeur, le store Ikigai contient des types stricts et 20 items cohérents de seed data.

- [ ] Type `IkigaiItem { id, title, description, pillar, horizon, alignmentLevel }`
- [ ] Enums `Pillar` et `Horizon`
- [ ] 20 seed items (4 piliers × 5 horizons) — contenu métier Senior Dev
- [ ] Store `fw-ikigai.store.ts` enrichi

### US-5 : Routing Horizons ↔ Piliers (Phase B)
> En tant qu'utilisateur, je clique sur H3 dans le header et Passion dans la sidebar → je vois uniquement les items H3/Passion.

- [ ] State `activeHorizon` + `activePillar` dans store
- [ ] Click Header Menu Horizon → filtre par horizon
- [ ] Click Sidebar Pilier → filtre par pilier
- [ ] Combinaison : `/ikigai/H3/passion`
- [ ] Breadcrumb dynamique : `Ikigai > H3 > Passion`

### US-6 : Cardes & Detail (Phase C)
> En tant qu'utilisateur, je vois les items en grille et je clique pour ouvrir un panel de détail.

- [ ] Card : titre, description, pilier (badge couleur), alignment bar
- [ ] Grille responsive 3 colonnes
- [ ] Detail slide-in panel avec édition

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| Routing par URL (SPA) | Routing par state Zustand |
| Items hardcodés sans type | Enums strict + TypeScript |
| Seed data incohérentes | Seed data métier réaliste (Senior Dev) |

## Fichiers Impactés
| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `fw-ikigai.store.ts` (types + seed data) |
| B | MODIFY | `IkigaiApp.tsx` (routing state) |
| C | NEW | `IkigaiItemCard.tsx`, `IkigaiDetailPanel.tsx` |
