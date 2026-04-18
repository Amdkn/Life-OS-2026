# PRD-V0.2.6 — PARA Complete

> **SDD** : SDD-V0.2_Micro · **Dépendance** : V0.2.4 (Header Menus)
> **TVR** : ✅T (cards + routing) · ✅V (PARA est le système central de gestion) · ✅R (pattern cartes réutilisable)

---

## Problème
PARA affiche des placeholders vides. Pas de cartes projets, pas de décomposition Areas par domaines Life Wheel, pas de Resources typées, pas de lien Archive → DEAL.

## User Stories

### US-7 : Data Model Enrichi (Phase A)
> En tant que développeur, le store PARA contient les types Project, Area (8 domaines × 8 piliers), Resource (enum + custom), et des seed data cross-framework.

- [ ] `Project { id, title, status, domain, pillars[], resources[], archivedAt? }`
- [ ] `Area { domain: LifeWheelDomain, pillars: Pillar[] }` — 8 domaines × 8 piliers
- [ ] `Resource { id, title, type: ResourceType, category, linkedProjects[], linkedPillars[] }`
- [ ] `ResourceType` enum prédéfini + custom
- [ ] `LifeWheelDomain` enum (8 domaines identiques Life Wheel)
- [ ] Seed data : 8 projets, 64 piliers, 16 resources

### US-8 : Cartes Projets Clickables (Phase B)
> En tant qu'utilisateur, je clique sur une carte projet → sous-page détail avec resources liées et piliers.

- [ ] `ProjectCard.tsx` : titre, status, domaine, % completion
- [ ] Grille avec filtrage par domaine (Header Menu)
- [ ] `ProjectDetail.tsx` : sous-page interne, resources liées, timeline

### US-9 : Areas = Domaines × Piliers (Phase C)
> En tant qu'utilisateur, la page Areas affiche 8 cartes domaines Life Wheel, chacune décomposée en 8 sous-cartes piliers calqués sur Business Pulse.

- [ ] `DomainCard.tsx` : icône Life Wheel, 8 sous-cards piliers
- [ ] Décomposition : Growth, Operations, Product, Finance, People, IT, Legal, Meta
- [ ] Header Menu domaine → filtre les piliers affichés

### US-10 : Resources & Archives (Phase D)
> En tant qu'utilisateur, les Resources sont typées et linkées. L'Archive n'est pas un cimetière mais le point de départ des transformations DEAL → Muse.

- [ ] Resources groupées par type (enum filter + "Add Type")
- [ ] Archives avec indicateur "→ Muse potential"
- [ ] Bouton "Transform via DEAL" → ouvre DEAL app

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| Projets sans domaine Life Wheel | Chaque projet lié à un domaine |
| Areas avec 1 seul niveau | 2 niveaux : Domaine → 8 Piliers |
| Resources non-linkées | Resources liées à Projects ET Pillars |
| Archive = suppression | Archive = Muse candidate |

## Fichiers Impactés
| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `fw-para.store.ts` |
| B | NEW | `ProjectCard.tsx`, `ProjectDetail.tsx` |
| C | NEW | `DomainCard.tsx`, `PillarSubCard.tsx` |
| D | NEW | `ResourceCard.tsx`, `ArchiveView.tsx` |
