# ADR-V0.4.3 — Routage Spock & Data (The Enterprise Computer)

> **Phase** : V0.4.3
> **Contexte** : Visualisation matricielle pour Spock (Areas) et recyclage des archives pour Data (DEAL).

## Décision Architecturale : Pipeline d'Extraction Unidirectionnel (Archive → DEAL)

Un projet archivé dans PARA doit pouvoir être recyclé via le framework D.E.A.L (Definition, Elimination, Automation, Liberation). 
**Décision :** La transformation N'EST PAS une référence d'ID. L'archive PARA est "morte" (immuable). L'action "Transform" copie le titre et la description de l'archive pour initialiser une nouvelle entrée "Definition" dans le store DEAL.

### Justification
Un projet actif a des références (GTD, 12WY). Un projet archivé est un Read-Only record historique. Le recyclage via DEAL est la naissance d'un nouveau système (Muse), il doit repartir de zéro avec son propre cycle de vie. Cela évite un couplage fort avec les "fantômes" de PARA.

## Phase A : Areas (Officier Scientifique Spock)

### Contrats TypeScript (AVANT/APRÈS)
```typescript
// src/apps/para/components/DomainCard.tsx
// AVANT
interface DomainCardProps { domain: LifeWheelDomain; count: number; }
// APRÈS
interface DomainCardProps { 
  domain: LifeWheelDomain; 
  activeProjects: Project[]; // On passe les projets pour calculer les counts par pilier
  onPillarSelect: (pillar: string) => void;
}
```

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| A.1 | `DomainCard.tsx` | Modifier les props pour recevoir `activeProjects`. Calculer le count projet par pilier via `.filter(p => p.pillars.includes(p.id)).length`. | `tsc --noEmit` |
| A.2 | `DomainCard.tsx` | Importer `useOsSettingsStore`. Mapper la couleur de la carte via `domainConfigs.find(c => c.domain === domain)`. | `tsc --noEmit` |
| A.3 | `DomainCard.tsx` | Ajouter bouton (lucide-react Compass) "View in Ikigai", onClick=openApp('ikigai'). | `tsc --noEmit` |
| A.4 | `ParaApp.tsx` | Mettre à jour l'appel `<DomainCard />`. Ajouter un state `activePillarFilter` et l'appliquer à `filteredProjects`. | `npm run gate` |

## Phase B : Archives (Commandeur Data)

### Plan DDD Tabulé
| Étape | Fichier | Description | Gate |
|-------|---------|-------------|------|
| B.1 | `ProjectCard.tsx` | Si mode 'archives', afficher la date `new Date(archivedAt).toLocaleDateString()` à la place du Progress bar. | `tsc --noEmit` |
| B.2 | `fw-deal.store.ts` | (Si manquant) Ajouter action `importFromPARA(title, description)` au store DEAL. | `tsc --noEmit` |
| B.3 | `ParaApp.tsx` | Dans le rendu conditionnel d'`activeTab === 'archives'`, le bouton "Transform via DEAL" fait : `importFromPARA(...)` puis `openApp('deal')`. | `npm run gate` |
