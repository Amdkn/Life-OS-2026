# PRD-V0.2.8 — GTD Complete

> **SDD** : SDD-V0.2_Micro · **Dépendance** : V0.2.4 (Header Menus Contextes)
> **TVR** : ✅T (wizard + listes) · ✅V (traçabilité = accountability) · ✅R (pattern GTD universel)

---

## Problème
L'App GTD n'a qu'un Dashboard et une Inbox basique. Les 5 étapes GTD (Capture, Clarify, Organize, Review, Engage) ne sont pas implémentées. Aucune traçabilité des décisions.

## User Stories

### US-14 : Data Model GTD Enrichi (Phase A)
> En tant que développeur, le store GTD contient les types enrichis avec traçabilité.

- [ ] `GTDItem { id, title, type, context, project?, nextAction?, waitingFor?, someday? }`
- [ ] `ItemType = InboxItem, NextAction, WaitingFor, SomedayMaybe, Reference, Project`
- [ ] `ActionLog { id, itemId, action, timestamp, decision, reasoning }`
- [ ] Seed data : 15 items, 10 action logs

### US-15 : 5 Étapes GTD (Phase B)
> En tant qu'utilisateur, chaque étape GTD est une page fonctionnelle.

- [ ] **Capture** : input rapide → enter → ajout inbox immédiat
- [ ] **Clarify** : wizard (actionable? → 2 min? → delegate? → defer?)
- [ ] **Organize** : listes par contexte + projets
- [ ] **Review** : weekly review checklist
- [ ] **Engage** : vue "Now" filtrée par énergie/temps/contexte

### US-16 : Traçabilité & Filtres (Phase C)
> En tant qu'utilisateur, chaque item a un historique de décisions visible.

- [ ] Action Log sidebar : timeline des décisions
- [ ] Header Menu contextes : `[All, @Home, @Work, @Errands, Waiting, Someday]`

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| GTD = simple todo list | GTD = processus en 5 étapes |
| Actions sans trace | ActionLog avec reasoning |
| Pas de Clarify wizard | Arbre de décision interactif |

## Fichiers Impactés
| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `fw-gtd.store.ts` |
| B | NEW | `CaptureView`, `ClarifyWizard`, `OrganizeView`, `ReviewView`, `EngageView` |
| C | NEW | `ActionLogPanel.tsx` |
