/** CC AI Panel — Contextual AI interaction (Beth, Morty, A2 Ships) */
import { useState, useRef, useEffect } from 'react';
import { Cpu, MessageSquare, Send, Shield, Zap, Terminal } from 'lucide-react';
import { useShellStore } from '../../stores/shell.store';
import { useAgentsStore } from '../../stores/agents.store';

interface AIPanelProps {
  activePage: string;
}

/* Page to ship mapping (Wishlist D5, Tasks P2.4) */
const contextMap: Record<string, { ship: string; crew: string[] }> = {
  'dashboard':  { ship: 'USS Orville', crew: ['Ed Mercer', 'Kelly Grayson'] },
  'ikigai':     { ship: 'USS Orville', crew: ['Bortus', 'Isaac'] },
  'life-wheel': { ship: 'USS Discovery', crew: ['Michael Burnham', 'Zora'] },
  '12wy':       { ship: 'USS SNW',       crew: ['Pike', 'Spock'] },
  'para':       { ship: 'USS Enterprise', crew: ['Picard', 'Data'] },
  'gtd':        { ship: 'USS Cerritos', crew: ['Mariner', 'Boimler'] },
  'deal':       { ship: 'USS Protostar', crew: ['Dal', 'Janeway'] },
  'agents':     { ship: 'Fleet Command', crew: ['Admiral Vance'] },
};

export function AIPanel({ activePage }: AIPanelProps) {
  const [input, setInput] = useState('');
  const vetoEngaged = useShellStore(s => s.vetoEngaged);
  const { logs, assignTask } = useAgentsStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const ctx = contextMap[activePage] || contextMap['dashboard'];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    if (vetoEngaged) {
      useAgentsStore.getState().addLog({
        agentId: 'a1-beth',
        agentName: 'Beth',
        message: `[VETO] Execution blocked: "${input}".`,
        type: 'warning'
      });
    } else {
      // Assign task based on context
      // If we are in agents page, maybe assign to A1, else to A3 of current ship
      const layer = activePage === 'agents' ? 'A1' : 'A3';
      assignTask(input, layer, ctx.ship.replace('USS ', ''));
    }
    
    setInput('');
  };

  return (
    <div className="w-full h-full flex flex-col glass-opaque rounded-xl overflow-hidden border-white/5 shadow-2xl">
      {/* A1 Status (Invariants) */}
      <div className="p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">A1: Execution Engines</span>
        </div>
        <div className="flex gap-2">
          <StatusBadge label="Morty" status="online" active />
          <StatusBadge label="Beth" status={vetoEngaged ? 'warning' : 'online'} />
        </div>
      </div>

      {/* A2 Context (Dynamic) */}
      <div className="p-3 border-b border-white/10 bg-emerald-500/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">A2: {ctx.ship}</span>
          </div>
          <span className="text-[9px] text-[var(--theme-text)]/30 font-mono">ID: {activePage.toUpperCase()}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ctx.crew.map(member => (
            <span key={member} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-[var(--theme-text)]/60">
              {member}
            </span>
          ))}
        </div>
      </div>

      {/* Message Logs */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar bg-black/20">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-2">
            <Terminal className="w-8 h-8" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Ready for Command</span>
          </div>
        )}
        {logs.slice(0, 20).reverse().map((log) => (
          <div key={log.id} className={`text-[11px] leading-relaxed ${log.type === 'command' ? 'text-blue-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-[var(--theme-text)]/40'}`}>
             <span className="font-bold opacity-50 mr-2">[{log.agentName.toUpperCase()}]</span>
             {log.message}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={vetoEngaged ? "Execution Locked by Beth..." : "Send command to A2..."}
            disabled={vetoEngaged}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 pr-10 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={vetoEngaged}
            className="absolute right-2 top-1.5 p-1 rounded-md text-emerald-400 hover:bg-emerald-400/20 transition-all disabled:text-[var(--theme-text)]/10"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label, status, active }: { label: string; status: 'online' | 'warning' | 'offline'; active?: boolean }) {
  const dots = {
    online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    offline: 'bg-white/20',
  };

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-all ${
      active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      <span className="text-[10px] font-bold text-[var(--theme-text)]/70 tracking-wider uppercase font-outfit">{label}</span>
    </div>
  );
}

