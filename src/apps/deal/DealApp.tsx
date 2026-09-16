/** DEAL App — Friction Analysis & Liberation Framework (V0.2.9) */
import { useDealStore, type DealItem, type Muse } from '../../stores/fw-deal.store';
import { useParaStore } from '../../stores/fw-para.store';
import DealDashboard from './pages/Dashboard';
import {
  Scan, LayoutDashboard, Scissors,
  Zap, LockOpen, Search, Settings,
  ShieldAlert, Trophy, ArrowRight, DollarSign,
  ArchiveRestore
} from 'lucide-react';
import { useState, useContext, useEffect, useMemo } from 'react';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { SidebarSearch } from '../../components/SidebarSearch';
import { clsx } from 'clsx';
import { MuseCard } from './components/MuseCard';
import { DealProtostarView } from './DealProtostarView';

const dealNavItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard', icon: LayoutDashboard },
  { id: 'define',    label: 'Define',    icon: Scan },
  { id: 'eliminate', label: 'Eliminate', icon: Scissors },
  { id: 'automate',  label: 'Automate',  icon: Zap },
  { id: 'liberate',  label: 'Liberate',  icon: LockOpen },
  { id: 'muses',     label: 'Muses',     icon: Trophy },
];

export default function DealApp() {
  const { activeTab, setActiveTab, items, muses, loadFromDB, isLoaded } = useDealStore();
  const { projects } = useParaStore(); // For future integration
  const [searchQuery, setSearchQuery] = useState('');
  const [showGraveyard, setShowGraveyard] = useState(false);
  const { setActivePage } = useContext(WindowContext);

  useEffect(() => {
    if (!isLoaded) loadFromDB();
  }, [isLoaded, loadFromDB]);

  useEffect(() => {
    const t = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(t);
  }, [activeTab, setActivePage]);

  const filteredItems = useMemo(() => {
    return items.filter(i =>
      (activeTab === 'overview' || i.step === activeTab) &&
      (i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [items, activeTab, searchQuery]);

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-rose-500/30">
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar
          items={dealNavItems}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          accentColor="red"
          title="DEAL Protocol"
          subtitle="Efficiency"
          titleIcon={LockOpen}
        />
        <div className="mt-auto pb-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Scan frictions..." />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-rose-500/[0.01] via-transparent to-emerald-500/[0.01]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80">{activeTab}</h2>
            {activeTab === 'muses' && (
              <button
                onClick={() => setShowGraveyard(!showGraveyard)}
                className="text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <ArchiveRestore className="w-3.5 h-3.5" />
                {showGraveyard ? 'View Active Fleet' : 'View Graveyard'}
              </button>
            )}
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          {activeTab === 'overview' ? (
            <DealDashboard embedded={false} />
          ) : activeTab === 'muses' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
              {muses
                .filter(m => showGraveyard ? m.status === 'deprecated' : m.status !== 'deprecated')
                .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(muse => (
                  <MuseCard key={muse.id} muse={muse} />
                ))}
            </div>
          ) : (
            <DealProtostarView items={filteredItems} />
          )}
        </div>
      </main>
    </div>
  );
}
