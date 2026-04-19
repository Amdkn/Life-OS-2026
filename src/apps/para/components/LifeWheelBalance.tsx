import React from 'react';
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
      <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.3em] mb-6 px-1">Life Wheel Balance</h3>
      <div className="space-y-3">
        {DOMAINS.map(domain => {
          const count = projects.filter(p => p.domain === domain).length;
          const pct = Math.round((count / total) * 100);
          const config = domainConfigs?.find(c => c.domain === domain);
          const color = config?.color || '#10b981';
          return (
            <div key={domain} className="flex items-center gap-3">
              <span className="w-20 text-[9px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest truncate">
                {config?.label || domain}
              </span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              <span className="w-8 text-right text-[9px] font-black text-[var(--theme-text)]/30">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
