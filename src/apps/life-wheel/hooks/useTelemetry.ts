import { useMemo } from 'react';
import { useParaStore } from '../../../stores/fw-para.store';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

export function useTelemetry() {
  const projects = useParaStore(s => s.projects);
  const domains = useLifeWheelStore(s => s.domains); // Les 8 statiques

  const telemetry = useMemo(() => {
    const scores: Record<string, number> = {};
    let globalRealScore = 0;
    
    domains.forEach(domain => {
       // On cherche les projets PARA appartenant au même titre de domaine (en lowercase)
       const domainProjects = projects.filter(p => p.domain.toLowerCase() === domain.name.toLowerCase());
       if (domainProjects.length === 0) {
          scores[domain.id] = 0;
          return;
       }
       
       const completedCount = domainProjects.filter(p => p.status === 'completed').length;
       const activeProgress = domainProjects.filter(p => p.status === 'active')
                                           .reduce((acc, curr) => acc + curr.progress, 0);
       
       // Logique métier basique:
       // (Projets terminés * 100 + Progression projets actifs) / Total Projets
       let rawScore = ((completedCount * 100) + activeProgress) / domainProjects.length;
       scores[domain.id] = Math.min(100, Math.round(rawScore));
       globalRealScore += scores[domain.id];
    });

    return {
      scores, // { 'd1': 45, 'd2': 80 ... }
      global: Math.round(globalRealScore / domains.length)
    };

  }, [projects, domains]);

  return telemetry;
}
