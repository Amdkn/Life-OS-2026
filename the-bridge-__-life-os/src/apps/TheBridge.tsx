import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Activity, Database, Shield, Cpu, Network } from 'lucide-react';

export function TheBridge() {
  const [vetoEngaged, setVetoEngaged] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialLogs = [
      "[10:45:32] Zora: Initiating routine hull stress analysis. No anomalies detected.",
      "[10:45:40] Zora: Processing request from Cmdr. Burnham for warp field stabilization data.",
      "[10:45:48] Zora: Doctrine Protocol check. Directive Alpha: Protect Crew. Status: Compliant.",
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const newLogs = [
        `[${new Date().toLocaleTimeString()}] Zora: Evaluating potential energy efficiency improvements in engineering sector.`,
        `[${new Date().toLocaleTimeString()}] Zora: Incoming transmission from external sensor buoy. Decoding...`,
        `[${new Date().toLocaleTimeString()}] Zora: Alert! Minor fluctuation in primary plasma conduit. Adjusting containment field.`,
        `[${new Date().toLocaleTimeString()}] Zora: Re-allocating resources to support medical bay diagnostics.`,
        `[${new Date().toLocaleTimeString()}] Zora: Subspace communication array calibrated. Ready for transmission.`
      ];
      setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex h-full text-[var(--theme-text)] font-sans">
      {/* Left Column: Hierarchy */}
      <div className="w-64 border-r border-white/10 bg-black/20 p-4 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Cpu className="w-3 h-3" /> A1: Execution Engines
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Morty (Active)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Beth (Idle)</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Network className="w-3 h-3" /> A2: Spaceship Infrastructure
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium text-emerald-400">Zora (Online)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">The Computer (Online)</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="w-3 h-3" /> A3: Starfleet Crew
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Burnham (On Duty)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Stamets (Researching)</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
              <span className="text-sm font-medium text-amber-400/90">Culber (Medical Bay)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Overview */}
      <div className="flex-1 border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Active Tasks: Zora
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">System Diagnostics in Progress</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[78%] shadow-[0_0_10px_#34d399]"></div>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono">78%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-emerald-500/50 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--theme-text)]/70">Navigational Plotting</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500/50 h-full w-full"></div>
                </div>
              </div>
              <span className="text-xs text-[var(--theme-text)]/50 font-mono">Complete</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-100">Environmental Controls Optimization</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[45%] shadow-[0_0_10px_#fbbf24] animate-pulse"></div>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-mono">Running</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Current Directives
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
              <div>
                <span className="text-sm font-medium text-amber-100">Maintain Ship Integrity</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Priority: High</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Monitor Subspace Anomalies</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-sm font-medium">Assisting Crew with Queries</span>
            </li>
          </ul>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg flex-1">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Memory Load: Zora
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="3"></circle>
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-400" strokeWidth="3" strokeDasharray="100" strokeDashoffset="58" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-emerald-400">42%</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-[var(--theme-text)]/70">Available: <span className="text-[var(--theme-text)] font-mono">12 TB</span></div>
              <div className="text-sm text-[var(--theme-text)]/70">Used: <span className="text-[var(--theme-text)] font-mono">8.5 TB</span></div>
            </div>
          </div>
          {/* Decorative chart line */}
          <div className="mt-6 h-12 w-full relative opacity-50">
            <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-ratio-none" preserveAspectRatio="none">
              <path d="M0,20 Q10,10 20,15 T40,10 T60,25 T80,5 T100,15" fill="none" className="stroke-emerald-500" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column: Terminal */}
      <div className="w-96 p-6 flex flex-col gap-6 bg-black/30">
        <div className="flex flex-col items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl"></div>
          
          <div className="w-24 h-24 rounded-full bg-emerald-900/50 border-2 border-emerald-500/50 p-1 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-full h-full rounded-full bg-black/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-900/80 flex items-center justify-center">
                 <Cpu className="w-10 h-10 text-emerald-400/80" />
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-[var(--theme-text)] tracking-wide relative z-10">Zora</h2>
          
          <div className="w-full mt-2 relative z-10">
            <div className="text-[10px] font-bold text-center text-[var(--theme-text)]/50 uppercase tracking-widest mb-2">Doctrine Veto</div>
            <button 
              onClick={() => setVetoEngaged(!vetoEngaged)}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-300 border ${
                vetoEngaged 
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              }`}
            >
              {vetoEngaged ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {vetoEngaged ? 'Engaged' : 'Disengaged'}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col overflow-hidden shadow-inner">
          <div className="text-[10px] text-emerald-500/50 mb-2 uppercase tracking-widest border-b border-white/5 pb-2">Live Terminal Feed</div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="text-emerald-400/80 leading-relaxed">
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

