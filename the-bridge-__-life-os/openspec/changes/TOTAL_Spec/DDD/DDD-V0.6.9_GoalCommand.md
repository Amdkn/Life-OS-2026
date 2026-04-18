# DDD-V0.6.9 — Goal Central Command (La Salle Tactique)

> **ADR** : ADR-V0.6.9 · **Dossier** : `the-bridge-__-life-os/src/apps/twelve-week/`

---

## Phase A : L'État de Focus Goal (Zustand)

### Étape A.1 : `fw-12wy.store.ts`
*(Si pas fait en V0.6.8, ajouter `activeGoalId: string | null` et son setter).*

---

## Phase B : La Salle Tactique (Execution Hub)

### Étape B.1 : `GoalCommandCard.tsx`
**NOUVEAU FICHIER** : `src/apps/twelve-week/components/GoalCommandCard.tsx`

```tsx
import React from 'react';
import { ArrowLeft, Target, Shield, CheckCircle2, Circle, ArrowRightSquare, Box } from 'lucide-react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { clsx } from 'clsx';

export function GoalCommandCard({ goalId }: { goalId: string }) {
  const setActiveGoalId = useTwelveWeekStore(s => s.setActiveGoalId);
  const goal = useTwelveWeekStore(s => s.goals.find(g => g.id === goalId));
  const tactics = useTwelveWeekStore(s => s.tactics.filter(t => t.goalId === goalId));
  const toggleTactic = useTwelveWeekStore(s => s.updateTacticStatus);
  const activeWeek = useTwelveWeekStore(s => s.activeWeek);

  // Nexus Resolution
  const paraProjects = useParaStore(s => s.projects);
  const linkedProject = paraProjects.find(p => p.id === goal?.projectId);

  if (!goal) return null;

  return (
    <div className="flex-1 flex flex-col p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={() => setActiveGoalId(null)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#FFF]/40 hover:text-[#FFF]/80 transition-colors mb-8 w-max"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Theater
      </button>

      <div className="flex items-center gap-4 mb-10">
         <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex justify-center items-center shadow-[0_0_30px_rgba(20,184,166,0.15)]">
           <Target className="w-8 h-8 text-teal-400" />
         </div>
         <div>
           <h1 className="text-4xl font-black text-white tracking-tight">{goal.title}</h1>
           <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded mt-2 inline-block">Deadline: W{goal.targetWeek}</span>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* L E F T   C O L U M N : TACTICS MATRIX */}
        <div className="col-span-12 lg:col-span-8">
           <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFF]/50 mb-6 flex items-center gap-2">
             <Shield className="w-4 h-4 text-emerald-400" /> Executive Tactics
           </h2>
           
           <div className="space-y-3">
             {tactics.sort((a,b) => a.week - b.week).map(tactic => {
                const isCurrent = activeWeek !== 'all' && tactic.week === activeWeek;
                const isDone = tactic.status === 'completed';

                return (
                  <div key={tactic.id} className={clsx(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                    isCurrent ? "bg-white/[0.05] border-white/20" : "bg-black/40 border-white/10 hover:bg-[#111]",
                    isDone && "opacity-60"
                  )}
                  onClick={() => toggleTactic(tactic.id, isDone ? 'pending' : 'completed')}
                  >
                     <div className="w-10 flex-shrink-0 text-center">
                        <span className={clsx(
                          "text-[10px] font-black tracking-widest",
                          isDone ? "text-emerald-500" : (isCurrent ? "text-white" : "text-white/40")
                        )}>
                          W{tactic.week}
                        </span>
                     </div>
                     <div className="flex-1">
                        <p className={clsx("font-medium transition-all", isDone ? "line-through text-white/50" : "text-white")}>
                          {tactic.title}
                        </p>
                     </div>
                     <div className="flex-shrink-0">
                        {isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-white/20 group-hover:text-emerald-400/50" />}
                     </div>
                  </div>
                );
             })}
             
             {tactics.length === 0 && (
                <div className="w-full py-10 border border-dashed border-emerald-500/20 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-emerald-500/5 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Deploy New Tactic</p>
                </div>
             )}
           </div>
        </div>

        {/* R I G H T   C O L U M N : THE NEXUS */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           
           {/* PARA HUB */}
           <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-4 flex items-center gap-2">
                <Box className="w-4 h-4" /> PARA Bridge (Read-Only)
              </h3>
              {linkedProject ? (
                 <div className="p-4 bg-black/60 rounded-xl border border-[#FFF]/5">
                   <p className="font-bold text-white text-sm">{linkedProject.title}</p>
                   <p className="text-[9px] uppercase tracking-widest text-[#FFF]/40 mt-1">Project Active</p>
                 </div>
              ) : (
                 <div className="p-4 bg-black/40 rounded-xl border border-dashed border-[#FFF]/10 text-center">
                   <p className="text-[10px] uppercase tracking-widest text-[#FFF]/30">Unlinked Execution</p>
                 </div>
              )}
           </div>

           {/* GTD INBOX PLACEHOLDER */}
           <div className="p-6 rounded-3xl bg-[#111]/80 border border-dashed border-[#FFF]/10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF]/40 mb-4 flex items-center gap-2">
                <ArrowRightSquare className="w-4 h-4" /> GTD Actions Inbox
              </h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse mb-3" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Awaiting V0.7 Neural Link</p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
```
*(A3: Remplacer le rendu de Dashboard.tsx si `activeGoalId` est non-null pour afficher `<GoalCommandCard>`)*
