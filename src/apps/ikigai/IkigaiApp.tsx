/** Ikigai App — Life Purpose & Alignment Framework (V0.5.1) */
import { useMemo, useState, useContext, useEffect } from 'react';
import { useIkigaiStore, type IkigaiPillar, type IkigaiHorizon, type IkigaiVision } from '../../stores/fw-ikigai.store';
import { 
  Compass, Heart, Target, Briefcase, Zap, 
  LayoutDashboard, Plus, Anchor, Sparkles
} from 'lucide-react';
import { WindowContext } from '../../contexts/WindowContext';
import { SidebarSearch } from '../../components/SidebarSearch';
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { IkigaiItemCard } from './components/IkigaiItemCard';
import { IkigaiDetailPanel } from './components/IkigaiDetailPanel';
import { VisionModal } from './components/VisionModal';

const ikigaiNavItems: NavItem[] = [
  { id: 'all',      label: 'Overview',  icon: LayoutDashboard },
  { id: 'passion',  label: 'Passion',   icon: Heart },
  { id: 'mission',  label: 'Mission',   icon: Target },
  { id: 'vocation', label: 'Vocation',  icon: Briefcase },
  { id: 'craft',    label: 'Profession', icon: Zap },
];

const horizonFilters = [
  { id: 'all', label: 'All Horizons' },
  { id: 'H1',  label: 'H1 (1yr)' },
  { id: 'H3',  label: 'H3 (3yr)' },
  { id: 'H10', label: 'H10 (10yr)' },
  { id: 'H30', label: 'H30 (30yr)' },
  { id: 'H90', label: 'H90 (Life)' },
];

export default function IkigaiApp() {
  const { visions, activePillar, setActivePillar, activeHorizon, setActiveHorizon, hydrate, isHydrated } = useIkigaiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<IkigaiVision | null>(null);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const { setActivePage } = useContext(WindowContext);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  const filteredItems = useMemo(() => {
    let items = visions.filter(v => 
      (activePillar === 'all' || v.pillar === activePillar) &&
      (activeHorizon === 'all' || v.horizon === activeHorizon)
    );
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q));
    }
    return items;
  }, [visions, activePillar, activeHorizon, searchQuery]);

  useEffect(() => {
    const h = activeHorizon === 'all' ? 'All' : activeHorizon;
    const p = activePillar === 'all' ? 'Overview' : activePillar.charAt(0).toUpperCase() + activePillar.slice(1);
    setActivePage(`${h} > ${p}`);
  }, [activeHorizon, activePillar, setActivePage]);

  const canForge = activePillar !== 'all' && activeHorizon !== 'all';

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-emerald-500/30 relative">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar
          items={ikigaiNavItems}
          activeTab={activePillar}
          onTabChange={setActivePillar as any}
          accentColor="purple"
          title="Ikigai"
          subtitle="Constitution"
          titleIcon={Compass}
        />
        <div className="mt-auto pb-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search purpose..." />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-purple-500/[0.02] via-transparent to-amber-500/[0.02]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8 min-w-0">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80 shrink-0">
              {activePillar === 'all' ? 'Core' : activePillar}
            </h2>
            <HeaderFilterBar 
              items={horizonFilters} 
              activeFilter={activeHorizon} 
              onFilterChange={setActiveHorizon as any} 
              accentColor="purple"
              scrollable
            />
          </div>
          <button 
            disabled={!canForge}
            onClick={() => setIsForgeOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-500/20 transition-all active:scale-95 shadow-lg disabled:opacity-20 disabled:grayscale"
          >
            <Plus className="w-3.5 h-3.5" />
            Forge Vision
          </button>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {filteredItems.map(item => (
              <IkigaiItemCard key={item.id} item={item as any} onClick={setSelectedItem as any} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-40 flex flex-col items-center gap-4 opacity-20">
                <Anchor className="w-12 h-12" />
                <p className="text-[11px] uppercase tracking-[0.5em] font-bold">
                  {canForge ? 'Forge a new vision node for this intersection' : 'Select a Pillar and Horizon to forge principles'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <IkigaiDetailPanel item={selectedItem as any} onClose={() => setSelectedItem(null)} />

      {isForgeOpen && canForge && (
        <VisionModal 
          pillar={activePillar as IkigaiPillar} 
          horizon={activeHorizon as IkigaiHorizon} 
          onClose={() => setIsForgeOpen(false)} 
        />
      )}
    </div>
  );
}
