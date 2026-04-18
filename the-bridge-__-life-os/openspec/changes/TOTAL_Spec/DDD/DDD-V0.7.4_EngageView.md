# DDD-V0.7.4 — Machine à États & Engage View

> **ADR** : ADR-V0.7.4 · **Dossier** : `src/apps/gtd/pages/`

---

## Phase A : Extraction de EngageView

### Étape A.1 : `EngageView.tsx`
Créer la vue dédiée uniquement à l'exécution pure, sans l'Inbox.
```tsx
import React, { useMemo } from 'react';
import { Target, Play } from 'lucide-react';
import { useGtdStore } from '../../../stores/fw-gtd.store';
import { clsx } from 'clsx';

export function EngageView() {
  const allItems = useGtdStore(s => s.items); // Pas de filtre dans le sélecteur !
  const activeContext = useGtdStore(s => s.activeContext);
  const processItem = useGtdStore(s => s.processItem);

  // Le tri est fait mémorialement : Status = Actionable uniquement.
  const actionableTasks = useMemo(() => {
    return allItems
      .filter(i => i.status === 'actionable')
      .filter(i => activeContext === 'all' || i.context === activeContext)
      .sort((a,b) => {
         // High energy en premier
         if (a.energy === 'high' && b.energy !== 'high') return -1;
         if (b.energy === 'high' && a.energy !== 'high') return 1;
         return 0;
      });
  }, [allItems, activeContext]);

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex justify-center items-center border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
           <Target className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Engage Protocol</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Only actionable targets shown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
         {actionableTasks.map(task => (
            <div key={task.id} className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 transition-all flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => processItem(task.id, { status: 'incubating' }, 'Sent to incubated state')}
                    className="w-8 h-8 rounded-full border border-white/20 hover:bg-orange-500/20 hover:border-orange-500 transition-colors flex items-center justify-center"
                  >
                     <Play className="w-3 h-3 text-transparent group-hover:text-orange-400" fill="currentColor" />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-white/90">{task.content}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-bold uppercase tracking-widest text-white/30">
                       <span className="text-orange-400">{task.context || '@NONE'}</span>
                       {task.energy && <span>ENERGY: {task.energy}</span>}
                       {task.timeEstimate && <span>{task.timeEstimate} MIN</span>}
                    </div>
                  </div>
               </div>
               
               {/* Nexus Links (Visual only) */}
               <div className="flex gap-2">
                  {task.projectId && <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black tracking-widest uppercase">PARA</span>}
                  {task.goalId && <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-400 text-[8px] font-black tracking-widest uppercase">12WY</span>}
               </div>
            </div>
         ))}

         {actionableTasks.length === 0 && (
            <div className="text-center py-20 opacity-30 mt-10 border border-dashed border-white/10 rounded-[2rem]">
               <Target className="w-16 h-16 mx-auto mb-4" />
               <p className="text-xs uppercase tracking-[0.3em] font-bold">No targets acquired for context [{activeContext}]</p>
            </div>
         )}
      </div>
    </div>
  );
}
```

### Étape A.2 : L'Aiguillage du Dashboard
Modifie `Dashboard.tsx` pour enlever la barre de capture rapide locale et les listes "En dur", et agir comme un Router :
```tsx
// Dans Dashboard.tsx
import { EngageView } from './EngageView';

// ...
  const activeTab = useGtdStore(s => s.activeTab);

  if (activeTab === 'engage') {
    return <EngageView />;
  }
  
  // Rendre par défaut l'Overview (Statistiques / Clarify)
// ...
```
