/** 12 Week Year App — Strategic Execution Framework (V0.6.1) */
import { useTwelveWeekStore, type WyVision, type WyGoal, type WyTactic, ACTIVE_CYCLE } from '../../stores/fw-12wy.store';
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
import { pull12wyRocks } from '../../lib/sync.service';
import { useTwelveWeekStore } from '../../stores/fw-12wy.store';

const twyNavItems: NavItem[] = [
  { id: 'overview',       label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'vision',         label: 'Vision',         icon: Compass },
  { id: 'rocks',          label: 'Rocks',          icon: Target },
  { id: 'process',        label: 'Tactics',        icon: Zap },
  { id: 'measurement',    label: 'Measurement',    icon: TrendingUp },
  { id: 'accountability', label: 'Accountability', icon: MessageSquare },
];

const weekFilters = [
  { id: 'all', label: 'Cycle' },
  // Phase 5 — Cycle Q3 anchoring (Geordi 2026-06-22):
  // W1-W9 = Active (canon items 1-9 from plan §4)
  // W10-W12 = Rolling continuation (Chapel metrics + drift check)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    label: `W${i + 1}`,
    status: (i + 1) <= 9 ? 'active' : 'rolling',
  })),
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
    if (!isHydrated) {
      hydrate();
      // Phase 6 wire: pull Supabase rocks after IDB hydrate (D6 fix 2026-06-22).
      // Wait 100ms for IDB to commit before reading remote (avoid race condition).
      setTimeout(() => {
        void pull12wyRocks().then((syncResult) => {
          if (syncResult.rocks && syncResult.rocks.length > 0) {
            // Merge remote rocks into store goals (remote wins on id conflict)
            const store = useTwelveWeekStore.getState();
            const currentGoals = store.goals || [];
            const byId = new Map<string, any>();
            for (const g of currentGoals) byId.set(g.id, g);
            for (const r of syncResult.rocks) {
              byId.set(r.id, {
                id: r.id,
                type: 'wy-goal',
                title: r.title,
                targetWeek: r.week ?? 1,
                status: r.status === 'achieved' ? 'achieved' : r.status === 'in-progress' ? 'in-progress' : 'pending',
                definition_of_done: r.definition_of_done ?? '',
                visionId: undefined,
                projectId: undefined,
                created_at: r.created_at,
                updated_at: r.updated_at,
              });
            }
            useTwelveWeekStore.setState({ goals: Array.from(byId.values()) });
            console.debug('[12WY Sync] merged', syncResult.rocks.length, 'rocks from Supabase');
          }
        });
      }, 100);
    }
  }, [isHydrated, hydrate]);

  useEffect(() => {
    const w = activeWeek === 'all' ? 'Cycle' : `W${activeWeek}`;
    const t = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(`${w} > ${t}`);
  }, [activeWeek, activeTab, setActivePage]);

  const handleNewItem = () => {
    if (activeTab === 'vision') setIsVisionModalOpen(true);
    if (activeTab === 'rocks' || activeTab === 'planning') setIsGoalModalOpen(true); // Phase 3b — Rocks alias for legacy 'planning'
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
            <Plus className="w-3.5 h-3.5" /> New {activeTab === 'vision' ? 'Vision' : (activeTab === 'rocks' || activeTab === 'planning') ? 'Rock' : 'Tactic'}
          </button>
        </header>

        {/* Phase 5 — Cycle Q3 anchoring (Geordi 2026-06-22)
            Doctrine A0: A0 board observer passif. Tu codes, A0 valide.
            Intent canon: W1_Quarter_Intent_Q3_2026.md l.20 —
            "Q3 2026 = Activer le triptyque MORTY (12WY⊃PARA⊃DEAL) sur Life-OS-2026
            avec 6 frameworks Life OS canoniques orchestrés par 2 A1 Gatekeepers." */}
        <div className="cycle-context bg-amber-900/20 px-6 py-2.5 border-b border-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-400 uppercase tracking-[0.2em] text-[11px]">{ACTIVE_CYCLE.label}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">
              Intent: Activate Morty triptyque <span className="text-teal-400 font-mono">(12WY⊃PARA⊃DEAL)</span> on Life-OS-2026
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">W1-W9 Active</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">W10-W12 Rolling</span>
          </div>
        </div>

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
          ) : (activeTab === 'rocks' || activeTab === 'planning') ? (
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
                      <p className="text-[9px] text-teal-400/60 uppercase tracking-widest">W{g.targetWeek} Rock</p>
                  </div>
                ))}
                {visions.length > 0 && (
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="p-6 rounded-3xl border border-dashed border-white/10 hover:bg-white/5 transition-all flex flex-col items-center justify-center opacity-40 hover:opacity-100"
                  >
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Rock</span>
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
          ) : activeTab === 'accountability' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <header>
                <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-[var(--theme-text)]/80">Accountability — Process Control & Routing</h3>
                <p className="text-xs text-white/40 mt-2">M'Benga H1 — Single owner, single proof, zero process drift.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Planning Overload Guard — Una spec l.30 */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">Planning Overload Guard</h4>
                    <span className="text-[9px] font-black px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest">✅ Active</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">Una enforces: if more than 3 Rocks compete on the same Vision, flag <code className="text-amber-400">planning_overload</code>.</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Threshold: 3 Rocks / Vision</p>
                </div>

                {/* Cerritos Routing — Mariner → Boimler → Tendi */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-teal-400">Cerritos Routing</h4>
                    <span className="text-[9px] font-black px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-widest">✅ Active</span>
                  </div>
                  <ol className="text-xs text-white/60 leading-relaxed space-y-1 list-decimal list-inside">
                    <li><span className="text-teal-400 font-semibold">Mariner</span> Capture — raw Rock intake</li>
                    <li><span className="text-teal-400 font-semibold">Boimler</span> Clarify — Vision alignment check</li>
                    <li><span className="text-teal-400 font-semibold">Tendi</span> Organize — Week + Tactic slot</li>
                  </ol>
                </div>

                {/* Process Drift Detection — M'Benga H1 */}
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-rose-400">Process Drift Detection</h4>
                    <span className="text-[9px] font-black px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-widest">⚠️ Watch</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">H1 sampler — ZORA context-switch score. 0-1 green, 2-3 yellow, 4+ red (escalate Beth).</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">H1 Poll: every 4h</p>
                </div>
              </div>
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

