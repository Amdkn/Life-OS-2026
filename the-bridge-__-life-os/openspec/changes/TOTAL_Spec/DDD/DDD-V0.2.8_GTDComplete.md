# DDD-V0.2.8 — GTD Complete

> **ADR** : ADR-V0.2.8 · **Dépendance** : DDD-V0.2.4
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.4 : Types & Store

**MODIFY** `src/stores/fw-gtd.store.ts`

```typescript
export type GTDItemType = 'inbox' | 'nextAction' | 'waitingFor' | 'somedayMaybe' | 'reference' | 'project';
export type GTDContext = '@home' | '@work' | '@errands' | '@anywhere' | 'waiting' | 'someday';

export interface GTDItem {
  id: string; title: string; type: GTDItemType; context?: GTDContext;
  notes?: string; project?: string; dueDate?: number;
  processed: boolean; completedAt?: number;
}

export interface ActionLog {
  id: string; itemId: string;
  action: 'created' | 'clarified' | 'organized' | 'reviewed' | 'completed' | 'deferred' | 'delegated' | 'deleted';
  timestamp: number; decision: string; reasoning: string;
}

// State
activeContext: GTDContext | 'all';
actionLogs: ActionLog[];
addActionLog: (log: Omit<ActionLog, 'id' | 'timestamp'>) => void;
clarifyItem: (id: string, type: GTDItemType, context?: GTDContext) => void;
getLogsForItem: (itemId: string) => ActionLog[];
```

**Seed** : 15 items (3 inbox, 4 nextAction, 2 waitingFor, 2 somedayMaybe, 2 reference, 2 projects) + 10 action logs.

**Gate** : `tsc --noEmit`

---

## Étapes B.1-B.5 : 5 Pages GTD

**NEW** `src/apps/gtd/pages/CaptureView.tsx`
```typescript
export function CaptureView() {
  const { addItem } = useGtdStore();
  const [input, setInput] = useState('');
  const handleCapture = () => { if (input.trim()) { addItem({ title: input.trim(), type: 'inbox' }); setInput(''); } };
  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCapture()}
          placeholder="What's on your mind?" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white/80 focus:outline-none focus:border-blue-500/30" autoFocus />
        <button onClick={handleCapture} className="px-6 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-widest">Capture</button>
      </div>
      {/* Recent inbox items */}
    </div>
  );
}
```

**NEW** `ClarifyWizard.tsx` — Arbre de décision interactif :
- "Is it actionable?" → Yes/No
- If No → "Reference, Someday/Maybe, or Trash?"
- If Yes → "Can it be done in < 2 min?" → Yes: "Do it now" / No: "Delegate or Defer?"
- Each decision creates an ActionLog entry

**NEW** `OrganizeView.tsx` — Listes groupées par contexte, filtré par `activeContext`.

**NEW** `ReviewView.tsx` — Checklist : unprocessed inbox count, projects sans next action, someday items to reconsider.

**NEW** `EngageView.tsx` — NextActions triées par priorité, filtrées par contexte.

**Gate** : 5 pages fonctionnelles

---

## Étapes C.1-C.3 : ActionLog & Filtres

**NEW** `src/apps/gtd/components/ActionLogPanel.tsx`
```typescript
export function ActionLogPanel({ itemId }: { itemId: string }) {
  const logs = useGtdStore(s => s.getLogsForItem(itemId));
  return (
    <div className="border-l border-white/5 p-4 w-[280px] overflow-auto">
      <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-4">Decision Trail</h4>
      <div className="flex flex-col gap-3">
        {logs.map(log => (
          <div key={log.id} className="border-l-2 border-blue-500/30 pl-3">
            <span className="text-[8px] text-white/20">{new Date(log.timestamp).toLocaleDateString()}</span>
            <p className="text-[11px] text-white/60">{log.decision}</p>
            <p className="text-[10px] text-white/30 italic">{log.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Header = `HeaderFilterBar` contextes, accentColor `blue`.

**Gate Finale** : `npm run gate` + 5 étapes + action log + filtres contexte
