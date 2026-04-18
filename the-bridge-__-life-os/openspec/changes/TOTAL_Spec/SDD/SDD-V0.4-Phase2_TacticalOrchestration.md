# SDD V0.4 Phase 2 — "Tactical Orchestration" (PARA Profond)

> **Auteur** : GravityClaw (A'"0) · **Date** : 2026-03-22
> **Statut** : ✅ Validé par A0 (Amadeus) via Pre-SDD Gemini Chrome
> **Prérequis** : V0.4.1-V0.4.3 (Phase 1 exécutée — Unification, Command Card, Routage)
> **Convention** : `V0.4.X.Y.Z` = Version.Itération.Phase(alpha).Étape(num)

---

## Intention (Le Pourquoi)

Le squelette de l'Enterprise est connecté à sa mémoire (IndexedDB). Il faut maintenant donner au vaisseau sa capacité de commandement tactique : un scanner d'alignement entre l'intention (Life Wheel) et l'action (GTD/12WY), des ponts vivants (plus de coquilles vides), et un cordon ombilical vers DEAL pour le recyclage.

## Audit Pré-Forge (Observations Code Source)

| Store | Champ `projectId` | État |
|-------|-------------------|------|
| `fw-gtd.store.ts` → `GTDItem` | ❌ Absent (`linkedLd` existe mais pas `projectId`) | **À ajouter (V0.4.4)** |
| `fw-12wy.store.ts` → `Goal` | ❌ Absent | **À ajouter (V0.4.4)** |
| `fw-deal.store.ts` → `DealItem` | ✅ `projectId?: string` | Prêt |
| `fw-deal.store.ts` → `createDefinitionFromText` | ✅ Existe | Prêt |

## Décisions Souveraines (A0)

- **Hotfix ItemModal** : Le bouton `+ New` doit respecter l'onglet actif — Projects crée un Project, Resources crée une Resource, Archives est interdit (lecture seule).
- **Enrichissement Cross-Store** : Ajouter `projectId?: string` dans `GTDItem` et `Goal` — champs optionnels, backward-compatible.
- **Areas sont IMMUABLES** : Les 8 Domaines × 8 Piliers sont des constantes. Pas de CRUD sur les Areas. Le bouton `+ New Area` est supprimé.
- **Pas de chargement massif** : Les bridges lisent le store Zustand en mémoire via selector ciblé — pas de requête IndexedDB directe.

---

## V0.4.4 — UX Picard : Tableau de Bord Tactique (Ponts Vivants)

> Hotfix ItemModal + GTD Bridge + 12WY Bridge fonctionnels dans la Command Card.

### Phase A : Hotfix ItemModal & CRUD Typé
| Étape | Description |
|-------|------------|
| V0.4.4.A.1 | Modifier `ParaApp.tsx` : le bouton `+ New` détecte `activeTab` et passe le `type` correct à `ItemModal` (Project / Resource). Désactiver sur `archives` et `areas`. |
| V0.4.4.A.2 | Modifier `ItemModal.tsx` : le `onSave` callback dispatch vers `addProject()` ou `addResource()` selon le `type` prop, avec un schéma de données différent pour chaque. |
| V0.4.4.A.3 | Ajouter `addResource` et `deleteProject` dans `fw-para.store.ts` avec sync LD. |
| V0.4.4.A.4 | Gate : Créer un Projet → visible dans Projects. Créer une Resource → visible dans Resources. LE bouton N'apparaît PAS sur Areas/Archives. |

### Phase B : Enrichissement GTD & 12WY (projectId)
| Étape | Description |
|-------|------------|
| V0.4.4.B.1 | Modifier `fw-gtd.store.ts` : ajouter `projectId?: string` au type `GTDItem`. |
| V0.4.4.B.2 | Modifier `fw-12wy.store.ts` : ajouter `projectId?: string` au type `Goal`. |
| V0.4.4.B.3 | Gate : `npx tsc --noEmit` — pas de régression. |

### Phase C : GTD Bridge Vivant
| Étape | Description |
|-------|------------|
| V0.4.4.C.1 | Modifier `FrameworkBridge.tsx` : pour `target='GTD'`, lire `useGtdStore(s => s.items.filter(i => i.projectId === projectId))`. Afficher le nombre réel. |
| V0.4.4.C.2 | Ajouter état visuel : si `count === 0` → badge rouge "⚠ Stalled" (pas d'action liée). Si `count > 0` → badge vert avec le nombre. |
| V0.4.4.C.3 | Ajouter Quick-Add : input texte + bouton dans le bridge GTD → appelle `useGtdStore.addItem(content)` avec `projectId` pré-rempli. |
| V0.4.4.C.4 | Gate : Bridge affiche les vraies actions GTD + Quick-Add fonctionne. |

### Phase D : 12WY Bridge Vivant
| Étape | Description |
|-------|------------|
| V0.4.4.D.1 | Modifier `FrameworkBridge.tsx` : pour `target='12WY'`, lire `useTwelveWeekStore(s => s.goals.filter(g => g.projectId === projectId))`. |
| V0.4.4.D.2 | Afficher le titre du goal et son status. Badge "On Track" / "Behind" selon `targetWeek` vs semaine courante. |
| V0.4.4.D.3 | Gate : Bridge 12WY affiche les vrais goals. |

---

## V0.4.5 — UX Spock : Laboratoire Areas & Business Pulse

> Areas immuables. Pillar Dashboard de surveillance. Routines GTD affichées.

### Phase A : Immutabilité des Areas
| Étape | Description |
|-------|------------|
| V0.4.5.A.1 | Modifier `ParaApp.tsx` : masquer le bouton `+ New` quand `activeTab === 'areas'`. |
| V0.4.5.A.2 | Gate : Le bouton disparaît sur l'onglet Areas. |

### Phase B : Pillar Dashboard
| Étape | Description |
|-------|------------|
| V0.4.5.B.1 | Créer `PillarDashboard.tsx` : composant qui affiche pour un pilier donné : la liste des projets actifs liés, le nombre d'actions GTD récurrentes, et une jauge d'activité manuelle (slider 0-100). |
| V0.4.5.B.2 | Modifier `DomainCard.tsx` : le clic sur un pilier ouvre `PillarDashboard` au lieu d'un simple filtre. |
| V0.4.5.B.3 | `PillarDashboard` : afficher les projets via `useParaStore(s => s.projects.filter(p => p.pillars.includes(pillar) && p.domain === domain))`. |
| V0.4.5.B.4 | `PillarDashboard` : afficher les items GTD via `useGtdStore(s => s.items.filter(i => i.linkedLd === DOMAIN_TO_LD[domain] && i.status === 'actionable'))`. |
| V0.4.5.B.5 | Gate : Clic pilier → dashboard visible avec projets et actions GTD. |

---

## V0.4.6 — Le Scanner de la Flotte (PARA Dashboard)

> Balance Life Wheel visuelle. Friction Log. Airlock DEAL.

### Phase A : Balance Life Wheel
| Étape | Description |
|-------|------------|
| V0.4.6.A.1 | Créer `LifeWheelBalance.tsx` : composant barres horizontales montrant la répartition des projets actifs par domaine (8 barres, couleurs DomainConfig). |
| V0.4.6.A.2 | Intégrer dans `Dashboard.tsx` (onglet Overview de PARA). |
| V0.4.6.A.3 | Gate : Le graphe affiche les compteurs réels. |

### Phase B : Friction Log
| Étape | Description |
|-------|------------|
| V0.4.6.B.1 | Créer `FrictionLog.tsx` : liste des projets en souffrance. Critères : `progress` non modifié > 14 jours OU 0 actions GTD liées (via `projectId`). Badge rouge "STALLED" / orange "NO ACTIONS". |
| V0.4.6.B.2 | Intégrer dans `Dashboard.tsx` sous la Balance. |
| V0.4.6.B.3 | Gate : La liste affiche les projets en souffrance. |

### Phase C : Airlock DEAL (Archive Radar)
| Étape | Description |
|-------|------------|
| V0.4.6.C.1 | Créer `ArchiveRadar.tsx` : section dans Dashboard listant les projets récemment `completed` ou `archived`. Bouton "Transfer to DEAL" → `createDefinitionFromText(title)` + `openApp('deal')`. |
| V0.4.6.C.2 | Intégrer dans `Dashboard.tsx`. |
| V0.4.6.C.3 | Gate Finale : Dashboard complet avec 3 widgets (Balance + Friction + Airlock). |

---

## Chiffres

| Itération | Phases | Étapes |
|-----------|--------|--------|
| V0.4.4 Ponts Vivants | 4 (A, B, C, D) | 14 |
| V0.4.5 Laboratoire Spock | 2 (A, B) | 7 |
| V0.4.6 Scanner de Flotte | 3 (A, B, C) | 8 |
| **Total Phase 2** | **9** | **29** |

## Fichiers Impactés

### Nouveaux
- `src/apps/para/components/PillarDashboard.tsx`
- `src/apps/para/components/LifeWheelBalance.tsx`
- `src/apps/para/components/FrictionLog.tsx`
- `src/apps/para/components/ArchiveRadar.tsx`

### Modifiés
- `src/stores/fw-gtd.store.ts` — Ajout `projectId?: string` à GTDItem
- `src/stores/fw-12wy.store.ts` — Ajout `projectId?: string` à Goal
- `src/stores/fw-para.store.ts` — Ajout `addResource`, `deleteProject`
- `src/apps/para/ParaApp.tsx` — Hotfix bouton New + masquage Areas
- `src/apps/para/components/ItemModal.tsx` — Dispatch typé selon entity
- `src/apps/para/components/FrameworkBridge.tsx` — Ponts vivants GTD/12WY
- `src/apps/para/components/DomainCard.tsx` — Pillar Dashboard ouverture
- `src/apps/para/pages/Dashboard.tsx` — Intégration 3 widgets
