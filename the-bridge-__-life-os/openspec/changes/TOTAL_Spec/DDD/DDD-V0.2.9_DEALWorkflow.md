# DDD-V0.2.9 — DEAL Workflow

> **ADR** : ADR-V0.2.9 · **Dépendance** : DDD-V0.2.6 (PARA Archives)
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.3 : Types & Store

**MODIFY** `src/stores/fw-deal.store.ts`

```typescript
export type DEALPhase = 'definition' | 'elimination' | 'automation' | 'liberation';

export interface DEALTask {
  id: string; title: string;
  type: 'keep' | 'eliminate' | 'automate' | 'delegate';
  completed: boolean; assignedAgent?: string;
}

export interface DEALItem {
  id: string; projectId: string; title: string;
  phase: DEALPhase; tasks: DEALTask[];
  museCandidate?: MuseCandidate;
}

export interface MuseCandidate {
  projectId: string; revenueEstimate?: number;
  automationPercent: number; liberationDate?: number;
  status: 'candidate' | 'active' | 'achieved';
}

// State
items: DEALItem[];
activePhase: DEALPhase | 'all';
setActivePhase: (p: DEALPhase | 'all') => void;
advancePhase: (id: string) => void;
promoteToMuse: (id: string) => void;
getMuseCandidates: () => MuseCandidate[];
```

**Seed** : 3 DEAL items :
- "A'Space CLI Tools" → `definition`, 4 tasks (2 keep, 1 eliminate, 1 automate)
- "Notion Alternative" → `automation`, 3 tasks (all automate), assignedAgent: 'enterprise'
- "Blog Platform" → `liberation`, muse: `{ automationPercent: 85, status: 'achieved' }`

**Gate** : `tsc --noEmit`

---

## Étapes B.1-B.4 : 4 Pages DEAL

**NEW** `src/apps/deal/pages/DefinitionView.tsx`
- Liste des items en phase `definition`
- Bouton "Import from PARA" → lit projets archived du store PARA
- 80/20 task breakdown : tag chaque tâche keep/eliminate/automate/delegate
- Bouton "Advance to Elimination →"

**NEW** `src/apps/deal/pages/EliminationView.tsx`
- Checklist "Not To Do" — items `type: 'eliminate'`
- % éliminé (checked / total eliminate tasks)
- Bouton "Advance to Automation →"

**NEW** `src/apps/deal/pages/AutomationView.tsx`
- Items `type: 'automate'` avec dropdown agent assigné
- Progress : % tasks automated + completed
- Bouton "Advance to Liberation →"

**NEW** `src/apps/deal/pages/LiberationView.tsx`
- Timeline countdown vers `liberationDate`
- Résumé : % automated, revenue estimate, agent load
- Bouton "Promote to Muse ★" → `promoteToMuse(id)`
- Lien "← Back to Archive" → PARA

**Gate** : 4 pages navigables via sidebar

---

## Étapes C.1-C.4 : Cross-Framework & Muse

**MODIFY** `fw-deal.store.ts` — `importFromPARA()` :
```typescript
importFromPARA: () => {
  const paraStore = useParaStore.getState();
  const archived = paraStore.projects.filter(p => p.status === 'archived');
  // Create DEALItems for archived projects not yet imported
  const existing = get().items.map(i => i.projectId);
  const newItems = archived.filter(p => !existing.includes(p.id)).map(p => ({
    id: `deal-${p.id}`, projectId: p.id, title: p.title,
    phase: 'definition' as DEALPhase, tasks: [], museCandidate: undefined,
  }));
  set(s => ({ items: [...s.items, ...newItems] }));
},
```

**NEW** `src/apps/deal/components/MuseTracker.tsx`
```typescript
export function MuseTracker() {
  const muses = useDealStore(s => s.getMuseCandidates());
  return (
    <div className="grid grid-cols-1 gap-4">
      {muses.map(m => (
        <div key={m.projectId} className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">★ Muse</span>
            <span className={`text-[8px] px-2 py-0.5 rounded-md ${m.status === 'achieved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{m.status}</span>
          </div>
          <div className="flex items-center gap-4">
            <div><span className="text-[9px] text-white/30">Automation</span><p className="text-lg font-bold text-white/80">{m.automationPercent}%</p></div>
            {m.revenueEstimate && <div><span className="text-[9px] text-white/30">Revenue</span><p className="text-lg font-bold text-emerald-400">${m.revenueEstimate}/mo</p></div>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Gate Finale** : `npm run gate` + cycle PARA archived → DEAL definition → elimination → automation → liberation → Muse achieved visible
