# DDD-V0.2.4 — UI Layout & Header Menus

> **ADR** : ADR-V0.2.4 · **Exécuteur** : A3 (Gemini CLI)
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étape A.1 : Chevron Toggle Sidebar CC

**MODIFY** `src/apps/command-center/CommandCenter.tsx`

Ajouter state et chevron sur la sidebar :
```typescript
const [sidebarOpen, setSidebarOpen] = useState(true);
const [aiPanelOpen, setAiPanelOpen] = useState(true);
```

Modifier le `<aside>` sidebar :
```tsx
<aside className={`border-r border-white/5 shrink-0 bg-black/10 relative transition-all duration-300 ${sidebarOpen ? 'w-[200px]' : 'w-0 overflow-hidden'}`}>
  {sidebarOpen && <Sidebar activePage={activePage} onNavigate={setActivePage} onOpenApp={(id, l) => openApp(id, l)} />}
  <button onClick={() => setSidebarOpen(!sidebarOpen)}
    className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-black/80 transition-all">
    {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
  </button>
</aside>
```

**Gate** : `tsc --noEmit`

---

## Étape A.2 : Chevron Toggle AI Panel

Même pattern pour l'AI Panel :
```tsx
<aside className={`border-l border-white/5 p-3 shrink-0 bg-black/30 relative transition-all duration-300 ${aiPanelOpen ? 'w-[320px]' : 'w-0 overflow-hidden p-0'}`}>
  <button onClick={() => setAiPanelOpen(!aiPanelOpen)}
    className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all">
    {aiPanelOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
  </button>
  {aiPanelOpen && <AIPanel activePage={activePage} />}
</aside>
```

Ajouter imports : `import { ChevronLeft, ChevronRight } from 'lucide-react';`

**Gate** : Toggle sidebar + AI Panel visuellement, contenu 100%

---

## Étape B.1 : Composant SidebarSearch

**NEW** `src/components/SidebarSearch.tsx`

```typescript
/** SidebarSearch — shared search input for app sidebars */
import { Search } from 'lucide-react';

interface SidebarSearchProps {
  placeholder?: string;
  value: string;
  onChange: (query: string) => void;
}

export function SidebarSearch({ placeholder = 'Search...', value, onChange }: SidebarSearchProps) {
  return (
    <div className="px-4 py-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-white/20"
        />
      </div>
    </div>
  );
}
```

**Gate** : `tsc --noEmit`

---

## Étapes B.2-B.5 : Migration Search dans chaque App

Pour chaque App (`GtdApp.tsx`, `IkigaiApp.tsx`, `ParaApp.tsx`, `TwelveWeekApp.tsx`, `DealApp.tsx`) :

1. **Supprimer** la searchbar du `<header>` 
2. **Ajouter** import `import { SidebarSearch } from '../../components/SidebarSearch';`
3. **Placer** `<SidebarSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search..." />` dans le `<aside>` après les NavItems, avant le bloc "Mind Sweep" (GTD) ou en fin de sidebar
4. Le state `searchQuery` reste dans le composant App

**Gate** : Toutes les searchbars dans les sidebars

---

## Étape C.1 : Composant HeaderFilterBar

**NEW** `src/components/HeaderFilterBar.tsx`

```typescript
/** HeaderFilterBar — horizontal filter tabs for framework headers */
import { clsx } from 'clsx';

export interface FilterItem {
  id: string;
  label: string;
}

interface HeaderFilterBarProps {
  items: FilterItem[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  scrollable?: boolean;
  accentColor?: string;
}

export function HeaderFilterBar({ items, activeFilter, onFilterChange, scrollable = false, accentColor = 'emerald' }: HeaderFilterBarProps) {
  const accent = accents[accentColor] ?? accents.emerald;
  return (
    <div className={clsx("flex items-center gap-1", scrollable && "overflow-x-auto no-scrollbar")}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onFilterChange(item.id)}
          className={clsx(
            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest font-outfit transition-all duration-200 whitespace-nowrap border",
            activeFilter === item.id
              ? `${accent.bg} ${accent.border} ${accent.text}`
              : "border-transparent text-white/30 hover:bg-white/5 hover:text-white/50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const accents: Record<string, { bg: string; border: string; text: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400' },
  teal:    { bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    text: 'text-teal-400' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400' },
};
```

**Gate** : `tsc --noEmit`

---

## Étapes C.2-C.6 : Header Menus par App

Pour chaque App, ajouter dans le `<header>` (maintenant libéré de la searchbar) :

**Ikigai** (`IkigaiApp.tsx`) :
```tsx
import { HeaderFilterBar } from '../../components/HeaderFilterBar';
const horizonFilters = [{ id: 'all', label: 'All' }, { id: 'H1', label: 'H1' }, { id: 'H3', label: 'H3' }, { id: 'H10', label: 'H10' }, { id: 'H30', label: 'H30' }, { id: 'H90', label: 'H90' }];
// In header:
<HeaderFilterBar items={horizonFilters} activeFilter={activeHorizon} onFilterChange={setActiveHorizon} accentColor="purple" />
```

**PARA** : `scrollable={true}`, items = `[All, Business, Finance, Health, Cognition, Creativity, Habitat, Relations, Impact]`

**12WY** : items = `[All, W1, W2, ..., W12]`, accentColor = `teal`

**GTD** : items = `[All, @Home, @Work, @Errands, Waiting, Someday]`, accentColor = `blue`

**DEAL** : items = `[Definition, Elimination, Automation, Liberation]`, accentColor = `red`

**Gate Finale** : `npm run gate` + tous les Header Menus visibles et cliquables
