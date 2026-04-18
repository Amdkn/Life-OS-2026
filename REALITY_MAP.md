# 🗺️ LIFE OS — Reality Map (État Factuel du Système Construit)

> **Destinataire** : Tout agent isolé (Claude Chat, Gemini App, 11th Doctor, 13th Doctor) qui n'a pas accès au filesystem local.
> **Objectif** : Transmettre la réalité du Life Web OS déjà construit pour éviter la recréation et permettre l'intégration VPS.
> **Dernière mise à jour** : 2026-04-09
> **Source de vérité** : `/home/amadeus/aspace/life-os/the-bridge-__-life-os/`

---

## 1. IDENTITÉ DU PROJET

- **Nom** : A'Space Web OS (Life OS)
- **Dépôt local** : `/home/amadeus/aspace/life-os/the-bridge-__-life-os/`
- **Stack technique** : Vite + React 19 + TypeScript + Zustand 5 + TailwindCSS 4 + IndexedDB + Supabase (Dual-Write)
- **Volume du code source** : **16 462 lignes** (src/) + **~70K** Agent Portal composants
- **Port d'écoute** : `4444` (configurable dans package.json)
- **Version courante** : `0.9.x` (The Nexus Convergence — Agent Portal Alpha, Phase C en cours)

---

## 2. MÉTHODOLOGIE DE SPÉCIFICATION (Le Pipeline Spec-Driven)

Le Life OS a été construit selon une méthodologie **Spec-Driven Development (SDD)** en 4 couches documentaires. Voici comment elles s'articulent :

### 2.1 Pipeline de conception (Antigravity/Claude conçoit)

```
SDD (Wishlist A0, ~50L)
  → PRD (Product Requirements A1, ~200L)
    → ADR (Architecture Decisions A2, ~80L)
      → DDD (Dev Directives pour A3, 200-2000L)
```

### 2.2 Pipeline d'exécution (Gemini CLI exécute)

```
DDD + CONTRACTS.md
  → Conductor (A2, orchestration)
    → Ralph Loop (A3, codage itératif)
      → Build Gate : tsc --noEmit && vite build
```

### 2.3 Hiérarchie des documents

| Type | Rôle | Volume | Auteur | Exemple |
|------|------|--------|--------|---------|
| **SDD** | Vision stratégique + wishlist macro | ~50-200L | A0 (GravityClaw) | `SDD-V0.7_CerritosTacticalDeck.md` |
| **PRD** | User Stories + garde-fous + fichiers impactés | ~100-300L | A1 (Rick/Antigravity) | `PRD-V0.8.1_MigrationSouveraine.md` |
| **ADR** | Décisions architecturales, conséquences, isolation | ~50-150L | A2 (Doctor) | `ADR-V0.8.1_MigrationSouveraine.md` |
| **DDD** | Instructions étape par étape pour A3 (Ralph), avec Build Gates | 200-2000L | A2→A3 | `DDD-V0.1.6.md` (GTD) |
| **CONTRACTS** | Contrats d'API inviolables du Web OS | ~260L | Collectif | `CONTRACTS.md` |

### 2.4 Convention de versioning

```
V0.X.Y → X = Itération majeure (SDD), Y = Sous-itération (PRD/ADR/DDD)
Exemple : V0.4.1 = Itération Enterprise Computer, Sous-itération Unification du Noyau
```

### 2.5 Corpus complet des specs (13 608 lignes)

| Dossier | Nb fichiers | Couverture |
|---------|-------------|------------|
| `TOTAL_Spec/SDD/` | 13 fichiers | V0.2 → V0.8, phases multiples |
| `TOTAL_Spec/PRD/` | 28 fichiers | V0.2.4 → V0.8.8 |
| `TOTAL_Spec/ADR/` | 33 fichiers | V0.2.4 → V0.8.8 + WSL + ALA |
| `TOTAL_Spec/DDD/` | 14 fichiers | V0.1.1 → V0.8.8 + AGKIT |
| `TOTAL_Spec/CONTRACTS/` | 1 fichier | Contrats d'API globaux |
| `changes/v0.1.X-*/` | 9 dossiers | Proposals + design + features par version |
| `changes/aspace-web-os/` | 6 fichiers | Vision fondatrice + specs détaillées |

---

## 3. ARCHITECTURE TECHNIQUE (Ce qui est construit)

### 3.1 Architecture 3 Couches

```
COUCHE 3 : Frameworks (PARA, Ikigai, Wheel, 12WY, GTD, DEAL)
             ↕ R/W via LD-Router
COUCHE 2 : Domaines de Vie (LD01-LD08)
COUCHE 1 : OS (Shell + Agents + Settings)
```

### 3.2 Composants Shell (Couche 1) — TOUS CONSTRUITS ✅

| Composant | Fichier | Lignes | Statut |
|-----------|---------|--------|--------|
| Desktop | `src/components/Desktop.tsx` | 200+ | ✅ Opérationnel |
| TopBar | `src/components/TopBar.tsx` | 115 | ✅ Veto + Clock + Boot |
| Dock | `src/components/Dock.tsx` | 130 | ✅ 8 slots + badges |
| WindowFrame | `src/components/WindowFrame.tsx` | 160 | ✅ Drag + Resize + Glass |
| Breadcrumbs | `src/components/Breadcrumbs.tsx` | 44 | ✅ Navigation |
| ErrorBoundary | `src/components/ErrorBoundary.tsx` | 50 | ✅ Crash isolation |
| AppDrawer | `src/components/AppDrawer.tsx` | 125 | ✅ Grid d'apps |
| Toast | `src/components/Toast.tsx` | 60 | ✅ Notifications |
| ViewportGuard | `src/components/ViewportGuard.tsx` | 46 | ✅ Responsive |
| HeaderFilterBar | `src/components/HeaderFilterBar.tsx` | 50 | ✅ Filtres horizontaux |
| OmniCaptureModal | `src/components/OmniCaptureModal.tsx` | 74 | ✅ Quick Capture GTD |
| SidebarSearch | `src/components/SidebarSearch.tsx` | 24 | ✅ Filtre global |
| AppNavBar | `src/components/AppNavBar.tsx` | 110 | ✅ Navigation apps |

### 3.3 Applications Framework (Couche 3) — TOUTES CONSTRUITES ✅

| App ID | Composant | Lignes (TSX) | FW Store | Vaisseau Star Trek |
|--------|-----------|-------------|----------|-------------------|
| `command-center` | CommandCenter.tsx | 792 | — | USS Hood (Bridge) |
| `para` | ParaApp.tsx | **1618** | fw-para.store.ts (236L) | USS Enterprise |
| `ikigai` | IkigaiApp.tsx | 366 | fw-ikigai.store.ts (63L) | USS Orville |
| `life-wheel` | LifeWheelApp.tsx | 626 | fw-wheel.store.ts (113L) | USS Discovery |
| `twelve-week` | TwelveWeekApp.tsx | **1112** | fw-12wy.store.ts (130L) | USS SNW |
| `gtd` | GtdApp.tsx | 642 | fw-gtd.store.ts (116L) | USS Cerritos |
| `deal` | DealApp.tsx | 378 | fw-deal.store.ts (214L) | USS Protostar |
| `agent-portal` | AgentPortal.tsx | **4674** | agents.store.ts (149L) | Fleet Admiral |
| `store` | AppStore.tsx | 269 | — | — |
| `settings` | SettingsApp.tsx | 1239 | os-settings.store.ts (123L) | — |

### 3.4 Stores de données (Couche 2) — TOUS CONSTRUITS ✅

| Store | Fichier | Lignes | IndexedDB Key | Rôle |
|-------|---------|--------|---------------|------|
| LD01 Business | ld01.store.ts | 75 | aspace-ld01-business | Domaine de vie |
| LD02 Finance | ld02.store.ts | 42 | aspace-ld02-finance | Domaine de vie |
| LD03 Health | ld03.store.ts | 42 | aspace-ld03-health | Domaine de vie |
| LD04 Cognition | ld04.store.ts | 42 | aspace-ld04-cognition | Domaine de vie |
| LD05 Relations | ld05.store.ts | 42 | aspace-ld05-environment | Domaine de vie |
| LD06 Habitat | ld06.store.ts | 42 | aspace-ld06-relationships | Domaine de vie |
| LD07 Creativity | ld07.store.ts | 42 | aspace-ld07-emotions | Domaine de vie |
| LD08 Impact | ld08.store.ts | 42 | aspace-ld08-purpose | Domaine de vie |
| Shell Layout | shell.store.ts | 217 | aspace-shell-layout-v1 | Fenêtres + Dock |
| Agents | agents.store.ts | 149 | — | Statuts A1/A2/A3 |
| Fleet Gateway | fleet-gateway.store.ts | 90 | — | Connexion OpenClaw |
| Settings | os-settings.store.ts | 123 | — | Config utilisateur |

### 3.5 Librairies (src/lib/) — TOUTES CONSTRUITES ✅

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `app-registry.ts` | 52 | Registre des manifests d'apps |
| `app-discovery.ts` | 13 | Auto-discovery des apps |
| `cross-link.ts` | 22 | Parser de liens `aspace://` |
| `glass-tokens.ts` | 13 | Tokens CSS glassmorphisme |
| `idb.ts` | 140 | Wrapper IndexedDB + **Dual-Write Supabase** |
| `ld-router.ts` | 91 | Routeur d'écriture LD (contrôle d'accès FW→LD) |
| `supabase.ts` | 5 | Client Supabase singleton |
| `db/core-db.ts` | — | Abstraction DB bas niveau |
| `routing/deep-linker.ts` | 47 | Navigation profonde |

### 3.6 Matrice de Coopération Framework ↔ Domaine

| Framework | LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Env | LD06 Rel | LD07 Emo | LD08 Pur |
|-----------|----------|----------|-----------|----------|----------|----------|----------|----------|
| **PARA** | **W** | **W** | **W** | **W** | **W** | **W** | **W** | **W** |
| **Ikigai** | R | R | R | R | R | R | R | R |
| **Wheel** | R | R | R | R | R | R | R | R |
| **12WY** | **W** | R | R | R | R | R | R | R |
| **GTD** | **W** | — | **W** | **W** | — | **W** | — | — |
| **DEAL** | R | R | R | R | R | R | R | R |

---

## 4. PERSISTENCE (Dual-Write Architecture)

### 4.1 Couche Primaire : IndexedDB (Local-First)
- **16 bases** : 8 LD + 6 FW + 2 OS
- Accès via `DomainDB` class dans `src/lib/idb.ts`
- Contrôle d'accès via `ld-router.ts` (matrice R/W ci-dessus)

### 4.2 Couche Secondaire : Supabase (Durabilité)
- **Instance locale** via Docker (WSL)
- **16 tables PostgreSQL** miroir des IndexedDB
- **Pont** : Chaque `put()` et `delete()` dans `DomainDB` déclenche un `upsert` Supabase en parallèle
- **Config** : `.env` → `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Studio** : `http://localhost:54323` (pour la visualisation)

### 4.3 Schema SQL (tables PostgreSQL)

```sql
-- Tables LD (8)
ld01_business, ld02_finance, ld03_health, ld04_cognition,
ld05_environment, ld06_relationships, ld07_emotions, ld08_purpose

-- Tables FW (6)
fw_para, fw_ikigai, fw_life_wheel, fw_12wy, fw_gtd, fw_deal

-- Tables Système (2)
sys_agent_veto, sys_shell_routing
```

Chaque table contient : `id (uuid)`, `title (text)`, `metrics (jsonb)`, `type (text)`, `updated_at (timestamptz)`, `created_at (timestamptz)`

---

## 5. CHAÎNE DE RENDU (Architecture UI)

```
main.tsx → App.tsx → <Desktop />
  └→ ViewportGuard
       └→ TopBar (Veto, Boot, Clock, Badges)
       └→ windows.map(win =>
            └→ WindowFrame(id, title) [Glass + Drag + Resize]
                 └→ ErrorBoundary
                      └→ AppComponent ? <AppComponent /> : <PlaceholderApp />
          )
       └→ ToastContainer
       └→ AppDrawer
       └→ Dock (8 slots)
```

### 5.1 Ordre d'import des apps dans Desktop.tsx

```typescript
import '../apps/command-center/register';  // Slot 0
import '../apps/para/register';            // Framework PARA
import '../apps/ikigai/register';          // Framework Ikigai
import '../apps/life-wheel/register';      // Framework Wheel
import '../apps/twelve-week/register';     // Framework 12WY
import '../apps/gtd/register';             // Framework GTD
import '../apps/deal/register';            // Framework DEAL
import '../apps/store/register';           // System App Store
```

### 5.2 Convention `registerApp()`

```typescript
// ✅ CORRECT — 1 argument, component DANS le manifest
registerApp({ id: 'para', name: 'PARA', icon: 'FolderOpen', version: '0.1.2', description: '...', component: App });

// ❌ INTERDIT — ancienne API 2 arguments
registerApp({ id: 'para', ...}, App);
```

---

## 6. CONTRATS D'API INVIOLABLES (Extrait de CONTRACTS.md)

### 6.1 AppManifest
```typescript
interface AppManifest {
  id: string;            // kebab-case unique
  name: string;          // Titre affiché
  icon: string;          // Lucide PascalCase
  version: string;       // SemVer
  description: string;   // Courte
  component: ComponentType; // REQUIS
  dockSlot?: number;     // Position dock
  a2Ship?: string;       // Vaisseau Star Trek
}
```

### 6.2 AppWindow
```typescript
interface AppWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;        // 0-1000
  position: { x: number; y: number };
  size: { width: number; height: number };
}
```

### 6.3 LD-Router
```typescript
// Point d'entrée UNIQUE pour les écritures cross-LD
export async function writeToLD(ldId, store, action, data, callerFramework): Promise<void>;
// REJETTE si le framework n'a pas le droit d'écrire dans ce LD

export function useLDRead(ldId, store): readonly Item[];
// Lecture seule — pas de mutation
```

### 6.4 Anti-Patterns INTERDITS (Tous domaines)
- ❌ `registerApp(manifest, component)` — vieille API 2 args
- ❌ `this.children` dans ErrorBoundary — doit être `this.props.children`
- ❌ Écriture directe dans IndexedDB sans passer par le LD-Router
- ❌ Lecture cross-FW (un FW store ne lit pas un autre FW store)
- ❌ Import conditionnel dans la boucle `windows.map` de Desktop.tsx

---

## 7. PROGRESSION DES SPECS (Roadmap Factuelle)

### 7.1 Versions versionées avec proposals dédiées

| Version | Nom | Proposal | Statut |
|---------|-----|----------|--------|
| v0.1.1 | Command Center | `changes/v0.1.1-command-center/` | ✅ Construit |
| v0.1.2 | PARA Business | `changes/v0.1.2-para-business/` | ✅ Construit |
| v0.1.3 | Ikigai Protocol | `changes/v0.1.3-ikigai-protocol/` | ✅ Construit |
| v0.1.4 | Life Wheel | `changes/v0.1.4-life-wheel/` | ✅ Construit |
| v0.1.5 | 12WY Strategy | `changes/v0.1.5-12wy-strategy/` | ✅ Construit |
| v0.1.6 | GTD System | `changes/v0.1.6-gtd-system/` | ✅ Construit |
| v0.1.7 | DEAL Protocol | `changes/v0.1.7-deal-protocol/` | ✅ Construit |
| v0.1.8 | Agent Portal | `changes/v0.1.8-agent-portal/` | ✅ Construit |
| v0.1.9 | App Store + Settings | `changes/v0.1.9-app-store-settings/` | ✅ Construit |

### 7.2 SDD Macro (Évolution stratégique)

| SDD | Nom de Code | Couverture | Statut |
|-----|-------------|------------|--------|
| V0.2 | Micro | UI Layout, Ikigai Deep, PARA Deep, 12WY, Wheel, GTD | ✅ Construit |
| V0.3 | Engine Room | Architecture moteur interne | ✅ Construit |
| V0.4 | Enterprise Computer | Unification noyau PARA + Navigation | ✅ Construit |
| V0.5 | Sovereign Constitution | Couche souveraineté | ✅ Construit |
| V0.6 | Temporal Engine | NexusTemporel, VisionForge, GoalForge, TacticForge | ✅ Construit |
| V0.7 | Cerritos Tactical Deck | GTD Profond (Persistance, OmniCapture, Engage) | ✅ Construit |
| V0.8 | Protostar Spacedock | DEAL Profond (Migration, Pipeline, Nexus Économique) | ✅ Construit |
| V0.9 | The Nexus Convergence | Agent Portal Alpha (Poste de Commandement Unifié) | 🔧 En Cours |

### 7.3 V0.9 — "The Nexus Convergence" (Agent Portal Profond)

#### 7.3.1 Vision Stratégique
L'Agent Portal V0.9 est la **convergence** entre le prototype **ClaudeClaw Agent** (UI haute-fidélité, 17 composants, standalone) et le **Web OS souverain** (infrastructure IndexedDB/Zustand). L'objectif : un **poste de commandement total** capable d'orchestrer la Flotte à travers les dimensions temporelles (Crons), spatiales (Skill Tree) et exécutives (Scorecard), avec synchronisation temps-réel sur les données humaines (PARA, GTD, Ikigai, LD01-LD08).

#### 7.3.2 Pipeline Spec-Driven V0.9 (Statut)

| Document | Fichier | Statut |
|----------|---------|--------|
| SDD | `_SPECS/SDD/SDD-V0.9_AgentPortal_Nexus.md` | ✅ Rédigé (GravityClaw) |
| PRD | `_SPECS/PRD/PRD-V0.9_AgentPortal_Product.md` | ✅ Rédigé (7 User Stories, 3 Phases) |
| ADR | `_SPECS/ADR/ADR-V0.9_AgentPortal_Architecture.md` | ✅ Rédigé (3 décisions : Flat Root, LD-Nexus, Strategic Hub) |
| DDD | `_SPECS/DDD/DDD-V0.9_AgentPortal_Execution.md` | ✅ Rédigé (3 étapes avec Build Gates) |

#### 7.3.3 Architecture du Portal (État Construit)
Le Portal intégré au Web OS est opérationnel en version V0.2.0 interne. Il réside dans :
`src/apps/agent-portal/`

**Layout Triple-Panel** (AgentPortalApp.tsx — 200 lignes) :
```
┌──────────────┬──────────────────────────────┬──────────────┐
│  SideNav     │  Main Content (Pepites)      │  AgentStats  │
│  (Frameworks │  ┌──────────────────────┐    │  (Armada     │
│   + Methods) │  │ Header (Pepite Nav)  │    │   Telemetry) │
│              │  ├──────────────────────┤    │              │
│              │  │ Active View:         │    │              │
│              │  │ - ScoreCard (default)│    │              │
│              │  │ - SkillsView         │    │              │
│              │  │ - CronsView          │    │              │
│              │  │ - RelationDiagram    │    │              │
│              │  │ - Framework Drilldown│    │              │
│              │  └──────────────────────┘    │              │
└──────────────┴──────────────────────────────┴──────────────┘
```

#### 7.3.4 Composants Principaux (7 Core)

| Composant | Fichier | Taille | Rôle |
|-----------|---------|--------|------|
| SideNav | `components/SideNav.tsx` | 10 030 B | Navigation Frameworks + Methods + Footer stratégique |
| Header | `components/Header.tsx` | 7 851 B | Sélecteur Pepites (Scorecard/Skills/Crons) + breadcrumbs |
| AgentStats | `components/AgentStats.tsx` | 14 669 B | Panel Armada Telemetry (hiérarchie plate A0→A3) |
| SkillsView | `components/SkillsView.tsx` | 13 210 B | Quantum Canvas SVG infini zoomable (Frameworks Tree) |
| CronsView | `components/CronsView.tsx` | 6 023 B | Grille 7×24 d'orchestration Drones/automatisations |
| RelationDiagram | `components/RelationDiagram.tsx` | 10 439 B | Diagramme de relations inter-Frameworks |
| AgentChatbot | `components/AgentChatbot.tsx` | 8 064 B | Interface Chat IA intégrée au Portal |

#### 7.3.5 Dashboards Framework (9 portés depuis ClaudeClaw)

| Dashboard | Fichier | Taille | Framework Cible |
|-----------|---------|--------|----------------|
| ScoreCard | `dashboards/ScoreCard.tsx` | 11 015 B | Sprint Kanban (Todo/InProgress/Review/Done) |
| FrameworkOverview | `dashboards/FrameworkOverview.tsx` | 8 710 B | Vue macro d'un Framework sélectionné |
| IkigaiPillars | `dashboards/IkigaiPillars.tsx` | 13 985 B | USS Orville — Passion/Vocation/Mission/Profession |
| IkigaiHorizons | `dashboards/IkigaiHorizons.tsx` | 20 929 B | USS Orville — H1/H3/H10/H30/H90 |
| LifeWheelDomains | `dashboards/LifeWheelDomains.tsx` | 16 923 B | USS Discovery — 8 Domaines de vie |
| TwelveWeekYear | `dashboards/TwelveWeekYear.tsx` | 15 032 B | USS SNW — Vision/Planning/Process/Measurement/Time |
| ParaFramework | `dashboards/ParaFramework.tsx` | 14 271 B | USS Enterprise — Projects/Areas/Resources/Archive |
| GtdFramework | `dashboards/GtdFramework.tsx` | 14 967 B | USS Cerritos — Capture/Clarify/Organize/Reflect/Engage |
| DealFramework | `dashboards/DealFramework.tsx` | 14 321 B | USS Protostar — Definition/Elimination/Automation/Liberation |

#### 7.3.6 Convergence ClaudeClaw → Web OS (Matrice de Portage)
La source de vérité pour la fidélité visuelle est le prototype `ClaudeClaw Agent` dans :
`20_Life_OS/24_PARA_Enterprise/01_Projects_Picard/ClaudeClaw Agent/src/`

| Composant CC Agent | Taille CC | Composant Web OS | Statut |
|--------------------|-----------|------------------|--------|
| Layout.tsx | 8 040 B | AgentPortalApp.tsx | ✅ Porté (adapté triple-panel) |
| SideNav.tsx | 10 640 B | SideNav.tsx | ✅ Porté |
| Header.tsx | 3 762 B | Header.tsx | ✅ Porté (enrichi Pepites) |
| AgentStats.tsx | 16 840 B | AgentStats.tsx | ✅ Porté |
| SkillsView.tsx | 17 970 B | SkillsView.tsx | ✅ Porté (Quantum Canvas) |
| CronsView.tsx | 6 013 B | CronsView.tsx | ✅ Porté |
| RelationDiagram.tsx | 10 429 B | RelationDiagram.tsx | ✅ Porté |
| AgentChatbot.tsx | 8 048 B | AgentChatbot.tsx | ✅ Porté |
| ScoreCard.tsx | 9 176 B | dashboards/ScoreCard.tsx | ✅ Porté (enrichi Sprint) |
| FrameworkOverview.tsx | 8 694 B | dashboards/FrameworkOverview.tsx | ✅ Porté |
| IkigaiPillars.tsx | 13 969 B | dashboards/IkigaiPillars.tsx | ✅ Porté |
| IkigaiHorizons.tsx | 20 913 B | dashboards/IkigaiHorizons.tsx | ✅ Porté |
| LifeWheelDomains.tsx | 16 907 B | dashboards/LifeWheelDomains.tsx | ✅ Porté |
| TwelveWeekYear.tsx | 15 016 B | dashboards/TwelveWeekYear.tsx | ✅ Porté |
| ParaFramework.tsx | 14 255 B | dashboards/ParaFramework.tsx | ✅ Porté |
| GtdFramework.tsx | 14 951 B | dashboards/GtdFramework.tsx | ✅ Porté |
| DealFramework.tsx | 14 305 B | dashboards/DealFramework.tsx | ✅ Porté |

#### 7.3.7 Pages Héritées (V0.1.8)

| Page | Fichier | Lignes | Rôle |
|------|---------|--------|------|
| Dashboard V0.1.8 | `pages/Dashboard.tsx` | 157 | Fleet Status + Neural Bridge Console + Task Injector |

#### 7.3.8 Plan de Développement V0.9 (Phases)

**Phase A — La Matrice de Commandement** (Layout + Armada)
- S-P-A-D 01 : Layout `AgentPortalApp.tsx` triple-panel ✅ Construit
- S-P-A-D 02 : Panel `Armada Telemetry` hiérarchie plate (A0→A3) ✅ Construit

**Phase B — Les Moteurs de Réalité** (Trinité Stratégique)
- S-P-A-D 03 : Port du `SkillsView` (Frameworks Tree / Quantum Canvas) ✅ Porté
- S-P-A-D 04 : Port du `CronsView` (Calendrier 7×24 d'orchestration) ✅ Porté
- S-P-A-D 05 : Port du `ScoreCard` (Kanban PARA synchronisé) ✅ Porté

**Phase C — Le Bridge Transversal** (Zustand/IndexDB)
- S-P-A-D 06 : Câblage des sélecteurs transversaux (Filtrage par LDxx) 🔧 En cours
- S-P-A-D 07 : Synchronisation `fw-deal.store` et `fw-wheel.store` (ROI) 🔧 En cours

#### 7.3.9 Décisions Architecturales V0.9 (ADR)

| ID | Décision | Justification |
|----|----------|---------------|
| ADR-01 | Flat Root Armada Panel | Tous les dossiers agents (A0, A1, A2) à la racine — accès One-Click pour l'OVERSEER |
| ADR-02 | Transversal DB Routing (LD-Nexus) | Les agents Discovery (A3) mappés 1:1 sur LD01-LD08 (Book→LD01, Saru→LD02...) |
| ADR-03 | Strategic Hub State Management | L'état `activePepite` est global au Portal — switch de vue sans perdre le filtre LDxx |

#### 7.3.10 Contrats TypeScript V0.9

```typescript
// Armada Panel Context (ADR-01)
interface ArmadaTelemetryProps {
  allFolders: ArmadaFolder[];        // Dossiers à la racine (flat)
  activeAgentId: string | null;
  groups: { label: string; ids: string[] }[];  // Cadres visuels (A1, A2)
}

// Agent Entity (DDD)
interface Agent {
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Busy';
  ld?: string;  // Domaine transversal (LD01-LD08)
}

// Armada Folder (DDD)
interface ArmadaFolder {
  id: string;
  label: string;
  icon: any;
  status: 'Active' | 'Idle' | 'Busy';
  agents: Agent[];
}
```

#### 7.3.11 Métriques de Succès V0.9

| Métrique | Cible | Statut |
|----------|-------|--------|
| Zéro Latence (switch Pepites) | < 100ms | ✅ Atteint (AnimatePresence mode="wait", transition 0.1s) |
| Zéro Dette TypeScript | `tsc --noEmit` clean | 🔧 En cours |
| Wow Effect (fidélité ClaudeClaw) | 1:1 avec prototype | ✅ 17/17 composants portés |
| Volume de code Agent Portal | > 4000 lignes TSX | ✅ ~200L layout + ~70K composants |

---

## 8. CE QUI DOIT ÊTRE FAIT POUR LE VPS (Mapping vers ADR-001)

### 8.1 Destination VPS

Selon l'ADR-001 du 13th Doctor, le Life Web OS doit atterrir dans :

```
/srv/aspace/web/amadeuspace.com/public/   ← Build Vite (dist/)
```

### 8.2 Actions requises pour le portage

| # | Action | Détail |
|---|--------|--------|
| 1 | **Build de production** | `npm run build` dans le dépôt actuel → génère `dist/` |
| 2 | **Copie du bundle** | `rsync dist/ → /srv/aspace/web/amadeuspace.com/public/` |
| 3 | **Migration Supabase** | Décider si on garde le Docker local ou on installe Postgres natif sur le VPS |
| 4 | **Reverse Proxy** | Configurer Caddy/Nginx pour servir `amadeuspace.com` depuis `public/` |
| 5 | **Env vars** | Adapter `.env` pour pointer vers la base VPS |
| 6 | **Syncthing** | Le dépôt source va dans `/srv/aspace/vault/` si synchronisé |
| 7 | **systemd** | Créer `life-os.service` pour un éventuel serveur Node |

### 8.3 Points d'attention

> [!WARNING]
> - Le code source actuel utilise `vite --host 0.0.0.0` pour le dev WSL. Sur VPS, il faut un **build statique** servi par un reverse proxy.
> - La persistence IndexedDB est **côté navigateur**. Sur VPS public, le Supabase backend devient la source primaire.
> - Les `SEED_DATA` ont été purgées dans les phases V0.7-V0.8. L'app démarre vide.

---

## 9. COSMOLOGIE STAR TREK (Référence rapide)

| Framework | Vaisseau | Personnages |
|-----------|----------|-------------|
| Command Center | USS Hood | Le Bridge |
| PARA | USS Enterprise | Picard, Spock, Geordi, Data |
| Ikigai | USS Orville | Ed, Kelly, Gordon, Claire |
| Life Wheel | USS Discovery | Zora (IA du vaisseau) |
| 12WY | USS SNW | Pike, Una, M'Benga, Chapel, Uhura |
| GTD | USS Cerritos | Mariner, Boimler, Tendi, Rutherford, Freeman |
| DEAL | USS Protostar | Dal, Rok-Tahk, Zero, Gwyn, Holo-Janeway |
| Agent Portal | Flotte Stellaire | Amiral (A0 Overseer) |

---

*Ce document est un snapshot factuel. Il ne remplace pas les specs détaillées dans `_SPECS/`.*
*Pour toute modification architecturale, consulter `CONTRACTS.md` en priorité.*
