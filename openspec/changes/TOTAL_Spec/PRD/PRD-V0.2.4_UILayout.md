# PRD-V0.2.4 — UI Layout & Header Menus

> **SDD** : SDD-V0.2_Micro · **Priorité** : 🔴 Critique (bloque V0.2.5-V0.2.9)
> **TVR** : ✅T (composants React simples) · ✅V (libère l'espace pour tous les frameworks) · ✅R (partageable entre apps)

---

## Problème
Les headers des Apps Framework sont encombrés par des barres de recherche, empêchant l'ajout de menus de navigation (Horizons Ikigai, Domaines PARA, Semaines 12WY). La sidebar CC et l'AI Panel ne peuvent pas être fermées.

## User Stories

### US-1 : CC Toggle Sidebar & AI Panel (Phase A)
> En tant qu'utilisateur, je peux fermer/rouvrir la sidebar et l'AI Panel du Command Center pour maximiser l'espace de contenu.

- [ ] Chevron `«` sur le bord droit de la sidebar → toggle collapse
- [ ] Chevron `»` sur le bord gauche de l'AI Panel → toggle collapse
- [ ] Contenu principal occupe 100% quand un panel est fermé
- [ ] Animation transition 300ms
- [ ] État persist dans le state local du composant

### US-2 : Search Bar → Sidebar (Phase B)
> En tant qu'utilisateur, la recherche est accessible dans la sidebar de chaque App, filtrant globalement tous les onglets.

- [ ] Composant `SidebarSearch.tsx` partagé entre toutes les Apps
- [ ] Filtre global (cherche dans tous les onglets)
- [ ] Placé sous les tabs de navigation dans la sidebar
- [ ] Icône loupe + input transparent, style Archo-Futuriste
- [ ] Apps migrées : GTD, Ikigai, PARA, 12WY, DEAL

### US-3 : Header Menus Framework (Phase C)
> En tant qu'utilisateur, chaque App Framework expose un menu horizontal dans le header libéré.

- [ ] **Ikigai** : `[H1, H3, H10, H30, H90]`
- [ ] **PARA** : `[All, Business, Finance, Health, Cognition, Creativity, Habitat, Relations, Impact]` scroll horizontal
- [ ] **12WY** : `[W1..W12, All]`
- [ ] **GTD** : `[All, @Home, @Work, @Errands, Waiting, Someday]`
- [ ] **DEAL** : `[Definition, Elimination, Automation, Liberation]`

## Anti-Patterns

| ❌ Interdit | ✅ Requis |
|-------------|----------|
| Sidebar toujours visible | Toggle chevron avec animation |
| Search dans le header | Search dans la sidebar |
| Menu header hardcodé par app | Composant `HeaderFilterBar.tsx` partagé |
| Filtres qui rechargent la page | Filtres par state Zustand |

## Fichiers Impactés

| Phase | Action | Fichier |
|-------|--------|---------|
| A | MODIFY | `CommandCenter.tsx` |
| B | NEW | `SidebarSearch.tsx` |
| B | MODIFY | `GtdApp.tsx`, `IkigaiApp.tsx`, `ParaApp.tsx`, `TwelveWeekApp.tsx`, `DealApp.tsx` |
| C | NEW | `HeaderFilterBar.tsx` |
| C | MODIFY | Tous les *App.tsx (ajout des filtres header) |
