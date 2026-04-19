# DDD-V0.3.4 — Souveraineté des Données (Memory State)

> **ADR** : ADR-V0.3.4 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Étape A.1 : state-manager.ts

**NEW** `src/utils/state-manager.ts`
```typescript
import { useOsSettingsStore } from '../stores/os-settings.store';
import { useFleetGatewayStore } from '../stores/fleet-gateway.store';
import { useGtdStore } from '../stores/fw-gtd.store';
import { useIkigaiStore } from '../stores/fw-ikigai.store';
import { useParaStore } from '../stores/fw-para.store';
import { useTwelveWeekStore } from '../stores/fw-12wy.store';
import { useDealStore } from '../stores/fw-deal.store';

const STORES = [
  { name: 'OS Settings', store: useOsSettingsStore },
  { name: 'Fleet Gateway', store: useFleetGatewayStore },
  { name: 'GTD', store: useGtdStore },
  { name: 'Ikigai', store: useIkigaiStore },
  { name: 'PARA', store: useParaStore },
  { name: '12 Week Year', store: useTwelveWeekStore },
  { name: 'DEAL', store: useDealStore },
];

export function exportAllStores(): string {
  const data: Record<string, unknown> = {};
  STORES.forEach(({ name, store }) => { data[name] = store.getState(); });
  return JSON.stringify(data, null, 2);
}

export function downloadExport() {
  const json = exportAllStores();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `aspace-backup-${Date.now()}.json`;
  a.click(); URL.revokeObjectURL(url);
}

export interface StoreInfo { name: string; itemCount: number; }

export function getStoreOverview(): StoreInfo[] {
  return STORES.map(({ name, store }) => {
    const state = store.getState();
    const count = Object.values(state).filter(v => Array.isArray(v)).reduce((acc, arr) => acc + (arr as unknown[]).length, 0);
    return { name, itemCount: count || Object.keys(state).length };
  });
}
```

## Étapes A.2-B.4 : UI

**NEW** `StateManagerPanel.tsx` — Overview table + Export/Import buttons.
**NEW** `HardResetModal.tsx` — Input "RESET" to confirm + red button.
**NEW** `DiagnosticsPanel.tsx` — Store item counts.

```typescript
// HardResetModal.tsx — core logic
function handleReset() {
  localStorage.clear();
  indexedDB.deleteDatabase('aspace-wallpapers');
  indexedDB.deleteDatabase('aspace-avatars');
  window.location.reload();
}
```

**Gate** : `npm run gate` + Export → Import → Hard Reset
