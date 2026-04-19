# DDD-V0.1.6 — Meta-Prompt GTD System 🧿

> **Contexte** : V0.1.6 (Framework GTD — Capture, Clarification, Organisation)
> **Source de vérité** : `_SPECS/ADR/ADR-FWK-020_Framework-LD-Cooperation.md`
> **ADR** : `_SPECS/ADR/ADR-FWK-016_GTD_Structure.md`
> **Dépendance** : Tag `v0.1.5-baseline` + LD-Router fonctionnel

---

## ⚙️ Rôle de GTD dans l'Architecture 3 Couches

```
GTD = Capture & Organisation Multi-Domaine (Write 4 LDs + Read ALL)
→ Accès Write : LD01 (Business), LD03 (Health), LD04 (Cognition), LD06 (Habitat)
→ Accès Read : LD02, LD05, LD07, LD08 (contexte)
→ Config/Data dans : aspace-fw-gtd (inbox, contextes, config GTD)
```

GTD capture des tâches via l'Inbox et les ROUTE vers le bon domaine LD après clarification.

### Matrice d'accès GTD
| LD01 Biz | LD02 Fin | LD03 Heal | LD04 Cog | LD05 Rel | LD06 Hab | LD07 Crea | LD08 Imp |
|----------|----------|-----------|----------|----------|----------|-----------|----------|
| **W** | R | **W** | **W** | R | **W** | R | R |

---

## Phase 1 & 2 : Nettoyage

### Bugs critiques
- ❌ `gtdApp` → `GtdApp` (PascalCase)
- ❌ `useLD05Store` → Supprimer. GTD utilise `fw-gtd.store.ts`
- ❌ `ParaItem` → Créer `InboxItem`, `ActionItem`, `ContextItem`
- Tabs : Dashboard, Inbox, Organize, Reflect, Engage

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 3 : FW Store GTD

### IndexedDB `aspace-fw-gtd`
```typescript
interface InboxItem {
  id: string;
  content: string;
  source: 'manual' | 'quick-capture' | 'import';
  capturedAt: number;
  processed: boolean;
  targetLd?: string;     // Domaine LD destination après clarification
}

interface ActionItem {
  id: string;
  title: string;
  context: string;           // '@home', '@work', '@anywhere'
  energy: 'low' | 'medium' | 'high';
  timeEstimate: number;
  dueDate?: number;
  completed: boolean;
}

interface GTDContext {
  id: string;
  name: string;
  type: 'location' | 'energy' | 'tool';
  color: string;
}
```

### Processus de Clarification (Inbox → LD)
```typescript
// Quand un inbox item est "clarifié", il est routé vers le bon LD
import { writeToLD } from '../../lib/ld-router';

async function clarifyItem(item: InboxItem, targetLd: string) {
  // 1. Vérifier la permission GTD sur ce LD
  await writeToLD(targetLd, 'items', 'add', {
    type: 'task',
    content: item.content,
    tags: ['gtd-inbox', `from-${item.source}`]
  }, 'gtd');

  // 2. Marquer l'inbox item comme processed dans aspace-fw-gtd
  await markAsProcessed(item.id);
}
```

### Build Gate ✅ : `npx tsc --noEmit`

---

## Phase 4-6 : Focus Logic + Dashboard + Style

### Dashboard GTD
```typescript
interface GtdDashboardProps { embedded?: boolean; }
// 1. Inbox Counter (non processés)
// 2. Next Actions (top 5 par contexte)
// 3. Waiting For
// 4. Quick Capture (inline)
```

### CC : `case 'gtd': return <GtdDashboard embedded />;`

### Build Gate ✅ par phase

---

## Phase 7 : Audit

- DevTools → `aspace-fw-gtd` existe (PAS `aspace-ld05` ni `aspace-ld06`)
- Clarifier un item vers LD01 → logs LD-Router montrent l'écriture
- Clarifier vers LD02 ou LD05 → LD-Router REJETTE (pas autorisé)
- `GtdApp` en PascalCase confirmé

### Condition de sortie → `git tag v0.1.6-baseline`
