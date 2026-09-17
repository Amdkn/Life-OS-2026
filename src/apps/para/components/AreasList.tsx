import React from 'react';
import { useParaStore } from '../../../stores/fw-para.store';
import { JERRY_SQUADS } from '../../../utils/jerrySquads';
import { DomainCard } from './DomainCard';
import { LD_TO_DOMAIN } from '../../../utils/paraAdapter';

export function AreasList() {
  const { areas, projects, activeLdFilter } = useParaStore();

  const domainFilters = [
    { id: 'all', label: 'All Domains' },
    { id: 'ld01', label: 'Business' },
    { id: 'ld02', label: 'Finance' },
    { id: 'ld03', label: 'Health' },
    { id: 'ld04', label: 'Cognition' },
    { id: 'ld05', label: 'Relations' },
    { id: 'ld06', label: 'Habitat' },
    { id: 'ld07', label: 'Creativity' },
    { id: 'ld08', label: 'Impact' },
  ];

  const activeDomains = domainFilters
    .filter(f => f.id !== 'all' && (activeLdFilter === 'all' || f.id === activeLdFilter))
    .map(d => LD_TO_DOMAIN[d.id as keyof typeof LD_TO_DOMAIN]);

  return (
    <div className="flex flex-col gap-8">
      {activeDomains.map(domain => {
        const area = areas.find(a => a.domain === domain);
        const dProjects = projects.filter(p => p.domain === domain && p.status !== 'archived');
        const squad = JERRY_SQUADS[domain];

        return (
          <div key={domain} className="flex flex-col gap-4">
             {area && (
               <div className="px-2">
                 <h3 className="text-xl font-bold text-[var(--theme-text)]/90 tracking-wide">{area.name}</h3>
                 {area.notes && <p className="text-sm text-[var(--theme-text)]/50 mt-1">{area.notes}</p>}
                 {squad && (
                   <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-[var(--theme-text)]/50 uppercase tracking-wider">
                     <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5">{squad.name}</span>
                     <span>{squad.standard}</span>
                     <span>•</span>
                     <span>{squad.focus}</span>
                   </div>
                 )}
               </div>
             )}
            <DomainCard
              domain={domain}
              activeProjects={dProjects}
            />
          </div>
        );
      })}
    </div>
  );
}
