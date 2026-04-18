# PRD-V0.2.7 — 12 Week Year Disciplines

> **SDD** : SDD-V0.2_Micro · **Dépendance** : V0.2.4 (Header Menus Semaines)
> **TVR** : ✅T (store + vues simples) · ✅V (suivi de performance des agents) · ✅R (reproductible par trimestre)

---

## Problème
L'App 12WY est un squelette sans les 5 disciplines. Pas de suivi par semaine, pas d'affectation d'agents, pas de mesure de performance.

## User Stories

### US-11 : Data Model & Seed Data (Phase A)
> En tant que développeur, le store 12WY contient les types Goal, WeeklyScore, et les 5 disciplines avec seed data.

- [ ] `Goal { id, title, discipline, weekScores[], assignedAgent? }`
- [ ] `Discipline = Vision, Planning, ProcessControl, Measurement, TimeUse`
- [ ] `WeeklyScore { week: 1-12, goalId, score: 0-100, notes }`
- [ ] Seed data : 5 goals, scores W1-W4 pré-remplis

### US-12 : 5 Vues Disciplines (Phase B)
> En tant qu'utilisateur, je navigue entre les 5 disciplines via la sidebar, chacune avec sa vue spécifique.

- [ ] Vision : goals long terme + alignment Life Wheel
- [ ] Planning : breakdown goals → tactics/semaine
- [ ] Process Control : WAM tracker
- [ ] Measurement : scores sparklines
- [ ] Time Use : allocation temps par agent (pie chart)

### US-13 : Filtres Semaines & Agents (Phase C)
> En tant qu'utilisateur, le Header Menu filtre par semaine [W1..W12] et je peux filtrer par agent assigné.

- [ ] Header Menu : `[W1..W12, All]`
- [ ] Filtre agent : USS Orville, Discovery, SNW, etc.

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| Un seul onglet "Dashboard" | 5 onglets disciplines |
| Scores sans visualisation | Sparklines par semaine |
| Pas d'agent assigné | Agent optionnel par goal |

## Fichiers Impactés
| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `fw-12wy.store.ts` |
| B | NEW | Vues par discipline (5 composants) |
| C | MODIFY | `TwelveWeekApp.tsx` (filtres) |
