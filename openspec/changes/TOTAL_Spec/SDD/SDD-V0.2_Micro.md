# SDD V0.2 Micro — Phase Micro Complète (V0.2.4→V0.2.9)

> **Auteur** : GravityClaw (A'"0) · **Date** : 2026-03-18
> **Statut** : ✅ Validé par A0 (Amadeus)
> **Convention** : `V0.2.X.Y.Z` = Version.Itération.Phase(alpha).Étape(num)

---

## Contexte

La V0.2.1-V0.2.3 a consolidé le Shell (Window Manager natif, Breadcrumbs dynamiques, CC Sidebar ↔ Framework Apps). Le Web OS est stable. Les 6 itérations suivantes développent **en profondeur** chaque Framework App, avec des seed data interconnectées entre frameworks.

### Décisions Souveraines (A0)
- **CC Toggle** : Chevron `«`/`»` sur le bord de la sidebar/AI Panel, contenu 100% à la fermeture
- **Search** : Filtre global à l'app (tous les onglets), déplacé dans la sidebar
- **Ikigai Routing** : `/ikigai/H3/passion` — Horizons contiennent des items filtrés par Pilier
- **PARA Areas** : Calquées sur la Life Wheel (8 domaines × 8 piliers calqués sur Business Pulse)
- **Resources** : Enum prédéfini + bouton d'ajout custom
- **Seed Data** : Globales et cohérentes cross-framework

---

## V0.2.4 — UI Layout & Header Menus

> Libérer l'espace header, créer les filtres et menus de navigation horizontaux.

### Phase A : CC Toggle Sidebar & AI Panel
| Étape | Description |
|-------|------------|
| V0.2.4.A.1 | Ajouter un chevron `«` sur le bord droit de la sidebar CC (onClick toggle) |
| V0.2.4.A.2 | Ajouter un chevron `»` sur le bord gauche de l'AI Panel (onClick toggle) |
| V0.2.4.A.3 | État `sidebarCollapsed` + `aiPanelCollapsed` dans CommandCenter state |
| V0.2.4.A.4 | Animation CSS `width: 0` + `overflow: hidden` avec transition 300ms |
| V0.2.4.A.5 | Gate : `tsc --noEmit` + test visuel (sidebar open/close, content 100%) |

### Phase B : Search Bar → Sidebar (Toutes Apps)
| Étape | Description |
|-------|------------|
| V0.2.4.B.1 | Créer composant `SidebarSearch.tsx` partagé (input + filtre global) |
| V0.2.4.B.2 | Migrer la search de `GtdApp.tsx` header → sidebar (sous les tabs) |
| V0.2.4.B.3 | Migrer la search de `IkigaiApp.tsx` header → sidebar |
| V0.2.4.B.4 | Migrer la search de `ParaApp.tsx` header → sidebar |
| V0.2.4.B.5 | Migrer la search de `TwelveWeekApp.tsx` et `DealApp.tsx` → sidebar |
| V0.2.4.B.6 | Gate : Toutes les searchbars dans les sidebars, headers libérés |

### Phase C : Header Menus par Framework
| Étape | Description |
|-------|------------|
| V0.2.4.C.1 | **Ikigai** : Header Menu = `[H1, H3, H10, H30, H90]` (onglets Horizons) |
| V0.2.4.C.2 | **PARA** : Header Menu = Domaines Life Wheel `[All, Business, Finance, Health, Cognition, Creativity, Habitat, Relations, Impact]` en scroll horizontal |
| V0.2.4.C.3 | **12WY** : Header Menu = Filtres Semaines `[W1, W2, ..., W12, All]` |
| V0.2.4.C.4 | **GTD** : Header Menu = Filtres Contexte `[All, @Home, @Work, @Errands, Waiting, Someday]` |
| V0.2.4.C.5 | **DEAL** : Header Menu = Phases `[Definition, Elimination, Automation, Liberation]` |
| V0.2.4.C.6 | Gate : Tous les Header Menus visibles et cliquables |

---

## V0.2.5 — Ikigai Deep Routing

> Routing profond Piliers ↔ Horizons avec seed data cohérentes.

### Phase A : Data Model & Seed Data
| Étape | Description |
|-------|------------|
| V0.2.5.A.1 | Définir types `IkigaiItem { id, title, description, pillar, horizon, alignmentLevel }` |
| V0.2.5.A.2 | Définir enum `Pillar = Craft, Mission, Passion, Vocation` |
| V0.2.5.A.3 | Définir enum `Horizon = H1, H3, H10, H30, H90` |
| V0.2.5.A.4 | Seed data : 20 items répartis (4 piliers × 5 horizons) — contenu cohérent Senior Dev |
| V0.2.5.A.5 | Gate : Store `fw-ikigai.store.ts` avec seed data chargées |

### Phase B : Routing Profond
| Étape | Description |
|-------|------------|
| V0.2.5.B.1 | État `activeHorizon` + `activePillar` dans le store Ikigai |
| V0.2.5.B.2 | Navigation : Click Horizon (Header Menu) → filtre la liste par horizon |
| V0.2.5.B.3 | Navigation : Click Pillar (Sidebar) → filtre la liste par pilier |
| V0.2.5.B.4 | Navigation combinée : `/ikigai/H3/passion` → filtre horizon + pilier |
| V0.2.5.B.5 | Breadcrumb dynamique : `Ikigai > H3 > Passion` |

### Phase C : UI des Items
| Étape | Description |
|-------|------------|
| V0.2.5.C.1 | Card `IkigaiItemCard.tsx` : titre, description, pilier (badge couleur), alignment bar |
| V0.2.5.C.2 | Vue grille responsive (3 colonnes desktop, 1 mobile) |
| V0.2.5.C.3 | Detail panel : clic sur card → slide-in panel avec édition |
| V0.2.5.C.4 | Gate : Navigation complète entre Horizons et Piliers avec seed data |

---

## V0.2.6 — PARA Complete

> Cartes projets, domaines Life Wheel × piliers Business Pulse, resources typées.

### Phase A : Data Model PARA Enrichi
| Étape | Description |
|-------|------------|
| V0.2.6.A.1 | Type `Project { id, title, status, domain, pillars[], resources[], archivedAt? }` |
| V0.2.6.A.2 | Type `Area { domain: LifeWheelDomain, pillars: Pillar[] }` — 8 domaines × 8 piliers |
| V0.2.6.A.3 | Type `Resource { id, title, type: ResourceType, category, linkedProjects[], linkedPillars[] }` |
| V0.2.6.A.4 | Enum `ResourceType = Book, Tool, Contact, Template, Course, Article, Video, Other` + custom |
| V0.2.6.A.5 | Enum `LifeWheelDomain = Business, Finance, Health, Cognition, Creativity, Habitat, Relations, Impact` |
| V0.2.6.A.6 | Seed data : 8 projets (1 par domaine), 64 piliers (8×8), 16 resources |

### Phase B : Projects — Cartes Clickables
| Étape | Description |
|-------|------------|
| V0.2.6.B.1 | `ProjectCard.tsx` : titre, status badge, domaine, % completion |
| V0.2.6.B.2 | Vue grille des projets avec filtrage par domaine (Header Menu) |
| V0.2.6.B.3 | `ProjectDetail.tsx` : sous-page détail (clic sur card → navigation interne) |
| V0.2.6.B.4 | ProjectDetail : linked resources, linked pillars, timeline |

### Phase C : Areas — Domaines × Piliers
| Étape | Description |
|-------|------------|
| V0.2.6.C.1 | `DomainCard.tsx` : nom du domaine, icône Life Wheel, 8 sous-cards piliers |
| V0.2.6.C.2 | Vue domaines : 8 cartes (Business, Finance, etc.) avec expansion |
| V0.2.6.C.3 | Sous-cartes piliers : Growth, Operations, Product, Finance, People, IT, Legal, Meta |
| V0.2.6.C.4 | Filtrage : Header Menu domaine → affiche les piliers du domaine sélectionné |

### Phase D : Resources & Archives
| Étape | Description |
|-------|------------|
| V0.2.6.D.1 | `ResourceCard.tsx` : titre, type badge, catégorie, linked items |
| V0.2.6.D.2 | Grille resources groupées par type avec enum filter + bouton "Add Type" |
| V0.2.6.D.3 | Archives : Vue des projets archivés avec indicateur "→ Muse potential" |
| V0.2.6.D.4 | Lien Archive → DEAL : bouton "Transform via DEAL" → ouvre DEAL app |
| V0.2.6.D.5 | Gate : Navigation complète Projects↔Areas↔Resources↔Archives |

---

## V0.2.7 — 12 Week Year Disciplines

> 5 disciplines complètes pour la répartition de charges entre agents Life OS.

### Phase A : Data Model 12WY
| Étape | Description |
|-------|------------|
| V0.2.7.A.1 | Type `Goal { id, title, discipline, weekScores: number[], assignedAgent? }` |
| V0.2.7.A.2 | Enum `Discipline = Vision, Planning, ProcessControl, Measurement, TimeUse` |
| V0.2.7.A.3 | Type `WeeklyScore { week: 1-12, goalId, score: 0-100, notes }` |
| V0.2.7.A.4 | Seed data : 5 goals (1 par discipline), scores semaines 1-4 pré-remplis |

### Phase B : Vue Disciplines
| Étape | Description |
|-------|------------|
| V0.2.7.B.1 | Onglet Vision : goals à long terme avec alignment Life Wheel |
| V0.2.7.B.2 | Onglet Planning : breakdown goals → tactics par semaine |
| V0.2.7.B.3 | Onglet Process Control : WAM (Weekly Accountability Meeting) tracker |
| V0.2.7.B.4 | Onglet Measurement : tableau des scores par semaine (sparklines) |
| V0.2.7.B.5 | Onglet Time Use : allocation temps par agent/framework (pie chart) |

### Phase C : Filtres Semaines & Agents
| Étape | Description |
|-------|------------|
| V0.2.7.C.1 | Header Menu semaines : `[W1..W12, All]` filtre la vue active |
| V0.2.7.C.2 | Filtrage par agent assigné (USS Orville, Discovery, SNW, etc.) |
| V0.2.7.C.3 | Gate : 5 disciplines navigables, scores + filtres semaines fonctionnels |

---

## V0.2.8 — GTD Complete

> 5 étapes GTD complètes avec traçabilité des actions et décisions.

### Phase A : Data Model GTD Enrichi
| Étape | Description |
|-------|------------|
| V0.2.8.A.1 | Type `GTDItem { id, title, type: ItemType, context, project?, nextAction?, waitingFor?, someday? }` |
| V0.2.8.A.2 | Enum `ItemType = InboxItem, NextAction, WaitingFor, SomedayMaybe, Reference, Project` |
| V0.2.8.A.3 | Type `ActionLog { id, itemId, action, timestamp, decision, reasoning }` (traçabilité) |
| V0.2.8.A.4 | Seed data : 15 items répartis dans les 5 étapes, 10 action logs |

### Phase B : 5 Étapes GTD (Pages)
| Étape | Description |
|-------|------------|
| V0.2.8.B.1 | **Capture** : Inbox rapide (input → enter → ajout immédiat) |
| V0.2.8.B.2 | **Clarify** : Wizard de clarification (Is it actionable? → 2 min? → Delegate? → Defer?) |
| V0.2.8.B.3 | **Organize** : Listes par contexte (`@Home, @Work, @Errands`) + projets |
| V0.2.8.B.4 | **Review** : Weekly Review checklist (items non-traités, projets stagnants) |
| V0.2.8.B.5 | **Engage** : Vue "Now" filtrée par énergie/temps/contexte |

### Phase C : Traçabilité & Filtres
| Étape | Description |
|-------|------------|
| V0.2.8.C.1 | Action Log sidebar : timeline des décisions pour chaque item |
| V0.2.8.C.2 | Header Menu contextes : `[All, @Home, @Work, @Errands, Waiting, Someday]` |
| V0.2.8.C.3 | Gate : 5 étapes GTD navigables, traçabilité des actions visible |

---

## V0.2.9 — DEAL Workflow (4H Work Week)

> Transformation des projets PARA via le cycle D.E.A.L vers les Muses.

### Phase A : Data Model DEAL
| Étape | Description |
|-------|------------|
| V0.2.9.A.1 | Type `DEALItem { id, projectId, phase: DEALPhase, tasks[], museCandidate? }` |
| V0.2.9.A.2 | Enum `DEALPhase = Definition, Elimination, Automation, Liberation` |
| V0.2.9.A.3 | Type `MuseCandidate { projectId, revenue?, automation%, liberationDate? }` |
| V0.2.9.A.4 | Seed data : 3 projets PARA en transformation DEAL, 1 muse candidate |

### Phase B : 4 Étapes DEAL (Pages)
| Étape | Description |
|-------|------------|
| V0.2.9.B.1 | **Definition** : Import projets depuis PARA, define 80/20 tasks |
| V0.2.9.B.2 | **Elimination** : Checklist "Not To Do" — tasks à supprimer |
| V0.2.9.B.3 | **Automation** : Tasks automatisables avec agent assigné |
| V0.2.9.B.4 | **Liberation** : Timeline de libération + lien vers Archive PARA |

### Phase C : Connexion PARA → 12WY → Muse
| Étape | Description |
|-------|------------|
| V0.2.9.C.1 | Import automatique des projets PARA-archived |
| V0.2.9.C.2 | Lien 12WY : goals complétés → projets DEAL candidats |
| V0.2.9.C.3 | Muse Tracker : dashboard des projets transformés en muses |
| V0.2.9.C.4 | Gate finale : cycle complet PARA→12WY→GTD→DEAL→Muse vérifiable |

---

## Chiffres

| Itération | Phases | Étapes |
|-----------|--------|--------|
| V0.2.4 | 3 (A, B, C) | 17 |
| V0.2.5 | 3 (A, B, C) | 14 |
| V0.2.6 | 4 (A, B, C, D) | 17 |
| V0.2.7 | 3 (A, B, C) | 11 |
| V0.2.8 | 3 (A, B, C) | 10 |
| V0.2.9 | 3 (A, B, C) | 11 |
| **Total** | **19** | **80** |
