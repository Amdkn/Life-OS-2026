import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, Globe, Eye, EyeOff, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useFleetGatewayStore, APIConnector } from '../../../stores/fleet-gateway.store';

interface Props {
  connector: APIConnector;
}

export const ConnectorCard: React.FC<Props> = ({ connector }) => {
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { updateConnector, testConnection } = useFleetGatewayStore();

  const handleTest = async () => {
    setIsTesting(true);
    await testConnection(connector.id);
    setIsTesting(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
            <Globe className="w-5 h-5 text-[var(--theme-text)]/60" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--theme-text)]">{connector.name}</h3>
            <p className="text-[10px] text-[var(--theme-text)]/30 uppercase tracking-widest">{connector.type}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-bold border transition-colors
          ${connector.status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
            connector.status === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
            'bg-white/5 border-white/10 text-[var(--theme-text)]/30'}
        `}>
          <div className={`w-1.5 h-1.5 rounded-full ${connector.status === 'connected' ? 'bg-emerald-400 animate-pulse' : connector.status === 'error' ? 'bg-red-400' : 'bg-white/20'}`} />
          {connector.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] ml-1">Endpoint</label>
          <input 
            type="text" 
            value={connector.endpoint}
            onChange={e => updateConnector(connector.id, { endpoint: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[var(--theme-text)]/80 focus:border-emerald-500/40 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-[var(--theme-text)]/30 uppercase tracking-[0.2em] ml-1">API Security Key</label>
          <div className="relative">
            <input 
              type={showKey ? 'text' : 'password'} 
              value={connector.apiKey || ''}
              onChange={e => updateConnector(connector.id, { apiKey: e.target.value })}
              placeholder="••••••••••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[var(--theme-text)]/80 focus:border-emerald-500/40 outline-none transition-all pr-12"
            />
            <button 
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-text)]/20 hover:text-[var(--theme-text)]/60 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[9px] text-[var(--theme-text)]/20 font-mono">
          {connector.lastTestedAt ? `Last Sync: ${new Date(connector.lastTestedAt).toLocaleTimeString()}` : 'Not tested yet'}
        </span>
        <button 
          onClick={handleTest}
          disabled={isTesting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
            ${isTesting ? 'opacity-50 cursor-wait bg-white/5' : 'bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300'}
          `}
        >
          {isTesting ? <Activity className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

