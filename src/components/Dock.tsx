/** Dock — 8 persistent app slots + drawer button with badges */
import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, Compass, CircleDot, CalendarCheck,
  FolderKanban, CheckSquare, Unlock, LayoutGrid,
  type LucideIcon
} from 'lucide-react';
import { useShellStore } from '../stores/shell.store';
import { glass } from '../lib/glass-tokens';

/* App definitions for the 8 dock slots (PRD: CC + 6 Frameworks + Drawer) */
const dockItems = [
  { id: 'command-center', icon: LayoutDashboard, label: 'Command Center', slot: 0, color: 'emerald' },
  { id: 'ikigai',         icon: Compass,         label: 'Ikigai',          slot: 1, color: 'blue'    },
  { id: 'life-wheel',     icon: CircleDot,       label: 'Life Wheel',      slot: 2, color: 'amber'   },
  { id: 'twelve-week',    icon: CalendarCheck,    label: '12WY',            slot: 3, color: 'teal'    },
  { id: 'para',           icon: FolderKanban,     label: 'PARA',            slot: 4, color: 'slate'   },
  { id: 'gtd',            icon: CheckSquare,      label: 'GTD',             slot: 5, color: 'emerald' },
  { id: 'deal',           icon: Unlock,           label: 'DEAL',            slot: 6, color: 'red'     },
];

const drawerItem = { id: 'drawer', icon: LayoutGrid, label: 'App Drawer', slot: 7, color: 'white' };

export function Dock() {
  const openApp = useShellStore(s => s.openApp);
  const notificationCount = useShellStore(s => s.notificationCount);
  const windows = useShellStore(s => s.windows);

  /** Check if an app is currently open (for active dot indicator) */
  const isOpen = (id: string) => windows.some(w => w.id === id && w.isOpen);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2000]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="glass rounded-[24px] px-3 py-2 flex items-end gap-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
      >
        {dockItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            isActive={isOpen(item.id)}
            badge={item.id === 'command-center' ? notificationCount : 0}
            onClick={() => openApp(item.id, item.label)}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1.5 mb-2 self-center" />

        {/* Drawer button */}
        <DockIcon
          item={drawerItem}
          isActive={false}
          badge={0}
          onClick={() => openApp('drawer', 'App Drawer')}
        />
      </motion.div>
    </div>
  );
}

/* ═══ DockIcon sub-component ═══ */

interface DockIconProps {
  item: { id: string; icon: LucideIcon; label: string; color: string };
  isActive: boolean;
  badge: number;
  onClick: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({ item, isActive, badge, onClick }) => {
  const isCC = item.id === 'command-center';

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="relative group flex flex-col items-center"
    >
      <button
        onClick={onClick}
        className={`flex items-center justify-center rounded-[14px] transition-all duration-300 border shadow-lg overflow-hidden relative ${
          isCC
            ? 'w-12 h-12 text-[var(--theme-accent)] border-[var(--theme-accent)]/30 hover:border-[var(--theme-accent)]/50'
            : 'w-11 h-11 bg-white/5 text-[var(--theme-text)]/60 border-white/10 hover:bg-white/10 hover:text-[var(--theme-text)]/90'
        }`}
        style={{
          backgroundColor: isCC ? `rgba(var(--theme-accent-rgb), 0.2)` : undefined
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        <item.icon className={isCC ? 'w-6 h-6 z-10' : 'w-5.5 h-5.5 z-10'} />
      </button>

      {/* Badge count (D8: CC only for MVP) */}
      {badge > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 bg-red-500 text-[var(--theme-text)] text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-black/20 z-20 animate-bounce"
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      )}

      {/* Active indicator dot (D13: persistance visualizer) */}
      <div className="h-1.5 mt-1 flex items-center justify-center">
        {isActive && (
          <motion.div 
            layoutId="active-dot"
            className="w-1 h-1 rounded-full bg-[var(--theme-accent)]" 
            style={{ boxShadow: `0 0 8px var(--theme-accent)` }}
          />
        )}
      </div>

      {/* Tooltip (D15: label hint) */}
      <div className="absolute -top-10 glass px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border-white/10 shadow-xl backdrop-blur-xl translate-y-2 group-hover:translate-y-0">
        <span className="text-[10px] font-bold tracking-wider text-[var(--theme-text)]/90 uppercase font-outfit">{item.label}</span>
      </div>
    </motion.div>
  );
}


