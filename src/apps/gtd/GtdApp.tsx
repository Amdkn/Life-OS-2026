/** GTD App — Capture & Organization Framework (V0.2.8) */
import { useGtdStore, type GTDItem } from '../../stores/fw-gtd.store';
import GtdDashboard from './pages/Dashboard';
import { OrganizeView } from './pages/OrganizeView';
import { EngageView } from './pages/EngageView';
import { ClarifyView } from './pages/ClarifyView';
import { 
  Inbox, LayoutDashboard, ListTodo, 
  RotateCcw, Zap, Search, Settings, 
  Filter, CheckCircle2, Plus, ArrowRight, ShieldAlert
} from 'lucide-react';
import { useState, useContext, useEffect, useMemo } from 'react';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';
import { SidebarSearch } from '../../components/SidebarSearch';
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
import { clsx } from 'clsx';

const gtdNavItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard', icon: LayoutDashboard },
  { id: 'capture',   label: 'Capture',   icon: Plus },
  { id: 'clarify',   label: 'Clarify',   icon: RotateCcw },
  { id: 'organize',  label: 'Organize',  icon: ListTodo },
  { id: 'reflect',   label: 'Review',    icon: ShieldAlert },
  { id: 'engage',    label: 'Engage',    icon: Zap },
];

const contextFilters = [
  { id: 'all', label: 'All Contexts' },
  { id: '@home', label: '@Home' },
  { id: '@work', label: '@Work' },
  { id: '@errands', label: '@Errands' },
  { id: 'waiting', label: 'Waiting' },
  { id: 'someday', label: 'Someday' },
];

export default function GtdApp() {
  const { activeTab, setActiveTab, activeContext, setActiveContext, items, addItem, loadFromDB, isLoaded } = useGtdStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { setActivePage } = useContext(WindowContext);

  useEffect(() => {
    if (!isLoaded) loadFromDB();
  }, [isLoaded, loadFromDB]);

  useEffect(() => {
    const c = contextFilters.find(f => f.id === activeContext)?.label || 'All';
    const t = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(`${c} > ${t}`);
  }, [activeContext, activeTab, setActivePage]);

  const unprocessedCount = items.filter(i => i.status === 'inbox').length;

  const filteredItems = useMemo(() => {
    return items.filter(i => 
      (activeTab === 'overview' || (activeTab === 'capture' && i.status === 'inbox') || (activeTab === 'organize' && i.status === 'actionable')) &&
      (activeContext === 'all' || i.context === activeContext)
    );
  }, [items, activeTab, activeContext]);

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-blue-500/30">
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar
          items={gtdNavItems.map(i => i.id === 'clarify' ? { ...i, badge: unprocessedCount } : i)}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          accentColor="blue"
          title="GTD System"
          subtitle="Protocol"
          titleIcon={CheckCircle2}
        />
        <div className="mt-auto pb-6">
          <SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks..." />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-blue-500/[0.01] via-transparent to-purple-500/[0.01]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8 min-w-0">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80 shrink-0 whitespace-nowrap">{activeTab}</h2>
            <HeaderFilterBar items={contextFilters} activeFilter={activeContext} onFilterChange={setActiveContext} accentColor="blue" scrollable />
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/80 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {activeTab === 'overview' && <GtdDashboard embedded={false} />}
          {activeTab === 'clarify' && <ClarifyView />}
          {(activeTab === 'organize' || activeTab === 'capture' || activeTab === 'reflect') && <OrganizeView />}
          {activeTab === 'engage' && <EngageView />}
        </div>
      </main>
    </div>
  );
}

