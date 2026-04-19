/** Life Wheel App — Life Balance & Equilibrium Framework (V0.5.x Refactoring) */
import { useLifeWheelStore, type WheelDomain } from '../../stores/fw-wheel.store';
import { useLifeWheelAggregation } from './hooks/useLifeWheelAggregation';
import { useTelemetry } from './hooks/useTelemetry';
import LifeWheelDashboard from './pages/Dashboard';
import { 
  CircleDot, LayoutDashboard, PieChart, 
  TrendingUp, Target, Search, Settings, Plus,
  ChevronRight
} from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { SidebarSearch } from '../../components/SidebarSearch';
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
import { AmbitionModal } from './components/AmbitionModal';
import { DomainCentralCard } from './components/DomainCentralCard';

const wheelNavItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard', icon: LayoutDashboard },
  { id: 'domains',   label: 'Domains',   icon: Target },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'growth',    label: 'Growth',    icon: TrendingUp },
];

const wheelHeaderFilters = [
  { id: 'radar', label: 'Radar' },
  { id: 'history', label: 'History' },
];

export default function LifeWheelApp() {
  const { activeTab, setActiveTab, globalScore, hydrate, isHydrated, domains } = useLifeWheelStore();
  const [activeHeaderFilter, setActiveHeaderFilter] = useState('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<WheelDomain | null>(null);
  
  const { setActivePage } = useContext(WindowContext);
  const telemetry = useTelemetry();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    const tabLabel = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(`${activeHeaderFilter} > ${tabLabel}`);
  }, [activeHeaderFilter, activeTab, setActivePage]);
  
  useLifeWheelAggregation();

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-amber-500/30 relative">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar
          items={wheelNavItems}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          accentColor="amber"
          title="Life Wheel"
          subtitle="Constitution"
          titleIcon={CircleDot}
        />
        
        <div className="mt-auto flex flex-col gap-6 p-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search data..." />
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest">Global Balance</span>
              <span className="text-xs font-bold text-amber-400">{globalScore}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
              <div 
                className="h-full bg-amber-500/50 transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                style={{ width: `${globalScore}%` }} 
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80">
              {activeTab === 'overview' ? 'Equilibrium' : activeTab}
            </h2>
            {activeTab === 'overview' && (
              <HeaderFilterBar 
                items={wheelHeaderFilters} 
                activeFilter={activeHeaderFilter} 
                onFilterChange={setActiveHeaderFilter} 
                accentColor="amber"
              />
            )}
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsForgeOpen(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-500/20 transition-all active:scale-95 shadow-lg"
             >
                <Plus className="w-3.5 h-3.5" /> Forge Ambition
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar relative">
          {activeTab === 'overview' ? (
            <LifeWheelDashboard embedded={false} />
          ) : activeTab === 'domains' ? (
            <div className="grid grid-cols-12 gap-8 h-full">
              {/* Organized Domain List */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
                <h3 className="text-[10px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.3em] mb-4 px-2">Sovereign Domains</h3>
                {domains.map(dom => (
                  <button
                    key={dom.id}
                    onClick={() => setSelectedDomain(dom)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all group
                      ${selectedDomain?.id === dom.id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dom.color, boxShadow: `0 0 8px ${dom.color}` }} />
                      <span className="text-sm font-bold uppercase tracking-wider text-[var(--theme-text)]/80 group-hover:text-[var(--theme-text)]">
                        {dom.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black font-mono text-[var(--theme-text)]/20">{telemetry.scores[dom.id] || 0}%</span>
                       <ChevronRight className={`w-4 h-4 transition-transform ${selectedDomain?.id === dom.id ? 'translate-x-1 text-amber-500' : 'text-white/10 group-hover:text-white/30'}`} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Central Info Placeholder (if no domain selected) */}
              <div className="col-span-12 lg:col-span-8 flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 rounded-[2.5rem]">
                 <Target className="w-16 h-16 mb-6" />
                 <p className="text-xs uppercase tracking-[0.5em] font-bold text-center">Select a domain to view Constitution</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
              <PieChart className="w-16 h-16 text-amber-400/20" />
              <p className="text-xs uppercase tracking-[0.5em] font-bold">{activeTab} Protocol Offline</p>
            </div>
          )}

          {/* Majestic Central Card */}
          {selectedDomain && (
            <DomainCentralCard 
              domain={selectedDomain} 
              onClose={() => setSelectedDomain(null)} 
            />
          )}
        </div>
      </main>

      {isForgeOpen && (
        <AmbitionModal onClose={() => setIsForgeOpen(false)} />
      )}
    </div>
  );
}
