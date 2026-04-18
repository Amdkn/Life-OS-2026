# DDD-V0.6.7 — Formulaires de Genèse (Routage Wheel)

> **ADR** : ADR-V0.6.7 · **Dossier cibles** : `fw-12wy.store.ts`, `VisionForgeModal.tsx`, `GoalForgeModal.tsx`

---

## Phase A : Store et Typage (Le Triple Nexus)

### Étape A.1 : `fw-12wy.store.ts`
Appliquer strictos-sensu la mise à jour TS :
```typescript
export interface WyVision extends ParaItem {
  type: 'wy-vision';
  domainId: string; // V0.6.7 REQUIRED
  ikigaiVisionId?: string; 
}
```

---

## Phase B : UI Câblage (Visions & Goals)

### Étape B.1 : `VisionForgeModal.tsx`
Importer le store Wheel et forcer la sélection du Domaine :
```tsx
import { useWheelStore } from '../../../stores/fw-wheel.store';

// Dans le composant :
const wheelDomains = useWheelStore(s => s.nodes.filter(n => !n.parentId)); // Nœuds racinaires de la Wheel
const [domainId, setDomainId] = useState('');

// -- Dans le JSX : Add this select --
<div className="space-y-2">
  <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Wheel Domain Nexus *</label>
  <select 
    required
    value={domainId} 
    onChange={e => setDomainId(e.target.value)}
    className="w-full bg-[#111] border border-amber-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 font-medium"
  >
    <option value="" disabled>-- Constrain to Domain --</option>
    {wheelDomains.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
  </select>
</div>
// -- Update addVision call --
await addVision({ ... , domainId });
```

### Étape B.2 : `GoalForgeModal.tsx`
Améliorer le feedback lors de la sélection de la Vision Mère :
```tsx
const visions = useTwelveWeekStore(s => s.visions);
const ikigaiVisions = useIkigaiStore(s => s.visions);
const wheelNodes = useWheelStore(s => s.nodes);

const selectedVision = visions.find(v => v.id === visionId);
const parentIkigai = ikigaiVisions.find(i => i.id === selectedVision?.ikigaiVisionId);
const parentDomain = wheelNodes.find(n => n.id === selectedVision?.domainId);

// -- Sous le selecteur de Vision --
{selectedVision && (
  <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-1">
    <p className="text-[9px] uppercase tracking-widest text-white/60">Inherits From:</p>
    <p className="text-xs font-bold text-teal-400 flex items-center gap-2">
       {parentDomain?.title || 'No Domain'} <span className="text-white/20">|</span> {parentIkigai?.title || 'Tactical Isolation'}
    </p>
  </div>
)}
```
