import React from 'react';
import { Shield, ShieldAlert, Check, X, Info } from 'lucide-react';
import { motion } from 'motion/react';

const AGENTS = ['A3 (Morty)', 'A2 (Zora)', 'A1 (Beth)', 'A0 (Amadeus)'];
const ACTIONS = ['Read DB', 'Write DB', 'Export State', 'AI Generation', 'Shell Command'];

export const PermissionMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] font-bold text-[var(--theme-text)]/40 uppercase tracking-widest">Action / Agent</th>
              {AGENTS.map(agent => (
                <th key={agent} className="p-4 text-[10px] font-bold text-[var(--theme-text)] uppercase tracking-widest text-center">{agent}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIONS.map(action => (
              <tr key={action} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="p-4 text-xs font-medium text-[var(--theme-text)]/60">{action}</td>
                {AGENTS.map(agent => {
                  const isA0 = agent.includes('A0');
                  const isA3 = agent.includes('A3');
                  const allowed = isA0 || (isA3 && !action.includes('Command'));
                  
                  return (
                    <td key={agent} className="p-4 text-center">
                      <div className="flex justify-center">
                        {allowed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <X className="w-3 h-3 text-red-400" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-400/60 leading-relaxed uppercase tracking-wider">
          The Permission Matrix is currently derived from Agent Strata protocols. Custom overrides will be available in V0.4.
        </p>
      </div>
    </div>
  );
};

