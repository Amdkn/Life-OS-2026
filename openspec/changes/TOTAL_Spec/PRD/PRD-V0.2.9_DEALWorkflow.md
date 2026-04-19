# PRD-V0.2.9 — DEAL Workflow (4H Work Week)

> **SDD** : SDD-V0.2_Micro · **Dépendance** : V0.2.6 (PARA Archives)
> **TVR** : ✅T (import PARA + state) · ✅V (cycle complet → Muse = liberté) · ✅R (reproductible par projet)

---

## Problème
L'App DEAL est un placeholder. Pas de workflow D.E.A.L, pas de lien avec PARA, pas de concept de Muse (4H Work Week). Les projets archivés dans PARA meurent au lieu d'évoluer.

## User Stories

### US-17 : Data Model DEAL (Phase A)
> En tant que développeur, le store DEAL gère des items liés à PARA avec un pipeline vers Muse.

- [ ] `DEALItem { id, projectId, phase, tasks[], museCandidate? }`
- [ ] `DEALPhase = Definition, Elimination, Automation, Liberation`
- [ ] `MuseCandidate { projectId, revenue?, automation%, liberationDate? }`
- [ ] Seed data : 3 projets DEAL, 1 muse candidate

### US-18 : 4 Étapes DEAL (Phase B)
> En tant qu'utilisateur, chaque phase DEAL guide la transformation du projet.

- [ ] **Definition** : import depuis PARA, 80/20 tasks
- [ ] **Elimination** : checklist "Not To Do"
- [ ] **Automation** : tasks automatisables + agent assigné
- [ ] **Liberation** : timeline de libération + lien Archive PARA

### US-19 : Connexion PARA → 12WY → Muse (Phase C)
> En tant qu'utilisateur, le cycle complet est vérifiable : Projet PARA → Goal 12WY → Action GTD → Transformation DEAL → Muse.

- [ ] Import auto projets PARA-archived
- [ ] Lien 12WY goals complétés → DEAL candidats
- [ ] Muse Tracker dashboard
- [ ] Cycle complet vérifiable

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| DEAL isolé | DEAL connecté à PARA + 12WY |
| Archive = fin | Archive = début transformation Muse |
| Pas d'automation tracking | % automation + agent assigné |

## Fichiers Impactés
| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `fw-deal.store.ts` |
| B | NEW | `DefinitionView`, `EliminationView`, `AutomationView`, `LiberationView` |
| C | NEW | `MuseTracker.tsx` |
