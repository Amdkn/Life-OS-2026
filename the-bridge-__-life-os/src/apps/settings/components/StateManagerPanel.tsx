import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert,
  CheckCircle2,
  RefreshCcw,
  FileJson
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORES = [
  { id: 'aspace-os-settings-v1', name: 'OS Settings' },
  { id: 'aspace-shell-layout-v1', name: 'Shell Layout' },
  { id: 'aspace-fleet-gateway-v1', name: 'Fleet Gateway' },
  { id: 'aspace-para-v1', name: 'PARA Business' },
  { id: 'aspace-gtd-v1', name: 'GTD System' },
  { id: 'aspace-life-wheel-v1', name: 'Life Wheel' },
];

export const StateManagerPanel: React.FC = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    const backup: Record<string, any> = {};
    STORES.forEach(store => {
      const data = localStorage.getItem(store.id);
      if (data) backup[store.id] = JSON.parse(data);
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aspace-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const backup = JSON.parse(ev.target?.result as string);
        Object.entries(backup).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        setStatus('success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        console.error('Import failed:', err);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleHardReset = () => {
    localStorage.clear();
    // Also clear IndexedDB if possible, but for now focus on main state
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* State Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STORES.map(store => {
          const raw = localStorage.getItem(store.id);
          const size = raw ? (raw.length / 1024).toFixed(2) : '0';
          
          return (
            <div key={store.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                   <FileJson className="w-5 h-5 text-[var(--theme-text)]/40" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--theme-text)]/80">{store.name}</h4>
                  <p className="text-[10px] text-[var(--theme-text)]/20 font-mono uppercase tracking-tighter">{store.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[var(--theme-text)]/60 font-mono">{size} KB</div>
                <div className="text-[9px] text-emerald-500/50 uppercase font-bold tracking-widest">Active</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
        <button 
          onClick={handleExport}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-sm font-bold text-[var(--theme-text)]">Export System State</div>
            <div className="text-[10px] text-[var(--theme-text)]/30 uppercase tracking-widest">Download full JSON backup</div>
          </div>
        </button>

        <label className="flex-1 min-w-[200px] flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer">
          <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="text-sm font-bold text-[var(--theme-text)]">Import Backup</div>
            <div className="text-[10px] text-[var(--theme-text)]/30 uppercase tracking-widest">Upload JSON state file</div>
          </div>
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
           <AlertTriangle className="w-6 h-6" />
           <h3 className="text-lg font-bold uppercase tracking-widest">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-400/60 max-w-xl">
          Performing a Hard Reset will permanently purge all local data, settings, and AI fleet configurations. This action is irreversible.
        </p>
        
        {!showResetConfirm ? (
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest transition-all border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Initiate Hard Reset
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleHardReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-[var(--theme-text)] text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
            >
              <ShieldAlert className="w-4 h-4" />
              Confirm Reset (All Data)
            </button>
            <button 
              onClick={() => setShowResetConfirm(false)}
              className="text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] text-xs font-bold uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Toast Overlay (simple) */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl z-[4000]
              ${status === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}
            `}
          >
            {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="font-bold uppercase tracking-widest text-xs">
              {status === 'success' ? 'System Synchronized' : 'Process Failed'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

