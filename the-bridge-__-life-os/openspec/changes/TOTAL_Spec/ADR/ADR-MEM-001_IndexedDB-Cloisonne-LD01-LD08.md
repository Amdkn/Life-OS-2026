# ADR-MEM-001 — IndexedDB Cloisonné par Area (LD01-LD08)

**Statut**: PROPOSED
**Date**: 2026-03-15
**Proposé par**: A'"0 GravityClaw (L3)
**Validé par**: En attente Rick (A1) / Amadeus (A0)
**PRD source**: `openspec/changes/aspace-web-os/specs/framework-apps.md`

## Contexte

Le Web OS gère 8 domaines de vie (LD01-LD08) dans les Areas de Spock.
Chaque domaine est encapsulé par un Jerry (J1-J8) et doit être **hermétiquement isolé** :
- LD01 Business ne doit jamais voir LD05 Relations
- Un bug dans le store Finance ne corrompt pas Health

La technologie de persistance côté client est **IndexedDB** (browser-native, offline-first, pas de backend au MVP).

## Décision

Créer **8 bases IndexedDB séparées** (pas 8 stores dans 1 base, mais 8 bases distinctes) :

```
Browser IndexedDB:
├── aspace-ld01-business     ← J1 SOB
├── aspace-ld02-finance      ← J2 Trillion
├── aspace-ld03-health       ← J3 Blue Life
├── aspace-ld04-cognition    ← J4 Meta Cognition
├── aspace-ld05-relations    ← J5 Sovereign Triangle
├── aspace-ld06-habitat      ← J6 Solarpunk
├── aspace-ld07-creativity   ← J7 MC Sandbox
├── aspace-ld08-impact       ← J8 Civilizer
├── aspace-shell             ← OS state (windows, dock, layout)
└── aspace-agents            ← Agent status, logs
```

### Schema per LD database

```typescript
interface LDDatabase {
  // Object Stores
  projects: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, unknown>;
  }[];
  items: {
    id: string;
    projectId?: string;
    type: 'note' | 'task' | 'metric' | 'journal';
    content: string;
    tags: string[];
    createdAt: Date;
  }[];
  metrics: {
    id: string;
    name: string;
    value: number;
    date: Date;
  }[];
}
```

### Shell database schema

```typescript
interface ShellDatabase {
  layout: {
    id: 'current';
    windows: WindowState[];
    dockOrder: string[];
    desktopShortcuts: string[];
  };
  preferences: {
    id: 'current';
    theme: string;
    wallpaper: string;
    vetoEngaged: boolean;
  };
  notifications: {
    id: string;
    source: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }[];
}
```

## Conséquences

### Positives
- True isolation : corruption dans LD01 ne touche pas LD02
- Chaque LD peut être export/import/reset indépendamment
- Zustand store par LD se mappe 1:1 sur une IDB database

### Négatives
- 10 connexions IDB simultanées (8 LD + shell + agents) → coût mémoire
- Cross-linking entre domaines requiert un lookup cross-DB

### Risques
- Browser limits sur le nombre de databases (mitigation: tous les browsers modernes supportent >50 DBs)
- Quota de stockage par origin (mitigation: IndexedDB = storage le plus généreux, ~50% du disque)

## Alternatives Considérées

| Alternative | Avantage | Inconvénient | Rejet |
|-------------|----------|-------------|-------|
| 1 seule IDB, 8 object stores | Plus simple | Un crash corrompt tout | Isolation vitale |
| localStorage par LD | Très simple | 5-10MB limit, sync only | Trop petit |
| SQLite via sql.js/OPFS | Vrai SQL | +300KB wasm, complexe | Overkill pour MVP |
| Backend API + PostgreSQL | Full power | Hors scope MVP (offline-first) | Prématuré |

## Impact sur l'Isolation

| Ressource | Avant | Après |
|-----------|-------|-------|
| Database | 0 (pas de persistance) | **10 IndexedDB** (8 LD + shell + agents) |
| Cross-DB | — | Interdit sauf via cross-link router |
| Backup | — | Future : export JSON par LD database |

## Vérification

```javascript
// In browser DevTools > Application > IndexedDB
// Should see 10 separate databases:
// aspace-ld01-business, ..., aspace-ld08-impact, aspace-shell, aspace-agents

// Isolation test:
const db01 = await openDB('aspace-ld01-business');
const db02 = await openDB('aspace-ld02-finance');
// db01.objectStore('items') !== db02.objectStore('items') ← separate stores
```
