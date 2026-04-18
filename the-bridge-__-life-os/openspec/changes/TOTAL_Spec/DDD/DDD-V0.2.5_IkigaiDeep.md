# DDD-V0.2.5 — Ikigai Deep Routing

> **ADR** : ADR-V0.2.5 · **Dépendance** : DDD-V0.2.4 (HeaderFilterBar)
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étape A.1-A.3 : Types & Store

**MODIFY** `src/stores/fw-ikigai.store.ts`

Ajouter les types et le state :
```typescript
export type Pillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type Horizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiItem {
  id: string; title: string; description: string;
  pillar: Pillar; horizon: Horizon; alignmentLevel: number;
}

// Dans le store state :
items: IkigaiItem[];
activeHorizon: Horizon | 'all';
activePillar: Pillar | 'all';
setActiveHorizon: (h: Horizon | 'all') => void;
setActivePillar: (p: Pillar | 'all') => void;
getFilteredItems: () => IkigaiItem[];
```

Getter filtré :
```typescript
getFilteredItems: () => {
  const { items, activeHorizon, activePillar } = get();
  return items.filter(i =>
    (activeHorizon === 'all' || i.horizon === activeHorizon) &&
    (activePillar === 'all' || i.pillar === activePillar)
  );
},
```

**Gate** : `tsc --noEmit`

---

## Étape A.4 : Seed Data

```typescript
const SEED_ITEMS: IkigaiItem[] = [
  // H1 (Daily)
  { id: 'ik-1',  title: 'Code Review Rituals',        description: 'Daily practice of reviewing PRs with architectural mindset',      pillar: 'craft',    horizon: 'H1', alignmentLevel: 85 },
  { id: 'ik-2',  title: 'Morning Intention Setting',   description: 'Align daily tasks with Life Wheel domains',                       pillar: 'mission',  horizon: 'H1', alignmentLevel: 70 },
  { id: 'ik-3',  title: 'Open Source Contribution',    description: 'Contribute to projects that spark curiosity',                     pillar: 'passion',  horizon: 'H1', alignmentLevel: 60 },
  { id: 'ik-4',  title: 'Teach One Concept Daily',     description: 'Share knowledge with team or community',                         pillar: 'vocation', horizon: 'H1', alignmentLevel: 75 },
  // H3 (Weekly)
  { id: 'ik-5',  title: 'Master TypeScript Patterns',  description: 'Deep dive into advanced TS patterns weekly',                     pillar: 'craft',    horizon: 'H3', alignmentLevel: 90 },
  { id: 'ik-6',  title: 'A\'Space OS Architecture',    description: 'Build the sovereign Life OS system',                             pillar: 'mission',  horizon: 'H3', alignmentLevel: 95 },
  { id: 'ik-7',  title: 'AI Agent Experiments',        description: 'Explore multi-agent orchestration patterns',                     pillar: 'passion',  horizon: 'H3', alignmentLevel: 80 },
  { id: 'ik-8',  title: 'Mentor Junior Developers',    description: 'Weekly 1-on-1 sessions with growth mindset',                    pillar: 'vocation', horizon: 'H3', alignmentLevel: 65 },
  // H10 (Monthly)
  { id: 'ik-9',  title: 'Full-Stack Mastery',          description: 'Monthly deep-dive into new framework or tool',                  pillar: 'craft',    horizon: 'H10', alignmentLevel: 70 },
  { id: 'ik-10', title: 'Life OS V1 Launch',           description: 'Deploy A\'Space OS for personal daily use',                     pillar: 'mission',  horizon: 'H10', alignmentLevel: 85 },
  { id: 'ik-11', title: 'Build CLI Ecosystem',         description: 'Create tools that make dev workflows magical',                  pillar: 'passion',  horizon: 'H10', alignmentLevel: 75 },
  { id: 'ik-12', title: 'Tech Blog Launch',            description: 'Publish monthly articles on architecture patterns',             pillar: 'vocation', horizon: 'H10', alignmentLevel: 55 },
  // H30 (Quarterly)
  { id: 'ik-13', title: 'System Design Expert',        description: 'Lead architecture decisions at scale',                          pillar: 'craft',    horizon: 'H30', alignmentLevel: 60 },
  { id: 'ik-14', title: 'Sovereign Digital Life',      description: 'All personal data flows through A\'Space OS',                   pillar: 'mission',  horizon: 'H30', alignmentLevel: 50 },
  { id: 'ik-15', title: 'AI-First Development',        description: 'Pioneer human-AI pair programming methodologies',              pillar: 'passion',  horizon: 'H30', alignmentLevel: 65 },
  { id: 'ik-16', title: 'Conference Speaker',          description: 'Present at 2 tech conferences on Life OS concepts',            pillar: 'vocation', horizon: 'H30', alignmentLevel: 40 },
  // H90 (Annual)
  { id: 'ik-17', title: 'Technical Co-Founder',        description: 'Build a venture on top of A\'Space platform',                  pillar: 'craft',    horizon: 'H90', alignmentLevel: 45 },
  { id: 'ik-18', title: 'E-Myth Mastery',              description: 'Build systems that run without daily intervention',            pillar: 'mission',  horizon: 'H90', alignmentLevel: 55 },
  { id: 'ik-19', title: 'Open Source Leader',           description: 'Lead a community around sovereign personal OS',               pillar: 'passion',  horizon: 'H90', alignmentLevel: 35 },
  { id: 'ik-20', title: '4HWW Muse Portfolio',         description: 'Multiple automated income streams from tech products',        pillar: 'vocation', horizon: 'H90', alignmentLevel: 30 },
];
```

**Gate** : Store chargé avec 20 items

---

## Étapes B.1-B.5 : Routing dans IkigaiApp

**MODIFY** `src/apps/ikigai/IkigaiApp.tsx`

Header utilise `HeaderFilterBar` pour les Horizons. Sidebar filtre déjà par Pilier via les NavItems existants. Ajouter `setActiveHorizon` call sur `onFilterChange`.

Afficher `getFilteredItems()` dans le contenu principal. Syncer breadcrumb :
```typescript
const { setActivePage } = useContext(WindowContext);
useEffect(() => {
  const h = activeHorizon === 'all' ? 'All Horizons' : activeHorizon;
  const p = activePillar === 'all' ? '' : ` > ${activePillar.charAt(0).toUpperCase() + activePillar.slice(1)}`;
  setActivePage(`${h}${p}`);
}, [activeHorizon, activePillar]);
```

**Gate** : Navigation H3 + Passion → items filtrés + breadcrumb correct

---

## Étapes C.1-C.3 : Cards & Detail

**NEW** `src/apps/ikigai/components/IkigaiItemCard.tsx`
```typescript
import type { IkigaiItem } from '../../../stores/fw-ikigai.store';

const pillarColors = { craft: 'emerald', mission: 'amber', passion: 'purple', vocation: 'blue' };

export function IkigaiItemCard({ item, onClick }: { item: IkigaiItem; onClick: (i: IkigaiItem) => void }) {
  const color = pillarColors[item.pillar];
  return (
    <button onClick={() => onClick(item)}
      className="text-left p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-${color}-500/20 text-${color}-400`}>{item.pillar}</span>
        <span className="text-[8px] text-white/20 font-mono">{item.horizon}</span>
      </div>
      <h3 className="text-sm font-bold text-white/80 mb-1 group-hover:text-white transition-colors">{item.title}</h3>
      <p className="text-[11px] text-white/30 line-clamp-2 mb-3">{item.description}</p>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full bg-${color}-500/60 rounded-full`} style={{ width: `${item.alignmentLevel}%` }} />
      </div>
    </button>
  );
}
```

**NEW** `src/apps/ikigai/components/IkigaiDetailPanel.tsx` — slide-in panel 400px right overlay avec item complet.

**Gate Finale** : `npm run gate` + navigation Horizons×Piliers + cards + detail panel
