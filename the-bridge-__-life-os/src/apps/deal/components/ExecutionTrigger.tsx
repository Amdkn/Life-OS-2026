import React, { useState } from 'react';
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Muse } from '../../../stores/fw-deal.store';
import { clsx } from 'clsx';

export function ExecutionTrigger({ muse }: { muse: Muse }) {
  const [triggerState, setTriggerState] = useState<'idle' | 'executing' | 'success' | 'error'>('idle');

  const handleExecute = async () => {
    if (!muse.webhookUrl) return;
    
    setTriggerState('executing');
    
    try {
      // POST Request simple
      const response = await fetch(muse.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          museId: muse.id, 
          timestamp: Date.now(),
          source: 'aspace-os' 
        })
      });

      if (response.ok) {
        setTriggerState('success');
        setTimeout(() => setTriggerState('idle'), 3000); 
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (e) {
      console.error('[ExecutionTrigger] Webhook failed for Muse:', muse.title, e);
      setTriggerState('error');
      setTimeout(() => setTriggerState('idle'), 5000);
    }
  };

  const isDisabled = !muse.webhookUrl || triggerState === 'executing';
  
  if (!muse.webhookUrl) return null; 

  return (
    <button 
      onClick={handleExecute}
      disabled={isDisabled}
      className={clsx(
        "mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase",
        triggerState === 'idle' && "bg-blue-500 text-black hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        triggerState === 'executing' && "bg-blue-500/20 text-blue-400 cursor-wait",
        triggerState === 'success' && "bg-emerald-500 text-black",
        triggerState === 'error' && "bg-red-500 text-black"
      )}
    >
      {triggerState === 'idle' && <><Play className="w-3.5 h-3.5 fill-current"/> RUN PROTOCOL</>}
      {triggerState === 'executing' && <><Loader2 className="w-3.5 h-3.5 animate-spin"/> EXECUTING...</>}
      {triggerState === 'success' && <><CheckCircle2 className="w-3.5 h-3.5"/> SUCCESS</>}
      {triggerState === 'error' && <><XCircle className="w-3.5 h-3.5"/> TRIGGER FAILED</>}
    </button>
  );
}
