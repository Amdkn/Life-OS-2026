# DDD-V0.4.5 — UX Spock : Laboratoire Areas

> **ADR** : ADR-V0.4.5 · **Dossier** : `the-bridge-__-life-os/src/`

---

## Phase A : Immutabilité (déjà couvert en V0.4.4.A.1)
Le masquage du bouton `+ New` sur Areas est géré dans le DDD-V0.4.4 (Phase A, Étape A.1).

## Phase B : Pillar Dashboard

### Étape B.1 : `PillarDashboard.tsx`
**NEW** `src/apps/para/components/PillarDashboard.tsx`
```typescript
import React, { useState } from 'react';
import { X, Activity, Zap } from 'lucide-react';
import { useParaStore, type LifeWheelDomain, type BusinessPillar } from '../../../stores/fw-para.store';
import { useGtdStore } from '../../../stores/fw-gtd.store';
import { useOsSettingsStore } from '../../../stores/os-settings.store';
import { DOMAIN_TO_LD } from '../../../utils/paraAdapter';

interface Props {
  domain: LifeWheelDomain;
  pillar: BusinessPillar;
  onClose: () => void;
}

export function PillarDashboard({ domain, pillar, onClose }: Props) {
  const allProjects = useParaStore(s => s.projects);
  const projects = allProjects.filter(p => p.domain === domain && p.pillars.includes(pillar) && p.status !== 'archived');
  const ldId = DOMAIN_TO_LD[domain];
  const allGtdItems = useGtdStore(s => s.items);
  const gtdActions = allGtdItems.filter(i => i.linkedLd === ldId && i.status === 'actionable');
  const config = useOsSettingsStore(s => s.domainConfigs?.find(c => c.domain === domain));
  const color = config?.color || '#10b981';
  const [healthGauge, setHealthGauge] = useState(50);

  return (
    <div className="mt-4 p-6 rounded-2xl bg-black/40 border border-white/10 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color }}>
          {domain} › {pillar}
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <span className="text-2xl font-black" style={{ color }}>{projects.length}</span>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Active Projects</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <span className="text-2xl font-black text-amber-400">{gtdActions.length}</span>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">GTD Actions</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <span className="text-2xl font-black text-white/60">{healthGauge}%</span>
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Health</p>
        </div>
      </div>

      {/* Projects list */}
      <div className="space-y-2 mb-6">
        <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="w-3 h-3" /> Projects (Picard)
        </h4>
        {projects.length === 0 ? (
          <p className="text-[10px] text-white/15 italic py-2">No active projects for this pillar.</p>
        ) : projects.map(p => (
          <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between text-xs">
            <span className="text-white/60">{p.title}</span>
            <span className="text-white/20">{p.progress}%</span>
          </div>
        ))}
      </div>

      {/* GTD Actions list */}
      <div className="space-y-2 mb-6">
        <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-3 h-3" /> GTD Actions
        </h4>
        {gtdActions.length === 0 ? (
          <p className="text-[10px] text-white/15 italic py-2">No actionable items for this domain.</p>
        ) : gtdActions.slice(0, 5).map(a => (
          <div key={a.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/50">
            {a.content}
          </div>
        ))}
      </div>

      {/* Health Gauge */}
      <div>
        <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3">Health Gauge (Manual)</h4>
        <input type="range" min={0} max={100} value={healthGauge} onChange={e => setHealthGauge(+e.target.value)}
          className="w-full accent-emerald-500 h-1.5" style={{ accentColor: color }} />
      </div>
    </div>
  );
}
```

### Étape B.2 : `DomainCard.tsx` — Intégration
```typescript
import { PillarDashboard } from './PillarDashboard';

// Dans le composant DomainCard, ajouter state :
const [activePillar, setActivePillar] = useState<BusinessPillar | null>(null);

// Sur chaque pilier (dans le grid) :
onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}

// Après le grid des piliers (dans le bloc isExpanded) :
{activePillar && (
  <PillarDashboard domain={domain} pillar={activePillar} onClose={() => setActivePillar(null)} />
)}
```
