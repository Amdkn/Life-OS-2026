# SDD V0.4 — "The Enterprise Computer" (PARA Profond)

> **Auteur** : GravityClaw (A'"0) · **Date** : 2026-03-22
> **Statut** : ✅ Validé par A0 (Amadeus) via Pre-SDD Gemini Chrome + Audit Technique
> **Convention** : `V0.4.X.Y.Z` = Version.Itération.Phase(alpha).Étape(num)
> **Dépendances** : V0.2.6 (PARA base), V0.3.2 (DomainConfig from Zora Core)
> **Audit** : Double Modèle de Données identifié — `fw-para.store.ts` (Project enrichi) vs `ldXX.store.ts` (ParaItem simplifié)

---

## Intention (Le Pourquoi)

PARA n'est pas une simple application — c'est l'**Ordinateur de Bord de l'USS Enterprise**. Sa mission est d'orchestrer les entités du vaisseau selon des rôles stricts, permettant aux instances autonomes de Jerry (Macro) et Summer (Micro/Nano) d'opérer sans chaos.

### Mythologie Sémantique (DDD Narratif)
| Rôle Enterprise | Module PARA | Comportement |
|-----------------|-------------|-------------|
| **Picard** (Capitaine) | Projects | Exécution, alignement stratégique, instances "Summers" |
| **Spock** (Scientifique) | Areas | Gardien de la Roue de la Vie, équilibre, instances "Jerry" par Domaine |
| **Geordi** (Ingénieur) | Resources | Fournisseur d'outils, templates, savoirs |
| **Data** (Mémoire) | Archives | Mémoire immortelle, extraction vers DEAL pour transformation |

## Décisions Souveraines (A0)
- **Destruction du slide-out** : Le `ProjectDetailPanel` (tiroir latéral) est interdit. Un Projet exige le centre du pont de commandement.
- **Central Command Card** : Vue modale pleine largeur ou vue intra-fenêtre dédiée au projet, avec connexions spatiales vers 12WY, GTD, Resources.
- **Pas de fusion de données** : Navigation par IDs entre frameworks. Pas de duplication de données cross-store.
- **Unification avant extension** : V0.4.1 résout le double modèle AVANT d'ajouter des fonctionnalités.
- **Respect des Personas dans le code** : Commentaires et noms reflètent la mythologie Enterprise.

---

## V0.4.1 — Unification du Noyau (La Voix de l'Ordinateur)

> Résolution du Double Modèle : `fw-para.store.ts` (contrôleur UI) ↔ `ldXX.store.ts` (persistence IndexedDB)

### Phase A : Adaptateur de Données
| Étape | Description |
|-------|------------|
| V0.4.1.A.1 | Créer `paraAdapter.ts` : fonctions `projectToParaItem(project: Project): ParaItem` et `paraItemToProject(item: ParaItem, meta: ProjectMeta): Project` |
| V0.4.1.A.2 | Enrichir `ParaItem` dans les LD stores avec champs optionnels : `pillars?: string[]`, `progress?: number`, `resources?: string[]`, `archivedAt?: number` pour compatibilité |
| V0.4.1.A.3 | Gate : Types compatibles, `npx tsc --noEmit` |

### Phase B : Synchronisation Bidirectionnelle
| Étape | Description |
|-------|------------|
| V0.4.1.B.1 | Créer hook `useSyncLD()` : au boot, charge les items depuis les 8 LD stores → hydrate `fw-para.store` |
| V0.4.1.B.2 | Chaque action CRUD dans `fw-para.store` déclenche un write via `ld-router.writeToLD()` en parallèle |
| V0.4.1.B.3 | Ajouter actions manquantes au store : `addProject`, `updateProject`, `deleteProject`, `archiveProject`, `addResource`, `updateResource`, `deleteResource` |
| V0.4.1.B.4 | Câbler le bouton "New" dans `ParaApp.tsx` header → ouvre `ItemModal` → `addProject()` |
| V0.4.1.B.5 | Câbler le bouton "Archive" dans `ProjectDetailPanel` (temporaire avant remplacement V0.4.2) |
| V0.4.1.B.6 | Gate : CRUD complet Create/Read/Update/Delete + persistence IndexedDB au reload |

---

## V0.4.2 — UX Picard : La Carte de Commandement Centrale (Projects)

> Remplacement du slide-out par une vue centrale immersive avec ponts inter-frameworks.

### Phase A : Central Command Card
| Étape | Description |
|-------|------------|
| V0.4.2.A.1 | **SUPPRIMER** `ProjectDetailPanel.tsx` (slide-out) |
| V0.4.2.A.2 | **CRÉER** `ProjectCommandCard.tsx` : modale plein-écran intra-fenêtre (pas un Dialog browser, un composant `absolute inset-0` avec z-index) |
| V0.4.2.A.3 | Layout : Header (titre + status + domain badge) → Body 2 colonnes (gauche = détails + progress, droite = connexions spatiales) → Footer (actions Edit/Archive/Delete) |
| V0.4.2.A.4 | Section Progress : barre de progression éditable (click pour changer %) + timeline des milestones |
| V0.4.2.A.5 | Gate : Card centrale ouverte + navigation retour fonctionnelle |

### Phase B : Ponts Inter-Frameworks (Connexions Spatiales)
| Étape | Description |
|-------|------------|
| V0.4.2.B.1 | Module "12WY Bridge" : bouton/section affichant les goals 12WY liés (par `project.id` match dans `fw-12wy.store`) avec lien `openApp('twelve-week')` |
| V0.4.2.B.2 | Module "GTD Bridge" : bouton/section affichant les items GTD liés (`gtdItem.linkedProject === project.id`) avec lien `openApp('gtd')` |
| V0.4.2.B.3 | Module "Resources Bridge" (Geordi) : grille des Resources liées avec résolution d'ID → titre/type, lien direct |
| V0.4.2.B.4 | Module "Pillars" : tags des Business Pillars associés avec couleurs DomainConfig |
| V0.4.2.B.5 | Gate : Tous les ponts affichent les données liées + navigation cross-framework fonctionne |

### Phase C : Éditeur de Projet Inline
| Étape | Description |
|-------|------------|
| V0.4.2.C.1 | Mode édition dans la Command Card : titre editable, status dropdown, domain selector, pillars checkboxes |
| V0.4.2.C.2 | Ajout/suppression de Resources liées via picker |
| V0.4.2.C.3 | Bouton "Archive" avec confirmation → change status + set `archivedAt` + sync LD |
| V0.4.2.C.4 | Bouton "Delete" avec modale confirmation → supprime du store + sync LD |
| V0.4.2.C.5 | Gate : Edit + Archive + Delete fonctionnels + sync IndexedDB |

---

## V0.4.3 — Routage Spock & Data (Areas & Archives)

> Areas : consolidation matricielle avec pont Ikigai. Archives : protocole d'extraction DEAL.

### Phase A : Areas (Officier Scientifique Spock)
| Étape | Description |
|-------|------------|
| V0.4.3.A.1 | Enrichir `DomainCard.tsx` : afficher le compteur de projets actifs PAR pilier (pas juste par domaine global) |
| V0.4.3.A.2 | Click sur un Pilier → filtre les projets de ce domaine×pilier spécifique |
| V0.4.3.A.3 | Pont Ikigai : bouton "View in Ikigai" sur chaque domaine → `openApp('ikigai')` avec filtre horizon/pilier correspondant |
| V0.4.3.A.4 | Utiliser les couleurs et labels de `DomainConfig` (V0.3.2 Zora Core) au lieu des labels hardcodés |
| V0.4.3.A.5 | Gate : Matrice enrichie + pont Ikigai fonctionnel |

### Phase B : Archives (Commandeur Data)
| Étape | Description |
|-------|------------|
| V0.4.3.B.1 | Vue Archives enrichie : timeline des projets archivés (date d'archivage, durée de vie) |
| V0.4.3.B.2 | Protocole d'extraction DEAL : bouton "Transform via DEAL" (déjà présent visuellement) → ouvre DEAL avec `importFromPARA(project)` |
| V0.4.3.B.3 | Indicateur visuel : badge "Muse Candidate" sur les projets déjà envoyés vers DEAL |
| V0.4.3.B.4 | Gate Finale : Archive → DEAL pipeline fonctionnel |

---

## Chiffres

| Itération | Phases | Étapes |
|-----------|--------|--------|
| V0.4.1 Unification Noyau | 2 (A, B) | 9 |
| V0.4.2 UX Picard | 3 (A, B, C) | 15 |
| V0.4.3 Routage Spock & Data | 2 (A, B) | 9 |
| **Total** | **7** | **33** |

## Fichiers Impactés

### Nouveaux
- `src/utils/paraAdapter.ts` — Conversion Project ↔ ParaItem
- `src/hooks/useSyncLD.ts` — Synchronisation bidirectionnelle Zustand ↔ IndexedDB
- `src/apps/para/components/ProjectCommandCard.tsx` — Vue centrale immersive
- `src/apps/para/components/FrameworkBridge.tsx` — Modules de connexion inter-frameworks (12WY, GTD, Resources)

### Modifiés
- `src/stores/fw-para.store.ts` — Ajout actions CRUD (addProject, updateProject, deleteProject, archiveProject)
- `src/stores/ld01.store.ts` (et ld02-ld08) — Enrichissement ParaItem avec champs optionnels
- `src/apps/para/ParaApp.tsx` — Câblage bouton "New" + remplacement ProjectDetailPanel par ProjectCommandCard
- `src/apps/para/components/DomainCard.tsx` — Compteurs par pilier + pont Ikigai + couleurs DomainConfig

### Supprimés
- `src/apps/para/components/ProjectDetailPanel.tsx` — Remplacé par ProjectCommandCard

## Directive de Décomposition (pour Gemini CLI)

Ce SDD doit être décomposé en :
- **3 PRDs** (V0.4.1, V0.4.2, V0.4.3) selon les standards GEMINI.md Section 3
- **3 ADRs** avec contrats TypeScript AVANT/APRÈS
- **3 DDDs** avec code exécutable prêt à copier-coller
- Séquence imposée : V0.4.1 → V0.4.2 → V0.4.3 (Unification AVANT extension)
- Gate `npx tsc --noEmit` entre chaque étape, `npm run gate` entre chaque phase
