# ADR-V0.4.1 — Unification Noyau (The Enterprise Computer)

> **Phase** : V0.4.1
> **Contexte** : Différence de modèle de données entre UI (Project) et DB (ParaItem).

## Décision Architecturale : Write-Through Cache via Zustand
Le store Zustand (`fw-para.store.ts`) agit comme un cache de lecture rapide (Source d'UI). L'IndexedDB agit comme la base de données persistante (Source de vérité de stockage). 
Lors d'une action, Zustand met à jour son état local **immédiatement** (Optimistic UI) puis lance l'opération asynchrone vers IndexedDB. Au démarrage de l'app, un hook synchronise la mémoire depuis IndexedDB.

### Justification
Évite de devoir `await` les lectures IndexedDB pour chaque rendu React. Offre l'instantanéité absolue d'une UI locale tout en garantissant la persistance de gros volumes sans engorger le `localStorage`.

## Phase A : Adaptateur de Données

### Contrats TypeScript (AVANT/APRÈS)

**AVANT** (`src/stores/ld01.store.ts`) :
```typescript
export interface ParaItem {
  id: string; title: string; description: string;
  status: 'active' | 'completed' | 'on-hold';
  updatedAt: number;
}
```

**APRÈS** (`src/stores/ld01.store.ts` — enrichi pour compatibilité) :
```typescript
export interface ParaItem {
  id: string; title: string; description: string;
  status: 'active' | 'completed' | 'on-hold' | 'paused' | 'archived'; // Alignement
  updatedAt: number;
  pillars?: string[];
  resources?: string[];
  progress?: number;
  domain?: string; // optionnel car défini par la DB où il est stocké, mais utile pour vérif
  archivedAt?: number;
}
```

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `ld01.store.ts` | Mise à jour de l'interface `ParaItem` (s'assurer qu'elle est importée par ld02-ld08 ou centralisée). | `tsc --noEmit` |
| A.2 | `paraAdapter.ts` | Implémenter `projectToParaItem` et `paraItemToProject`. | `tsc --noEmit` |

## Phase B : Synchronisation Bidirectionnelle

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| B.1 | `fw-para.store.ts` | 1. Retirer seed data. 2. Ajouter actions `addProject()`, `updateProject()`, `archiveProject()`. 3. Injecter appel `writeToLD` dans ces actions. | `tsc --noEmit` |
| B.2 | `useSyncLD.ts` | Hook `useEffect` qui `readFromLD` les 8 domaines, flatMap, map via adaptateur, puis `initializeProjects()` dans le store. | `tsc --noEmit` |
| B.3 | `ParaApp.tsx` | Importer `useSyncLD`. Câbler le bouton "New" pour appeler `ItemModal`. Lier l'event Save à `addProject()`. | `npm run gate` |
