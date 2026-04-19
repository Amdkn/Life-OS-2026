# DDD-V0.7.2 — Le Triple Câblage (Nexus Final)

> **ADR** : ADR-V0.7.2 · **Dossiers cibles** : `fw-gtd.store.ts` et UI Organize

---

## Phase A : Typage

### Étape A.1 : Extension de `GTDItem`
Dans `src/stores/fw-gtd.store.ts` :
```typescript
export interface GTDItem extends LdEntity {
  // ...
  projectId?: string; // Lien PARA 
  goalId?: string;    // Lien 12WY Moteur Lourd
  tacticId?: string;  // Lien 12WY Execution Rapide
}
```

---

## Phase B : Interfaces d'attachement (UI)

### Étape B.1 : Sélection dans le composant d'édition (Ex: OrganizeView)
Lorsque l'utilisateur décide d'éditer une tâche (pour l'organiser), il doit pouvoir la lier.
```tsx
import { useParaStore } from '../../../stores/fw-para.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';

// A L'INTERIEUR DU COMPOSANT D'EDITION D'UNE TACHE :
const activeProjects = useParaStore(s => s.projects); // <-- Pas de .filter ici !
const activeGoals = useTwelveWeekStore(s => s.goals);

// JSX pour le Projet PARA :
<div className="space-y-2">
  <label className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Linked Project (PARA)</label>
  <select 
    value={editingItem.projectId || ''} 
    onChange={e => handlePatch({ projectId: e.target.value })}
    className="w-full bg-white/5 border border-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400/50"
  >
    <option value="">-- No Project Link --</option>
    {activeProjects.filter(p => !p.archived).map(p => (
       <option key={p.id} value={p.id}>{p.title}</option>
    ))}
  </select>
</div>

// JSX pour le Goal 12WY :
<div className="space-y-2">
  <label className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Linked Goal (12 Week Year)</label>
  <select 
    value={editingItem.goalId || ''} 
    onChange={e => handlePatch({ goalId: e.target.value })}
    className="w-full bg-white/5 border border-teal-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400/50"
  >
    <option value="">-- No Goal Link --</option>
    {activeGoals.map(g => (
       <option key={g.id} value={g.id}>{g.title} (W{g.targetWeek})</option>
    ))}
  </select>
</div>
```

*Note à l'A3: Veille à propager ces variables `goalId` et `projectId` via l'action `processItem`.*
