# ADR-FWK-020 — Isolation, Limites & Coopérations entre Frameworks et Domaines LD 🧿

**Statut** : PROPOSED
**Date** : 2026-03-17
**Proposé par** : GravityClaw (A'"0) — Claude / Antigravity
**Validé par** : En attente Amadeus (A0)

---

## Contexte & Problème

L'ADR-MEM-001 définit **8 IndexedDB cloisonnées** par domaine de vie :

| LD | Domaine de Vie | Jerry |
|----|---------------|-------|
| LD01 | Business | J1 SOB |
| LD02 | Finance | J2 Trillion |
| LD03 | Health | J3 Blue Life |
| LD04 | Cognition | J4 Meta Cognition |
| LD05 | Relations | J5 Sovereign Triangle |
| LD06 | Habitat | J6 Solarpunk |
| LD07 | Creativity | J7 MC Sandbox |
| LD08 | Impact | J8 Civilizer |

Mais les **6 Frameworks** (PARA, Ikigai, Life Wheel, 12WY, GTD, DEAL) ne sont **PAS** des domaines de vie. Ce sont des **méthodologies transversales** qui opèrent **à travers** les 8 domaines :

- **PARA** gère les projets de Business (LD01), de Health (LD03), de Relations (LD05)...
- **Ikigai** définit la boussole Passion/Mission qui traverse les 8 domaines
- **Life Wheel** lit les scores de **TOUS** les LD01-LD08
- **GTD** capture des tâches de n'importe quel domaine
- **12WY** lance des tactiques sur n'importe quel projet de n'importe quel domaine
- **DEAL** identifie des frictions dans tous les domaines

> **Le conflit** : Si on assigne 1 LD = 1 Framework, on détruit le cloisonnement par domaine de vie. Si on garde 1 LD = 1 domaine, les Frameworks n'ont pas de stockage propre.

---

## Décision : Architecture à 3 Couches

```
┌──────────────────────────────────────────────────────────────┐
│  COUCHE 3 : FRAMEWORKS (Outils — transversaux)              │
│  ┌─────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌─────┐ ┌──────┐       │
│  │PARA │ │Ikigai│ │Wheel │ │12WY │ │ GTD │ │ DEAL │       │
│  └──┬──┘ └──┬───┘ └──┬───┘ └──┬──┘ └──┬──┘ └──┬───┘       │
│     │       │        │        │       │       │              │
│     │       │   LECTURE SEULE │       │       │              │
│     │       │   (cross-read)  │       │       │              │
│     ▼       ▼        ▼        ▼       ▼       ▼              │
│──────────────────────────────────────────────────────────────│
│  COUCHE 2 : DOMAINES DE VIE (Données — isolées)             │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐          │
│  │LD01││LD02││LD03││LD04││LD05││LD06││LD07││LD08│          │
│  │Biz ││Fin ││Heal││Cog ││Rel ││Hab ││Crea││Imp │          │
│  └────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘          │
│──────────────────────────────────────────────────────────────│
│  COUCHE 1 : OS (Shell — global)                              │
│  ┌─────────────┐ ┌─────────────┐                            │
│  │ aspace-shell │ │aspace-agents│                            │
│  └─────────────┘ └─────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

### Principe fondamental

> **Les LD01-LD08 stockent les DONNÉES par domaine de vie.**
> **Les Frameworks stockent leur CONFIGURATION et LOGIQUE dans des stores séparés.**
> **Un Framework peut LIRE les données de plusieurs LDs, mais n'ÉCRIT que dans les LDs permis.**

---

## Structure de stockage révisée

### IndexedDB Domaines (ADR-MEM-001 — inchangé)
```
aspace-ld01-business    ← Projets Business, Clients, Revenue
aspace-ld02-finance     ← Budget, Investissements, Patrimoine
aspace-ld03-health      ← Nutrition, Sport, Sommeil
aspace-ld04-cognition   ← Formation, Lecture, Compétences
aspace-ld05-relations   ← Réseau, Famille, Social
aspace-ld06-habitat     ← Logement, Environnement, Organisation
aspace-ld07-creativity  ← Art, Musique, Expression, Side Projects
aspace-ld08-impact      ← Mission Sociale, Contribution, Legacy
```

### IndexedDB Frameworks (NOUVEAU — stores de config et meta)
```
aspace-fw-para          ← Config des vues PARA, filtres, ordre colonnes
aspace-fw-ikigai        ← Piliers Ikigai, Horizons H1-H90, scores
aspace-fw-wheel         ← Historique scores Life Wheel, pondérations
aspace-fw-12wy          ← Cycles 12 semaines, tactiques, scores weeky
aspace-fw-gtd           ← Inbox items, contextes GTD, remind config
aspace-fw-deal          ← Pipeline D→E→A→L, frictions, automations
```

### IndexedDB OS (inchangé)
```
aspace-shell            ← Fenêtres, dock, layout, préférences
aspace-agents           ← Logs agents, profiles, tâches
```

**Total : 16 IndexedDB** (8 LD + 6 FW + 2 OS)

---

## Matrice de Coopération (Framework → LD)

### Légende
- **W** = Écriture (Write) — Le framework CRÉE des items dans ce LD
- **R** = Lecture (Read) — Le framework LIT les données de ce LD
- **—** = Interdit — Aucun accès

| Framework | LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|-----------|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **PARA**  | **W** | **W** | **W** | **W** | **W** | **W** | **W** | **W** |
| **Ikigai** | R | R | R | R | R | R | R | R |
| **Life Wheel** | R | R | R | R | R | R | R | R |
| **12WY** | **W** | R | R | R | R | R | R | R |
| **GTD** | **W** | — | **W** | **W** | — | **W** | — | — |
| **DEAL** | R | R | R | R | R | R | R | R |

### Explication des permissions

#### PARA — **Write ALL** (Gestionnaire de Projets universel)
PARA est le framework CRUD principal. Il crée, modifie et archive des projets dans CHAQUE domaine de vie. Un projet "Rénovation cuisine" va dans LD06 (Habitat), "Lancement SaaS" dans LD01 (Business).

#### Ikigai — **Read ALL** (Boussole en lecture seule)
Ikigai ne modifie pas les données des domaines. Il LIT les objectifs et scores pour alimenter la boussole. Il ÉCRIT uniquement dans `aspace-fw-ikigai` (ses propres piliers et horizons).

#### Life Wheel — **Read ALL** (Tableau de bord en lecture seule)
Life Wheel agrège les métriques de TOUS les domaines pour calculer le score global. Il LIT les 8 LD et ÉCRIT uniquement dans `aspace-fw-wheel` (historique des scores).

#### 12WY — **Write LD01** (Tactiques principalement Business)
Les cycles 12 semaines créent des tactiques qui deviennent des actions dans LD01 (Business) car le 12WY est orienté exécution stratégique. Il peut LIRE les autres LD pour le contexte.

#### GTD — **Write LD01, LD03, LD04, LD06** (Capture multi-domaine)
GTD capture des tâches via l'Inbox et les route vers le bon domaine après clarification. Les 4 domaines d'écriture sont les plus courants pour les tâches quotidiennes (Business, Health, Cognition, Habitat).

#### DEAL — **Read ALL** (Analyse de frictions en lecture seule)
DEAL identifie les points de friction dans tous les domaines mais ne les modifie pas directement. Les solutions sont implémentées via PARA ou GTD. Il ÉCRIT dans `aspace-fw-deal` (pipeline D→E→A→L).

---

## Règles d'Isolation

### Règle 1 : Écriture via un Routeur Central
Aucun framework n'écrit directement dans un LD. Tous passent par un **LD-Router** :

```typescript
// src/lib/ld-router.ts
// Point d'entrée UNIQUE pour les écritures cross-LD

export async function writeToLD(
  ldId: string,           // 'ld01', 'ld02', etc.
  store: string,          // 'projects', 'items', 'metrics'
  action: 'add' | 'update' | 'delete',
  data: unknown,
  callerFramework: string // 'para', 'gtd', '12wy' — pour audit
): Promise<void> {
  // 1. Vérifier la permission (matrice ci-dessus)
  // 2. Valider les données
  // 3. Exécuter l'écriture dans la bonne IndexedDB
  // 4. Logger l'action pour audit
}
```

### Règle 2 : Lecture via des Hooks Isolés
Chaque framework a un hook pour lire les LDs autorisés :

```typescript
// src/hooks/useLD.ts
export function useLDRead(ldId: string, store: string) {
  // Retourne les données en lecture seule
  // PAS de méthode de mutation
}
```

### Règle 3 : Un Framework ne peut JAMAIS accéder au store FW d'un autre Framework
```
❌ aspace-fw-para ne lit JAMAIS aspace-fw-gtd
❌ aspace-fw-ikigai ne lit JAMAIS aspace-fw-deal
✅ Seule exception : Life Wheel lit les SCORES (pas les données) de tous les FW
```

### Règle 4 : Le Shell est lu par tous, écrit par personne (sauf Desktop.tsx)
```
✅ Tout framework peut lire shell.store pour connaître l'état UI
❌ Aucun framework ne modifie shell.store (sauf via les actions Dock/Window)
```

---

## Impact sur les DDD existants

| DDD | Changement |
|-----|-----------|
| V0.1.1 | CC + Shell — Pas de LD, pas de changement |
| V0.1.2 | PARA écrit dans les 8 LD (via LD-Router), configs dans `aspace-fw-para` |
| V0.1.3 | Ikigai lit les 8 LD, écrit dans `aspace-fw-ikigai` uniquement |
| V0.1.4 | Wheel lit les 8 LD + 6 FW (scores), écrit dans `aspace-fw-wheel` |
| V0.1.5 | 12WY écrit dans LD01, lit les autres, configs dans `aspace-fw-12wy` |
| V0.1.6 | GTD écrit dans LD01/03/04/06, configs dans `aspace-fw-gtd` |
| V0.1.7 | DEAL lit les 8 LD, écrit dans `aspace-fw-deal` uniquement |
| V0.1.8 | Agents pas de LD, écrit dans `aspace-agents` |
| V0.1.9 | Store pas de LD, écrit dans `aspace-shell` (préférences) |

---

## Conséquences

### Positives
- **Intégrité des données** : Les LD restent des sources de vérité par domaine de vie
- **Audit complet** : Le LD-Router logge qui écrit quoi et d'où
- **Extensibilité** : Ajouter un framework = définir ses permissions dans la matrice
- **Anti-régression** : Un bug dans GTD ne corrompt pas les données Ikigai

### Négatives
- **Complexité accrue** : 16 IndexedDB au lieu de 10
- **LD-Router** : Couche d'abstraction supplémentaire à développer
- **Performance** : Life Wheel doit lire 8+6 bases → cache obligatoire

---

## Vérification

```javascript
// DevTools > Application > IndexedDB
// Doit voir 16 bases :
// 8x aspace-ld0X-*, 6x aspace-fw-*, 2x aspace-shell/agents

// Test d'isolation :
// 1. Depuis Ikigai, tenter d'écrire dans LD01 → Rejet par LD-Router
// 2. Depuis PARA, écrire dans LD01 → Succès

// Test d'audit :
// Chaque écriture LD doit logger : { framework, ld, action, timestamp }
```
