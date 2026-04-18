import React from 'react';
import { Shield, ShieldAlert, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useOsSettingsStore, VetoRule } from '../../../stores/os-settings.store';

export const VetoRuleEditor: React.FC = () => {
  const { vetoRules, updateVetoRule, vetoDefaultStatus, setVetoStatus } = useOsSettingsStore();

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all
        ${vetoDefaultStatus ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}
      `}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${vetoDefaultStatus ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
          `}>
            {vetoDefaultStatus ? <Shield className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--theme-text)] uppercase tracking-tight">Global Doctrine Veto</h3>
            <p className="text-[10px] text-[var(--theme-text)]/40 uppercase tracking-widest">
              {vetoDefaultStatus ? 'Strict Verification Active' : 'Advisory Mode (Risky)'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setVetoStatus(!vetoDefaultStatus)}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all
            ${vetoDefaultStatus ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'}
          `}
        >
          {vetoDefaultStatus ? 'Engaged' : 'Disengaged'}
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {vetoRules.map(rule => (
          <div key={rule.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                {rule.requiresApproval ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--theme-text)]/80 uppercase">{rule.action}</h4>
                <p className="text-[10px] text-[var(--theme-text)]/20 font-mono tracking-tighter">RULE_ID: {rule.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right">
                 <div className="text-[10px] font-bold text-[var(--theme-text)]/20 uppercase tracking-widest">Approver</div>
                 <div className="text-[10px] font-mono text-[var(--theme-text)]/40 uppercase">{rule.approver}</div>
               </div>
               
               <button 
                 onClick={() => updateVetoRule(rule.id, { requiresApproval: !rule.requiresApproval, approver: !rule.requiresApproval ? 'manual' : 'auto' })}
                 className={`w-12 h-6 rounded-full relative transition-colors
                   ${rule.requiresApproval ? 'bg-amber-500/40' : 'bg-white/10'}
                 `}
               >
                 <motion.div 
                   animate={{ x: rule.requiresApproval ? 24 : 4 }}
                   className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${rule.requiresApproval ? 'bg-amber-400' : 'bg-white/40'}`}
                 />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

