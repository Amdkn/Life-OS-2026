/** App Store & Settings App — OS Ecosystem Hub (V0.1.9) */
import { useOsSettingsStore } from '../../stores/os-settings.store';
import StoreDashboard from './pages/Dashboard';
import { 
  ShoppingBag, LayoutDashboard, Search, 
  Settings, Palette, Monitor, Package,
  Download, Star
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useContext, useEffect } from 'react';
import { WindowContext } from '../../contexts/WindowContext';
import { AppNavBar, type NavItem } from '../../components/AppNavBar';

const marketplaceApps = [
  { id: 'brain-map', name: 'Brain Map A2', desc: 'Advanced neural visualization for areas.', price: 'Free', rating: 4.9, icon: ShoppingBag, color: 'text-amber-400' },
  { id: 'bio-sync',  name: 'BioSync L1',   desc: 'Health integration with wearable data.', price: '$2.99', rating: 4.7, icon: ShoppingBag, color: 'text-red-400' },
  { id: 'deep-work', name: 'DeepWork Mod', desc: 'A3 focus timer and automation.', price: 'Free', rating: 4.8, icon: ShoppingBag, color: 'text-emerald-400' },
];

const storeNavItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'browse',    label: 'Browse Apps', icon: Search },
  { id: 'installed', label: 'Installed',   icon: Package },
  { id: 'settings',  label: 'OS Settings', icon: Settings },
  { id: 'theme',     label: 'Theme',       icon: Palette },
];

export default function AppStore() {
  const [activeTab, setActiveTab] = useState<'overview' | 'browse' | 'installed' | 'settings' | 'theme'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { setActivePage } = useContext(WindowContext);

  useEffect(() => {
    const label = activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    setActivePage(label);
  }, [activeTab, setActivePage]);

  return (
    <div className="flex h-full bg-black/40 backdrop-blur-3xl font-outfit text-[var(--theme-text)] overflow-hidden selection:bg-pink-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 shrink-0 bg-black/40 flex flex-col">
        <AppNavBar
          items={storeNavItems}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          accentColor="pink"
          title="App Store"
          subtitle="Ecosystem"
          titleIcon={ShoppingBag}
        />

        <div className="mt-auto p-6">
          <div className="glass-card rounded-2xl p-5 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Monitor className="w-12 h-12" />
            </div>
            <span className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-widest block mb-2">Build V0.1.9</span>
            <p className="text-[10px] text-[var(--theme-text)]/40 leading-relaxed font-light">"The system is the sum of its connections."</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-pink-500/[0.01] via-transparent to-blue-500/[0.01]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-[var(--theme-text)]/80 drop-shadow-sm">
              {activeTab === 'overview' ? 'Core' : activeTab}
            </h2>
            {activeTab === 'browse' && (
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text)]/20 group-focus-within:text-pink-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Scan ecosystem..." 
                  className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs text-[var(--theme-text)]/80 focus:outline-none focus:border-pink-500/30 w-72 transition-all focus:bg-white/[0.07]"
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          {activeTab === 'overview' ? (
            <StoreDashboard embedded={false} />
          ) : activeTab === 'browse' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {marketplaceApps.map(app => (
                <MarketplaceCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
              <Package className="w-16 h-16 text-pink-400/20" />
              <p className="text-xs uppercase tracking-[0.5em] font-bold">{activeTab} Interface Offline</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MarketplaceCard({ app }: any) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group border hover:border-pink-500/20 shadow-2xl relative overflow-hidden flex flex-col min-h-[300px]">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700">
        <app.icon className="w-20 h-20" />
      </div>
      
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:border-pink-500/30 transition-all">
          <app.icon className={clsx("w-8 h-8", app.color)} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-[var(--theme-text)]/80">{app.rating}</span>
        </div>
      </div>

      <h3 className="text-base font-bold text-[var(--theme-text)]/90 uppercase tracking-wider mb-2 group-hover:text-pink-400 transition-colors leading-tight">{app.name}</h3>
      <p className="text-[12px] text-[var(--theme-text)]/30 leading-relaxed mb-10 font-light line-clamp-3">{app.desc}</p>
      
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm font-bold text-pink-400 font-mono">{app.price}</span>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-pink-500/20 transition-all active:scale-95 shadow-lg shadow-pink-500/5">
          <Download className="w-4 h-4" /> Sync
        </button>
      </div>
    </div>
  );
}

