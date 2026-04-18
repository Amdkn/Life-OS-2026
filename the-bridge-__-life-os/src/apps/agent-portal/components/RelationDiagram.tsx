import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Target, 
  FolderRoot, 
  Inbox, 
  CalendarRange, 
  Zap, 
  ShieldCheck,
  ChevronDown,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useBridgeWatcher } from '../lib/BridgeWatcher';

const NODES = [
  { id: 'orville', label: 'Orville', framework: 'Ikigai (H1)', icon: Target, color: 'var(--brass)' },
  { id: 'zora', label: 'Zora', framework: 'Discovery', icon: Compass, color: '#10b981' },
  { id: 'enterprise_areas', label: 'Enterprise', framework: 'PARA Areas', icon: FolderRoot, color: 'var(--copper)' },
  { id: 'cerritos', label: 'Cerritos', framework: 'GTD Airlock', icon: Inbox, color: '#f59e0b' },
  { id: 'enterprise_projects', label: 'Enterprise', framework: 'PARA Projects', icon: FolderRoot, color: 'var(--copper)' },
  { id: 'snw', label: 'SNW', framework: '12WY Heartbeat', icon: CalendarRange, color: '#ef4444' },
  { id: 'protostar', label: 'Protostar', framework: 'DEAL Exit', icon: Zap, color: 'var(--accent-primary)' },
];

const RelationDiagram: React.FC = () => {
  const { lastAnnotation, addManualAnnotation } = useBridgeWatcher();

  const simulateSignal = () => {
    addManualAnnotation({
      id: Math.random().toString(),
      elementLabel: 'Button#submit-order',
      content: 'Make the padding 24px and increase contrast of the font.',
      pageUrl: 'https://aspace.nexus',
      target: 'div.order-footer > button',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="h-full flex flex-col p-8 overflow-hidden items-center justify-center relative">
      {/* Floating Signal Alert */}
      <AnimatePresence>
        {lastAnnotation && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="absolute top-24 right-8 z-50 w-72 glass border-brass p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--brass-glow)] border border-[var(--brass)] flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-[var(--brass)] animate-pulse" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-[var(--brass)] uppercase tracking-widest">Incoming Signal</span>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono">{lastAnnotation.timestamp}</span>
                </div>
                <h5 className="text-xs font-bold text-white truncate mb-1">{lastAnnotation.elementLabel}</h5>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed italic mb-3 line-clamp-2">
                  "{lastAnnotation.content}"
                </p>
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-1.5 rounded-lg bg-[var(--accent-primary-glow)] text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-wider hover:bg-[var(--accent-primary)] hover:text-white transition-all">
                    Route to Discovery
                  </button>
                  <button className="p-1.5 rounded-lg bg-[var(--glass-bg-hover)] text-[var(--text-muted)] hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-3 relative">
          {/* Debug Simulator */}
          <button 
            onClick={simulateSignal}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-[.3em] text-[var(--text-muted)] hover:text-white hover:border-[var(--brass)] transition-all grayscale hover:grayscale-0 opacity-20 hover:opacity-100"
          >
            Simulate Bridge Signal
          </button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter opacity-10">Morty Workflow V1.0</h3>
          </div>
          <h2 className="text-2x font-black text-white uppercase tracking-[.3em]">The Perpetual Clockwork</h2>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">A1 Sovereignty Active</p>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-12 py-12">
          {/* Vertical flow lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[var(--glass-border)] to-transparent pointer-events-none" />

          {NODES.map((node, idx) => {
            const Icon = node.icon;
            const isLast = idx === NODES.length - 1;
            
            // Highlight node if there's a signal targeting its framework
            const isSignaled = lastAnnotation && (idx === 1 || idx === 3);

            return (
              <React.Fragment key={node.id}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSignaled ? 1.05 : 1, 
                    y: 0 
                  }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10 w-full max-w-sm"
                >
                  <div 
                    className={cn(
                      "glass-card p-6 flex items-center justify-between border-l-4 group hover:scale-[1.02] transition-all cursor-pointer shadow-xl",
                      isSignaled && "border-[var(--brass)] shadow-[0_0_20px_var(--brass-glow)] bg-[var(--brass-glow)]"
                    )}
                    style={{ borderColor: !isSignaled ? node.color : undefined }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--glass-l2-bg)] shadow-lg border border-[var(--glass-l2-border)] group-hover:border-inherit transition-colors overflow-hidden"
                        style={{ color: !isSignaled ? node.color : 'var(--brass)' }}
                      >
                        {isSignaled ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Radio className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Step {idx + 1}</span>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-inherit transition-colors">{node.label}</h4>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{node.framework}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[10px] text-[var(--accent-primary)] font-black uppercase leading-tight">Status</div>
                      <div className={cn(
                        "text-xs text-white font-mono font-black italic",
                        isSignaled && "text-[var(--brass)] animate-pulse"
                      )}>
                        {isSignaled ? "SIGNAL" : "VERIFIED"}
                      </div>
                    </div>
                  </div>

                  {/* Flow description */}
                  <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-40 text-left hidden xl:block">
                    <p className="text-[9px] text-[var(--text-muted)] leading-relaxed italic opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx === 0 && "Verdicts Source Alignment on H1 Horizons."}
                      {idx === 1 && "Verifying CEO Business Domain LD01 boundaries."}
                      {idx === 2 && "Routing strategic directives to PARA Areas."}
                      {idx === 3 && "Market entropy clarified and transformed."}
                      {idx === 4 && "Instantiating Summers CEO for production."}
                      {idx === 5 && "Tactical project execution compression."}
                      {idx === 6 && "Canonical liberation and project archiving."}
                    </p>
                  </div>
                </motion.div>

                {!isLast && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex flex-col items-center gap-1 z-0"
                  >
                    <ChevronDown className="w-6 h-6 text-[var(--glass-border)] animate-bounce" />
                    {idx === 3 && (
                      <div className="px-3 py-1 glass-card border-[var(--accent-warning)] text-[9px] font-black text-[var(--accent-warning)] uppercase tracking-[.2em] -mt-1 shadow-[0_0_10px_var(--accent-warning)]">
                        Production Sluice
                      </div>
                    )}
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Utility function duplicated for standalone use
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default RelationDiagram;





