# DDD-V0.5.3 — Life Wheel Automatisée (Télémétrie)

> **ADR** : ADR-V0.5.3 · **Dossiers cibles** : `apps/life-wheel/pages/`

---

## Phase A : Moteur de Calcul (Télémétrie Asynchrone)

Puisque les stores ne peuvent pas "hooker" les autres de manière réactive facilement sans déclencher des appels circulaires, nous plaçons la logique de calcul de Télémétrie dans un Custom Hook qui s'exécute quand on ouvre le Dashboard de la Life Wheel.

### Étape A.1 : `useTelemetry.ts`
**NOUVEAU** `src/apps/life-wheel/hooks/useTelemetry.ts`
```typescript
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
       
       const completed = domainProjects.filter(p => p.status === 'completed').length;
       const activeProgress = domainProjects.filter(p => p.status === 'active')
                                           .reduce((acc, curr) => acc + curr.progress, 0);
       
       // Logique métier basique:
       // (Projets terminés * 100 + Progression projets actifs) / Total Projets
       let rawScore = ((completed * 100) + activeProgress) / domainProjects.length;
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
```

## Phase B : Double Calque Radar (CSS/SVG Pur)

### Étape B.1 : `WheelRadar.tsx`
Dans l'application Life Wheel (ex: `src/apps/life-wheel/components/WheelRadar.tsx`), tu peux utiliser du CSS ou SVG. L'A1 (Dev) adaptera le radar statique en injectant les datas de la télémétrie.

```typescript
import React from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

export function HybridRadar() {
  const telemetry = useTelemetry();
  const domains = useLifeWheelStore(s => s.domains);

  // Ce composant affiche des jauges par domaine à l'absence de chart SVG lourd
  return (
    <div className="p-8 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/50 mb-1">Telemetry Nexus</h3>
            <p className="text-[10px] text-white/30">Ambition vs Reality</p>
          </div>
          <div className="text-right">
             <span className="text-4xl font-black text-amber-500">{telemetry.global}%</span>
             <p className="text-[8px] uppercase tracking-widest text-amber-500/50 mt-1">Real Index</p>
          </div>
       </div>

       <div className="space-y-4">
         {domains.map(dom => {
            const realScore = telemetry.scores[dom.id] || 0;
            // "dom.score" était l'ancienne saisie manuelle (peut devenir l'ambition cible)
            // Laisse color le vrai score.
            return (
              <div key={dom.id} className="relative">
                 <div className="flex justify-between text-[9px] uppercase tracking-widest mb-1">
                   <span className="font-bold" style={{ color: dom.color }}>{dom.name}</span>
                   <span className="text-white/40">Real: {realScore}% | Target: {dom.score}%</span>
                 </div>
                 <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
                    {/* Calque Ambition (Target) */}
                    <div className="absolute top-0 left-0 h-full bg-white/10" style={{ width: `${dom.score}%` }} />
                    {/* Calque Réalité (Execution) */}
                    <div className="absolute top-0 left-0 h-full transition-all duration-1000" style={{ width: `${realScore}%`, backgroundColor: dom.color, opacity: 0.8 }} />
                 </div>
              </div>
            );
         })}
       </div>
    </div>
  );
}
```

*(A3: Remplacer l'affichage manuel du `Dashboard.tsx` de la Life Wheel par `HybridRadar`)*
