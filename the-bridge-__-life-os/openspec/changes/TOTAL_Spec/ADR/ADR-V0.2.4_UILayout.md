# ADR-V0.2.4 — UI Layout & Header Menus

> **PRD** : PRD-V0.2.4 · **Statut** : Proposé
> **Décideur** : A'"0 (GravityClaw) · **Exécuteur** : A3 (Gemini CLI)

---

## Décision
Créer 2 composants partagés (`SidebarSearch.tsx`, `HeaderFilterBar.tsx`) et ajouter des chevrons toggle aux panels du Command Center. Les searchbars migrent des headers vers les sidebars, libérant l'espace pour les Header Menus filtrants.

## Justification
L'espace header de chaque App est occupé par une searchbar + un titre, ne laissant aucune place aux filtres contextuels (Horizons, Domaines, Semaines). Le pattern RyOS et macOS standard place la recherche dans la sidebar.

---

## Phase A : CC Toggle Panels (5 étapes)

### Contrats
```typescript
// Dans CommandCenter.tsx — nouveaux states
const [sidebarOpen, setSidebarOpen] = useState(true);
const [aiPanelOpen, setAiPanelOpen] = useState(true);
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| A.1 | MODIFY `CommandCenter.tsx` | Ajouter `sidebarOpen` state + chevron `«` sur le bord droit de `<aside>` sidebar |
| A.2 | MODIFY `CommandCenter.tsx` | Ajouter `aiPanelOpen` state + chevron `»` sur le bord gauche de `<aside>` AI Panel |
| A.3 | MODIFY `CommandCenter.tsx` | Conditionner `width` sidebar : `sidebarOpen ? 'w-[200px]' : 'w-0 overflow-hidden'` |
| A.4 | CSS | `transition: width 300ms ease` sur les deux `<aside>` |
| A.5 | Gate | `tsc --noEmit` + toggle sidebar/AI Panel visuellement |

### Anti-patterns
- ❌ Pas de `display: none` (casse le layout flex)
- ✅ `width: 0` + `overflow: hidden` + `transition`

---

## Phase B : SidebarSearch Partagé (6 étapes)

### Contrat
```typescript
// src/components/SidebarSearch.tsx [NEW]
interface SidebarSearchProps {
  placeholder?: string;
  value: string;
  onChange: (query: string) => void;
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| B.1 | NEW `SidebarSearch.tsx` | Input transparent avec icône loupe, style archo-futuriste |
| B.2 | MODIFY `GtdApp.tsx` | Supprimer searchbar du header, ajouter `<SidebarSearch>` sous les tabs sidebar |
| B.3 | MODIFY `IkigaiApp.tsx` | Idem — search dans sidebar |
| B.4 | MODIFY `ParaApp.tsx` | Idem |
| B.5 | MODIFY `TwelveWeekApp.tsx` + `DealApp.tsx` | Idem |
| B.6 | Gate | Toutes searchbars dans sidebars, headers libérés |

---

## Phase C : HeaderFilterBar (6 étapes)

### Contrat
```typescript
// src/components/HeaderFilterBar.tsx [NEW]
interface FilterItem { id: string; label: string; icon?: LucideIcon }

interface HeaderFilterBarProps {
  items: FilterItem[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  scrollable?: boolean;  // pour PARA avec 9 domaines
}
```

### Étapes DDD
| Étape | Action | Détail |
|-------|--------|--------|
| C.1 | NEW `HeaderFilterBar.tsx` | Composant tabs/pills horizontaux avec scroll optionnel |
| C.2 | MODIFY `IkigaiApp.tsx` | Header = `[H1, H3, H10, H30, H90]` → state `activeHorizon` |
| C.3 | MODIFY `ParaApp.tsx` | Header = Life Wheel domains scroll horizontal |
| C.4 | MODIFY `TwelveWeekApp.tsx` | Header = `[W1..W12, All]` |
| C.5 | MODIFY `GtdApp.tsx` | Header = `[All, @Home, @Work, @Errands, Waiting, Someday]` |
| C.6 | MODIFY `DealApp.tsx` | Header = `[Definition, Elimination, Automation, Liberation]` |

Gate : `npm run gate` + tous les Header Menus visibles et cliquables

---

## Risques

| Risque | Mitigation |
|--------|-----------|
| Header trop chargé avec beaucoup de filtres (PARA: 9) | `scrollable={true}` avec overflow scroll horizontal |
| SidebarSearch casse le layout sidebar | Placer SOUS les NavItems, avec `mt-auto` ou divider |
| Toggle casse le responsive | Tester desktop + mobile |
