import React, { useState, useEffect, useMemo } from 'react';
import { Target, Inbox, Coffee, Play, Square, Pause, RotateCcw } from 'lucide-react';
import { useTwelveWeekStore, type TimeBlockType, type WyTimeBlock } from '../../../stores/fw-12wy.store';
import { useDealStore } from '../../../stores/fw-deal.store';

const BLOCKS = [
  { type: 'strategic' as TimeBlockType, label: 'Strategic (3h Focus)', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', defaultMinutes: 180 },
  { type: 'buffer' as TimeBlockType, label: 'Buffer (Admin/Comm)', icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', defaultMinutes: 30 },
  { type: 'breakout' as TimeBlockType, label: 'Breakout (Recharge)', icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', defaultMinutes: 60 },
];

export function TimeUseMatrix({ week }: { week: number }) {
  const allTimeBlocks = useTwelveWeekStore(s => s.timeBlocks);
  const timeBlocks = allTimeBlocks.filter(b => b.week === week);
  const addTimeBlock = useTwelveWeekStore(s => s.addTimeBlock);
  const updateTimeBlock = useTwelveWeekStore(s => s.updateTimeBlock);
  const activeCycleId = useTwelveWeekStore(s => s.activeCycleId);

  const muses = useDealStore(s => s.muses);
  const totalMuseTax = useMemo(() => {
    return muses
       .filter(m => m.status === 'operational')
       .reduce((acc, m) => acc + (m.timeCost || 0), 0);
  }, [muses]);

  const [activeTimer, setActiveTimer] = useState<{
    blockType: TimeBlockType;
    startTime: number;
    duration: number; // in minutes
    pausedTime?: number;
    totalPausedDuration: number;
    id?: string; // id si block existant
  } | null>(null);

  const [now, setNow] = useState(Date.now());
  const [editingDuration, setEditingDuration] = useState<TimeBlockType | null>(null);
  const [customDuration, setCustomDuration] = useState(60);

  useEffect(() => {
    if (!activeTimer || activeTimer.pausedTime) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleStartTimer = (type: TimeBlockType, minutes: number) => {
    if (activeTimer) {
      if (activeTimer.blockType === type && activeTimer.pausedTime) {
        // Resume
        setActiveTimer({
          ...activeTimer,
          totalPausedDuration: activeTimer.totalPausedDuration + (Date.now() - activeTimer.pausedTime),
          pausedTime: undefined
        });
        setNow(Date.now());
      }
      return; // Already running or overlapping rejected
    }

    const existing = timeBlocks.find(b => b.blockType === type && !b.completed);

    if (minutes <= 0) return;

    setActiveTimer({
      blockType: type,
      startTime: Date.now(),
      duration: minutes,
      totalPausedDuration: 0,
      id: existing?.id
    });
    setNow(Date.now());
    setEditingDuration(null);
  };

  const handlePauseTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTimer && !activeTimer.pausedTime) {
      setActiveTimer({ ...activeTimer, pausedTime: Date.now() });
    }
  };

  const handleCancelTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTimer(null);
  };

  const handleCompleteTimer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeTimer) return;

    const existing = activeTimer.id ? timeBlocks.find(b => b.id === activeTimer.id) : null;
    const endTime = Date.now();

    if (existing) {
      await updateTimeBlock({
        ...existing,
        completed: true,
        startTime: activeTimer.startTime,
        endTime: endTime,
        duration: activeTimer.duration,
        ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        updatedAt: Date.now()
      });
    } else {
      await addTimeBlock({
        id: crypto.randomUUID(), type: 'wy-timeblock', status: 'active',
        title: `${activeTimer.blockType} W${week}`, week, blockType: activeTimer.blockType, completed: true,
        description: '', updatedAt: Date.now(), createdAt: Date.now(),
        startTime: activeTimer.startTime,
        endTime: endTime,
        duration: activeTimer.duration,
        ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cycleId: activeCycleId || undefined
      } as WyTimeBlock);
    }
    setActiveTimer(null);
  };

  const handleEditClick = (type: TimeBlockType, defaultMins: number) => {
    if (activeTimer && activeTimer.blockType !== type) return; // Disallow editing if another is running
    setEditingDuration(type);
    setCustomDuration(defaultMins);
  };

  const renderTimerContent = (def: any) => {
    if (activeTimer && activeTimer.blockType === def.type) {
      const isPaused = !!activeTimer.pausedTime;
      const effectiveNow = isPaused ? activeTimer.pausedTime! : now;
      const elapsed = Math.max(0, effectiveNow - activeTimer.startTime - activeTimer.totalPausedDuration);
      const remainingMs = Math.max(0, activeTimer.duration * 60000 - elapsed);
      const remainingSecs = Math.floor(remainingMs / 1000);
      const m = Math.floor(remainingSecs / 60);
      const s = remainingSecs % 60;

      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className={`text-xl font-black font-mono tracking-widest ${def.color}`}>
            {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
          </div>
          <div className="flex gap-2">
            <button onClick={isPaused ? () => handleStartTimer(def.type, activeTimer.duration) : handlePauseTimer} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70">
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button onClick={handleCompleteTimer} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70">
              <Square className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleCancelTimer} className="p-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (editingDuration === def.type) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
           <input
             type="number"
             value={customDuration}
             onChange={e => setCustomDuration(Number(e.target.value))}
             className="w-16 bg-black/40 text-white text-center text-xs font-mono py-1 rounded border border-white/10"
             autoFocus
           />
           <span className="text-[8px] text-white/40 uppercase">Minutes</span>
           <div className="flex gap-2 mt-1">
             <button onClick={() => handleStartTimer(def.type, customDuration)} className="text-[9px] px-2 py-1 bg-white/10 rounded font-bold text-white/80 hover:bg-white/20">START</button>
             <button onClick={(e) => { e.stopPropagation(); setEditingDuration(null); }} className="text-[9px] px-2 py-1 bg-white/5 rounded text-white/40 hover:bg-white/10">CANCEL</button>
           </div>
        </div>
      );
    }

    return (
      <>
        <def.icon className={`w-5 h-5 mb-2 transition-transform text-white/20 group-hover:scale-110 group-hover:${def.color}`} />
        <span className={`text-[9px] uppercase tracking-widest font-black text-center leading-tight text-white/40 group-hover:${def.color}`}>{def.label}</span>
      </>
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-black/40 border border-white/5 shadow-xl backdrop-blur-md">
       <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4 px-1">Time Use Matrix</h4>
       <div className="grid grid-cols-3 gap-4">
         {BLOCKS.map(def => {
           const block = timeBlocks.find(b => b.blockType === def.type);
           const isDone = block?.completed;
           const isActive = activeTimer?.blockType === def.type;
           const isDisabled = activeTimer && !isActive;

           if (isDone) {
             return (
               <div key={def.type} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${def.bg} ${def.border}`}>
                  <def.icon className={`w-5 h-5 mb-2 transition-transform ${def.color} scale-110`} />
                  <span className={`text-[9px] uppercase tracking-widest font-black text-center leading-tight ${def.color}`}>{def.label}</span>
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black bg-white/10 px-2 py-0.5 rounded text-white/60 tracking-tighter uppercase">COMPLETED</span>
                  </div>
               </div>
             );
           }

           return (
             <div
                key={def.type}
                onClick={() => !isDisabled && !isActive && handleEditClick(def.type, def.defaultMinutes)}
                className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all overflow-hidden ${
                  isActive ? `border-[1px] border-white/10 bg-white/5` :
                  isDisabled ? 'opacity-30 cursor-not-allowed border-white/5 bg-white/[0.01]' :
                  'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10 cursor-pointer'
                }`}
             >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none opacity-50`} />
                )}
                {renderTimerContent(def)}
             </div>
           );
         })}
       </div>

       {totalMuseTax > 0 && (
         <div className="flex justify-between items-center px-5 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mt-6 shadow-[0_0_15px_rgba(244,63,94,0.05)]">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em]">Muses Maintenance Tax</span>
           </div>
           <span className="text-sm font-black text-rose-500 font-mono">{totalMuseTax} h / week</span>
         </div>
       )}
    </div>
  );
}
