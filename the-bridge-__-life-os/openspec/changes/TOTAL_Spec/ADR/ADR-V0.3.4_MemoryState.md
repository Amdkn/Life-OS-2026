# ADR-V0.3.4 — Souveraineté des Données (Memory State)

> **PRD** : PRD-V0.3.4 · **Exécuteur** : A3

## Décision
Export/Import utilise tous les stores Zustand via `getState()`. Le JSON agrégé est un snapshot complet du système. Hard Reset purge localStorage + IndexedDB + force reload. Le Hard Reset nécessite de taper "RESET" pour valider (protection anti-accident).

## Phase A : State Manager (4 étapes)

### Contrats
```typescript
// src/utils/state-manager.ts [NEW]
export function exportAllStores(): string; // JSON stringified
export function importAllStores(json: string): void; // parse + set all stores
export function getStoreOverview(): StoreInfo[];

export interface StoreInfo {
  name: string; itemCount: number; sizeBytes: number; lastModified?: number;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | NEW `state-manager.ts` | Import tous les stores, export `getState()` de chacun en objet agrégé |
| A.2 | NEW `StateManagerPanel.tsx` | Tableau stores : nom, items, taille + boutons Export/Import |
| A.3 | Export | Génère JSON → `URL.createObjectURL(blob)` → download automatique |
| A.4 | Gate | Export → Import → vérification données restaurées |

## Phase B : Hard Reset & Diagnostics (4 étapes)

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `HardResetModal.tsx` | Modale : input "Tapez RESET pour confirmer" + bouton rouge désactivé tant que pas match |
| B.2 | Reset logic | `localStorage.clear()` + `indexedDB.deleteDatabase(...)` pour toutes les DBs + `location.reload()` |
| B.3 | NEW `DiagnosticsPanel.tsx` | Liste stores avec compteurs : GTD: 15 items, PARA: 8 projects, etc. |
| B.4 | Gate | Hard Reset fonctionne + Diagnostics affiche les compteurs |
