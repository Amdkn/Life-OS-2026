/** App Drawer — Fullscreen Launchpad for all OS modules (P6.1) */
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, LayoutDashboard, Compass, CircleDot, 
  CalendarCheck, FolderKanban, CheckSquare, Unlock, 
  Users, Settings, ShoppingBag, Globe, Cpu
} from 'lucide-react';
import { useShellStore } from '../stores/shell.store';

export function AppDrawer() {
  const isDrawerOpen = useShellStore(s => s.windows.some(w => w.id === 'drawer' && w.isOpen));
  const closeApp = useShellStore(s => s.closeApp);
  const openApp = useShellStore(s => s.openApp);

  const allApps = [
    { id: 'command-center', name: 'Command Center', icon: LayoutDashboard, category: 'System', color: 'text-emerald-400' },
    { id: 'para',           name: 'PARA Business',  icon: FolderKanban,     category: 'Framework', color: 'text-blue-400' },
    { id: 'ikigai',         name: 'Ikigai Protocol',icon: Compass,          category: 'Framework', color: 'text-amber-400' },
    { id: 'life-wheel',     name: 'Life Wheel',     icon: CircleDot,        category: 'Framework', color: 'text-emerald-400' },
    { id: 'twelve-week',    icon: CalendarCheck,    name: '12WY Strategy',  category: 'Framework', color: 'text-blue-400' },
    { id: 'gtd',            icon: CheckSquare,      name: 'GTD System',     category: 'Framework', color: 'text-emerald-400' },
    { id: 'deal',           icon: Unlock,           name: 'DEAL Protocol',  category: 'Framework', color: 'text-red-400' },
    { id: 'agents',         icon: Users,            name: 'Agent Portal',   category: 'System',    color: 'text-blue-400' },
    { id: 'store',          icon: ShoppingBag,      name: 'App Store',      category: 'System',    color: 'text-pink-400' },
    { id: 'settings',       icon: Settings,         name: 'Settings',       category: 'System',    color: 'text-[var(--theme-text)]/40' },
  ];

  if (!isDrawerOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] bg-[#0a0f0d]/90 backdrop-blur-2xl p-12 flex flex-col items-center"
    >
      {/* Close Button */}
      <button 
        onClick={() => closeApp('drawer')}
        className="absolute top-8 right-12 p-3 rounded-full bg-white/5 hover:bg-white/10 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-all border border-white/5"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Search Header */}
      <div className="w-full max-w-2xl mb-16 space-y-6 text-center">
        <h2 className="text-3xl font-bold text-[var(--theme-text)] uppercase tracking-[0.4em] font-outfit">Launchpad</h2>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-text)]/20 group-hover:text-emerald-400 transition-colors" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search apps, frameworks, or agents..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-lg text-[var(--theme-text)] outline-none focus:border-emerald-500/40 transition-all shadow-2xl"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {allApps.map((app, i) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { openApp(app.id, app.name); closeApp('drawer'); }}
            className="flex flex-col items-center gap-4 group"
          >
            <div className={`w-20 h-20 rounded-[28px] glass border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <app.icon className={`w-10 h-10 ${app.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-[var(--theme-text)] group-hover:text-emerald-400 transition-colors uppercase tracking-widest font-outfit">{app.name}</div>
              <div className="text-[9px] text-[var(--theme-text)]/20 uppercase tracking-tighter mt-0.5">{app.category}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="mt-auto pt-12 flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text)]/20">
        <div className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Kernel 6.4.1-ASpace</div>
        <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> Area LD01-08 Synchronized</div>
      </div>
    </motion.div>
  );
}

