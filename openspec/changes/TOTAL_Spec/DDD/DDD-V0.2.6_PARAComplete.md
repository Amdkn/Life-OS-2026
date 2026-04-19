# DDD-V0.2.6 — PARA Complete

> **ADR** : ADR-V0.2.6 · **Dépendance** : DDD-V0.2.4
> **Dossier** : `the-bridge-__-life-os/src/`

---

## Étapes A.1-A.5 : Types & Store PARA

**MODIFY** `src/stores/fw-para.store.ts`

```typescript
export type LifeWheelDomain = 'business' | 'finance' | 'health' | 'cognition' | 'creativity' | 'habitat' | 'relations' | 'impact';
export type BusinessPillar = 'growth' | 'operations' | 'product' | 'finance' | 'people' | 'it' | 'legal' | 'meta';

export const DOMAIN_LABELS: Record<LifeWheelDomain, string> = {
  business: 'Business Pulse', finance: 'Finance', health: 'Health', cognition: 'Cognition',
  creativity: 'Creativity', habitat: 'Habitat', relations: 'Relations', impact: 'Impact'
};

export const PILLAR_LABELS: Record<BusinessPillar, string> = {
  growth: 'Growth', operations: 'Operations', product: 'Product', finance: 'Finance',
  people: 'People', it: 'IT', legal: 'Legal', meta: 'Meta'
};

export interface DomainPillar { id: string; domain: LifeWheelDomain; pillar: BusinessPillar; label: string; description: string; }
export interface Project { id: string; title: string; status: 'active' | 'paused' | 'completed' | 'archived'; domain: LifeWheelDomain; pillars: string[]; resources: string[]; progress: number; archivedAt?: number; }
export type ResourceType = 'book' | 'tool' | 'contact' | 'template' | 'course' | 'article' | 'video' | 'other';
export interface Resource { id: string; title: string; type: ResourceType; category: string; linkedProjects: string[]; linkedPillars: string[]; }

// State
activeDomain: LifeWheelDomain | 'all';
setActiveDomain: (d: LifeWheelDomain | 'all') => void;
customResourceTypes: string[];
addCustomResourceType: (type: string) => void;
```

**Seed** : 64 DomainPillars (8×8), 8 Projects (1/domain), 16 Resources (2/type).

**Gate** : `tsc --noEmit`

---

## Étapes B.1-B.4 : Projects

**NEW** `src/apps/para/components/ProjectCard.tsx`
```typescript
export function ProjectCard({ project, onClick }: { project: Project; onClick: (p: Project) => void }) {
  const statusColors = { active: 'emerald', paused: 'amber', completed: 'blue', archived: 'white/20' };
  return (
    <button onClick={() => onClick(project)} className="text-left p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all w-full">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-${statusColors[project.status]}-500/20 text-${statusColors[project.status]}-400`}>{project.status}</span>
        <span className="text-[9px] text-white/20">{DOMAIN_LABELS[project.domain]}</span>
      </div>
      <h3 className="text-sm font-bold text-white/80 mb-3">{project.title}</h3>
      <div className="w-full h-1.5 bg-white/5 rounded-full"><div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${project.progress}%` }} /></div>
    </button>
  );
}
```

**NEW** `src/apps/para/pages/ProjectDetail.tsx` — sous-page avec resources liées, piliers tags, timeline placeholder.

Projects page : grille filtrée par `activeDomain` via `HeaderFilterBar`.

**Gate** : Cards project → click → detail

---

## Étapes C.1-C.4 : Areas (Domaines × Piliers)

**NEW** `src/apps/para/components/DomainCard.tsx`
```typescript
export function DomainCard({ domain, pillars, expanded, onToggle }: DomainCardProps) {
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center"><span className="text-lg">{domainIcons[domain]}</span></div>
          <span className="text-sm font-bold uppercase tracking-widest">{DOMAIN_LABELS[domain]}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="grid grid-cols-2 gap-2 p-4 pt-0">
          {pillars.map(p => <PillarSubCard key={p.id} pillar={p} />)}
        </div>
      )}
    </div>
  );
}
```

**Gate** : 8 DomainCards, expand → 8 piliers

---

## Étapes D.1-D.5 : Resources & Archives

**NEW** `src/apps/para/components/ResourceCard.tsx` — badges type, linked count.

Resources page : groupées par type, filter pills, bouton "Add Type" → prompt → `addCustomResourceType()`.

Archives page : projets `status === 'archived'`, badge "→ Muse potential", bouton "Transform via DEAL" → `openApp('deal', 'DEAL')`.

**Gate Finale** : `npm run gate` + navigation Projects↔Areas↔Resources↔Archives
