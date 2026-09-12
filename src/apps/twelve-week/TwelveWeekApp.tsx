/** 12 Week Year App — Strategic Execution Framework (V0.6.1) */
import { useTwelveWeekStore, type WyVision, type WyGoal, type WyTactic } from '../../stores/fw-12wy.store';
import TwelveWeekDashboard from './pages/Dashboard';
import { 
  Zap, LayoutDashboard, Target, 
  TrendingUp, MessageSquare, Compass, 
  Search, Settings, Calendar, Flag, User, ChevronRight, Plus
} from 'lucide-react';
import { useState, useContext, useEffect, useMemo } from 'react';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { SidebarSearch } from '../../components/SidebarSearch';
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
import { clsx } from 'clsx';
import { VisionForgeModal } from './components/VisionForgeModal';
import { GoalForgeModal } from './components/GoalForgeModal';
import { TacticForgeModal } from './components/TacticForgeModal';
import { VisionCommandCard } from './components/VisionCommandCard';
import { GoalCommandCard } from './components/GoalCommandCard';

const twyNavItems: NavItem[] = [
  { id: 'overview',       label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'vision',         label: 'Vision',         icon: Compass },
  { id: 'planning',       label: 'Goals',          icon: Target },
  { id: 'process',        label: 'Tactics',        icon: Zap },
  { id: 'measurement',    label: 'Measurement',    icon: TrendingUp },
  { id: 'accountability', label: 'Accountability', icon: MessageSquare },
];

const weekFilters = [
  { id: 'all', label: 'Cycle' },
  ...Array.from({ length: 12 }, (_, i) => ({ id: `${i + 1}`, label: `W${i + 1}` })),
];

export default function TwelveWeekApp() {
  const { 
    activeTab, setActiveTab, activeWeek, setActiveWeek, 
    visions, goals, tactics, hydrate, isHydrated,
    addVision, addGoal, addTactic, updateTacticStatus,
    activeVisionId, activeGoalId
  } = useTwelveWeekStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTacticModalOpen, setIsTacticModalOpen] = useState(false);
  const { setActivePage } = useContext(WindowContext);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    const w = activeWeek === 'all' ? 'Cycle' : `W${activeWeek}`;
    const t = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(`${w} > ${t}`);
  }, [activeWeek, activeTab, setActivePage]);

  const handleNewItem = () => {
    if (activeTab === 'vision') setIsVisionModalOpen(true);
    if (activeTab === 'planning') setIsGoalModalOpen(true);
    if (activeTab === 'process') setIsTacticModalOpen(true);
  };

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-amber-500/30">
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar items={twyNavItems} activeTab={activeTab} onTabChange={setActiveTab as any} accentColor="teal" title="12 Week Year" subtitle="Temporal Engine" titleIcon={Zap} />
        <div className="mt-auto pb-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search 12WY..." />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8 min-w-0">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80 shrink-0">{activeTab}</h2>
            <HeaderFilterBar items={weekFilters} activeFilter={String(activeWeek)} onFilterChange={(id) => setActiveWeek(id === 'all' ? 'all' : Number(id))} accentColor="teal" scrollable />
          </div>
          <button 
            onClick={handleNewItem}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-teal-500/20 transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" /> New {activeTab === 'vision' ? 'Vision' : activeTab === 'planning' ? 'Goal' : 'Tactic'}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          {activeTab === 'overview' ? (
            <TwelveWeekDashboard embedded={false} />
          ) : activeTab === 'vision' ? (
            activeVisionId ? (
              <VisionCommandCard visionId={activeVisionId} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {visions.map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => useTwelveWeekStore.getState().setActiveVisionId(v.id)}
                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 transition-all cursor-pointer group"
                  >
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{v.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed truncate">{v.description || 'No vision constitution recorded yet.'}</p>
                  </div>
                ))}
                <button 
                  onClick={() => setIsVisionModalOpen(true)}
                  className="p-6 rounded-3xl border border-dashed border-white/10 hover:bg-white/5 transition-all flex flex-col items-center justify-center opacity-40 hover:opacity-100"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">New Vision</span>
                </button>
              </div>
            )
          ) : activeTab === 'planning' ? (
            activeGoalId ? (
              <GoalCommandCard goalId={activeGoalId} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {goals.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => useTwelveWeekStore.getState().setActiveGoalId(g.id)}
                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 transition-all cursor-pointer group"
                  >
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{g.title}</h3>
                      <p className="text-[9px] text-teal-400/60 uppercase tracking-widest">W{g.targetWeek} Goal</p>
                  </div>
                ))}
                {visions.length > 0 && (
                  <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="p-6 rounded-3xl border border-dashed border-white/10 hover:bg-white/5 transition-all flex flex-col items-center justify-center opacity-40 hover:opacity-100"
                  >
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Goal</span>
                  </button>
                )}
              </div>
            )
          ) : activeTab === 'process' ? (
            <div className="space-y-4 animate-in fade-in duration-500">
               {tactics.filter(t => activeWeek === 'all' || t.week === activeWeek).map(t => (
                 <div key={t.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => updateTacticStatus(t.id, t.status === 'completed' ? 'pending' : 'completed')}
                         className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${t.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-emerald-500/50'}`}
                       >
                         {t.status === 'completed' && <Zap className="w-3 h-3 text-white fill-white" />}
                       </button>
                       <span className={`text-sm font-medium ${t.status === 'completed' ? 'text-white/20 line-through' : 'text-white/80'}`}>{t.title}</span>
                    </div>
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Week {t.week}</span>
                 </div>
               ))}
               {goals.length > 0 && activeWeek !== 'all' && (
                 <button 
                   onClick={() => setIsTacticModalOpen(true)}
                   className="w-full p-4 rounded-2xl border border-dashed border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3 opacity-40 hover:opacity-100"
                 >
                   <Plus className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Deploy Tactic for W{activeWeek}</span>
                 </button>
               )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
               <Zap className="w-16 h-16 mb-4" />
               <h3 className="text-xl font-bold uppercase tracking-[0.5em]">Temporal Sync in Progress</h3>
               <p className="text-sm mt-2">Refactoring UI components for V0.6.1 Trinity Architecture.</p>
            </div>
          )}
        </div>
      </main>

      <VisionForgeModal isOpen={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)} />
      <GoalForgeModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <TacticForgeModal 
        isOpen={isTacticModalOpen} 
        onClose={() => setIsTacticModalOpen(false)} 
        prefilledWeek={activeWeek !== 'all' ? activeWeek : undefined}
      />
    </div>
  );
}

