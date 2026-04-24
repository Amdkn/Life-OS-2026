/** TopBar — global OS bar with Veto, Boot Clean, clock, badges */
import { useState, useEffect } from 'react';
import { Shield, ShieldOff, RotateCcw, Bell, Search, Leaf } from 'lucide-react';
import { useShellStore } from '../stores/shell.store';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProfileStore } from '../stores/profile.store';

function PilotBadge() {
  const { logout } = useAuth();
  const profile = useProfileStore((s) => s.profile);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (profile?.displayName?.[0] ?? '?').toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold flex items-center justify-center hover:bg-green-500/25 transition-all"
        title={profile?.displayName ?? 'Pilote'}
      >
        {initials}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-8 w-48 bg-black/90 border border-green-500/15 rounded-xl p-2 backdrop-blur-xl shadow-2xl z-50"
          >
            <p className="text-green-600/50 text-[9px] tracking-widest px-2 py-1 uppercase">
              {profile?.displayName ?? 'Pilote'}
            </p>
            <button onClick={logout}
              className="w-full text-left px-2 py-1.5 text-red-400/70 text-[10px] tracking-widest hover:bg-red-500/10 rounded-lg transition-all">
              DÉCONNEXION VAISSEAU
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopBar() {
  const [time, setTime] = useState(new Date());
  const vetoEngaged = useShellStore(s => s.vetoEngaged);
  const toggleVeto = useShellStore(s => s.toggleVeto);
  const bootClean = useShellStore(s => s.bootClean);
  const notificationCount = useShellStore(s => s.notificationCount);
  const clearNotifications = useShellStore(s => s.clearNotifications);

  /* Live clock — updates every second */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 w-full z-[5000] select-none top-bar">
      <div className="h-full w-full glass border-b-white/5 flex items-center justify-between px-4 text-xs font-medium text-[var(--theme-text)]/90">
        {/* Left — brand + veto + boot */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-white/10 group cursor-default">
            <Leaf className="w-4 h-4 text-[var(--theme-accent)] group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-tight text-[var(--theme-accent)] font-outfit">A'Space</span>
          </div>

          {/* Beth Veto Toggle (D7/D9: global, always visible) */}
          <button
            onClick={toggleVeto}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
              vetoEngaged
                ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'bg-white/5 text-[var(--theme-text)]/40 border border-white/10 hover:bg-white/10 hover:text-[var(--theme-text)]/60'
            }`}
            title={vetoEngaged ? 'Beth Veto: ON — A3 Execution Engines Locked' : 'Beth Veto: OFF — A3 Execution Engines Active'}
          >
            {vetoEngaged ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
            {vetoEngaged ? 'Veto Active' : 'Veto Ready'}
          </button>

          {/* Boot Clean (D13: reset layout) */}
          <button
            onClick={() => {
              if (window.confirm('Reset OS layout and clear session?')) {
                bootClean();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-[var(--theme-text)]/30 border border-white/10 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-all"
            title="System Boot Clean — resets all window positions"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Right — badges, search, clock */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 pr-5 border-r border-white/10">
            <Search className="w-3.5 h-3.5 text-[var(--theme-text)]/40 hover:text-[var(--theme-text)]/70 cursor-pointer transition-colors" />

            {/* Notification bell with badge */}
            <button 
              onClick={clearNotifications} 
              className="relative group p-1" 
              title="Global OS Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-[var(--theme-text)]/40 group-hover:text-[var(--theme-text)] transition-colors" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-[var(--theme-text)] text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 shadow-[0_0_8px_rgba(239,68,68,0.5)] border border-black/20">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            <PilotBadge />
          </div>

          {/* Clock & Date */}
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-tight">
            <span className="text-[var(--theme-text)]/80 font-bold">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-[var(--theme-text)]/40 uppercase">
              {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
