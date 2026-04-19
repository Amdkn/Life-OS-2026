# DDD-V0.4.6 — Le Scanner de Flotte (PARA Dashboard)

> **ADR** : ADR-V0.4.6 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Balance Life Wheel

### Étape A.1 : `LifeWheelBalance.tsx`
**NEW** `src/apps/para/components/LifeWheelBalance.tsx`
```typescript
import { useParaStore, type LifeWheelDomain } from '../../../stores/fw-para.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';

const DOMAINS: LifeWheelDomain[] = ['business', 'finance', 'health', 'cognition', 'creativity', 'habitat', 'relations', 'impact'];

export function LifeWheelBalance() {
  const allProjects = useParaStore(s => s.projects);
  const projects = allProjects.filter(p => p.status !== 'archived');
  const domainConfigs = useOsSettingsStore(s => s.domainConfigs);
  const total = projects.length || 1;

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
      <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6">Life Wheel Balance</h3>
      <div className="space-y-3">
        {DOMAINS.map(domain => {
          const count = projects.filter(p => p.domain === domain).length;
          const pct = Math.round((count / total) * 100);
          const config = domainConfigs?.find(c => c.domain === domain);
          const color = config?.color || '#10b981';
          return (
            <div key={domain} className="flex items-center gap-3">
              <span className="w-20 text-[9px] font-bold text-white/40 uppercase tracking-widest truncate">
                {config?.icon} {config?.label || domain}
              </span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              <span className="w-8 text-right text-[9px] font-black text-white/30">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Phase B : Friction Log

### Étape B.1 : `FrictionLog.tsx`
**NEW** `src/apps/para/components/FrictionLog.tsx`
```typescript
import { AlertTriangle, Clock } from 'lucide-react';
import { useParaStore } from '../../../stores/fw-para.store';
import { useGtdStore } from '../../../stores/fw-gtd.store';

const STALE_THRESHOLD = 14 * 24 * 60 * 60 * 1000; // 14 jours

export function FrictionLog() {
  const allProjects = useParaStore(s => s.projects);
  const projects = allProjects.filter(p => p.status === 'active');
  const gtdItems = useGtdStore(s => s.items);

  const frictionItems = projects.map(p => {
    const hasActions = gtdItems.some(i => i.projectId === p.id);
    const isStale = p.updatedAt ? (Date.now() - p.updatedAt) > STALE_THRESHOLD : false;
    if (!hasActions || isStale) {
      return { project: p, reason: !hasActions ? 'NO ACTIONS' : 'STALLED' };
    }
    return null;
  }).filter(Boolean) as { project: typeof projects[0]; reason: string }[];

  if (frictionItems.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Friction Log</h3>
        <p className="text-[10px] text-emerald-400/40 italic text-center py-4">All clear — no projects in distress.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
      <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Friction Log
      </h3>
      <div className="space-y-2">
        {frictionItems.map(({ project, reason }) => (
          <div key={project.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/20" />
              <span className="text-xs text-white/60">{project.title}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
              reason === 'STALLED' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            }`}>
              {reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Phase C : Airlock DEAL

### Étape C.1 : `ArchiveRadar.tsx`
**NEW** `src/apps/para/components/ArchiveRadar.tsx`
```typescript
import { Zap, Archive } from 'lucide-react';
import { useParaStore } from '../../../stores/fw-para.store';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useShellStore } from '../../../stores/shell.store';

export function ArchiveRadar() {
  const allProjects = useParaStore(s => s.projects);
  const archived = allProjects
    .filter(p => p.status === 'archived' || p.status === 'completed')
    .sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0))
    .slice(0, 5);
  const createDef = useDealStore(s => s.createDefinitionFromText);
  const openApp = useShellStore(s => s.openApp);

  if (archived.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
      <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <Archive className="w-3.5 h-3.5" /> Archive Radar (Data)
      </h3>
      <div className="space-y-2">
        {archived.map(p => (
          <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center group">
            <div>
              <span className="text-xs text-white/50">{p.title}</span>
              {p.archivedAt && <span className="ml-2 text-[8px] text-white/20">{new Date(p.archivedAt).toLocaleDateString()}</span>}
            </div>
            <button 
              onClick={() => { createDef(`[PARA] ${p.title}`); openApp('deal', 'D.E.A.L'); }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3" /> DEAL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Étape A.2 + B.2 + C.2 : Intégration dans `Dashboard.tsx`
```typescript
import { LifeWheelBalance } from '../components/LifeWheelBalance';
import { FrictionLog } from '../components/FrictionLog';
import { ArchiveRadar } from '../components/ArchiveRadar';

// Dans le JSX du Dashboard :
<div className="space-y-8">
  <LifeWheelBalance />
  <FrictionLog />
  <ArchiveRadar />
</div>
```
