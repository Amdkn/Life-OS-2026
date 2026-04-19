# DDD-V0.8.7 — Le Pont Exécutif (Webhooks)

> **ADR** : ADR-V0.8.7 · **Cible** : `apps/deal/components/ExecutionTrigger.tsx`

---

## Phase A : Intégration du composant d'action

### Étape A.1 : Créer `ExecutionTrigger.tsx`
Ce composant sera appelé dans la Dashboard listant les muses (`Muses.tsx`) pour chaque muse ayant une URL valide.
```tsx
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
      // POST Request simple, non bloquant pour l'OS, avec No-CORS si nécessaire ou mode standard
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
        setTimeout(() => setTriggerState('idle'), 3000); // Retour à la normale après 3s
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
  
  if (!muse.webhookUrl) return null; // Ne rien afficher si pas d'automation liée

  return (
    <button 
      onClick={handleExecute}
      disabled={isDisabled}
      className={clsx(
        "mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black tracking-[0.2em] transition-all",
        triggerState === 'idle' && "bg-blue-500 text-black hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        triggerState === 'executing' && "bg-blue-500/20 text-blue-400 cursor-wait",
        triggerState === 'success' && "bg-emerald-500 text-black",
        triggerState === 'error' && "bg-red-500 text-black"
      )}
    >
      {triggerState === 'idle' && <><Play className="w-4 h-4 fill-current"/> RUN PROTOCOL</>}
      {triggerState === 'executing' && <><Loader2 className="w-4 h-4 animate-spin"/> EXECUTING...</>}
      {triggerState === 'success' && <><CheckCircle2 className="w-4 h-4"/> SUCCESS</>}
      {triggerState === 'error' && <><XCircle className="w-4 h-4"/> TRIGGER FAILED</>}
    </button>
  );
}
```

### Étape A.2 : Montage dans la Vue (UI)
Dans la carte Muse (`Muses.tsx`), monter le `<ExecutionTrigger muse={muse} />`. Cela conclut la magie d'un OS actionnable qui ne demande pas d'intermédiaire.
*(Gate: npx tsc --noEmit)*
