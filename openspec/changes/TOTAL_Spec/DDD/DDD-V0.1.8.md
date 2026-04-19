# DDD-V0.1.8 — Meta-Prompt Agent Portal 🧿

> **Contexte** : V0.1.8 (Hub Agent Portal — Gestion A1/A2/A3, Logs, Injection de tâches)
> **ADR** : `_SPECS/ADR/ADR-FWK-018_AgentPortal_Structure.md`
> **Dépendance** : Tag `v0.1.7-baseline`

---

## ⚠️ PRÉ-REQUIS
1. Lire `_SPECS/CONTRACTS.md`
2. `npx tsc --noEmit` — Baseline stable

---

## Phase 1 & 2 : Nettoyage

### Fichiers existants
- `src/apps/command-center/pages/AgentsPage.tsx` — Page agents dans CC
- `src/stores/agents.store.ts` — Store des logs agents (déjà utilisé par AIPanel)

### Étapes concrètes
1. Extraire AgentsPage en app standalone `src/apps/agent-portal/`
2. Créer `src/apps/agent-portal/register.ts` conforme CONTRACTS.md
3. Créer `AgentPortalApp.tsx` avec sidebar + dashboard
4. Le store agents existant devient la base, pas besoin d'un nouveau LD

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 1-2 OK"
```

---

## Phase 3 : Renforcement (Agents Store enrichi)

### Extension du store
```typescript
// src/stores/agents.store.ts — Extension
interface AgentProfile {
  id: string;
  name: string;
  layer: 'A0' | 'A1' | 'A2' | 'A3';
  ship: string;
  status: 'online' | 'busy' | 'offline';
  lastActivity: number;
  tasksCompleted: number;
}

// Pas d'IndexedDB dédié — les agents sont en mémoire
// Les logs persistent via localStorage avec un buffer rotatif (max 200 logs)
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 3 OK"
```

---

## Phase 4 : Injection de Tâches

1. Interface `TaskInjector` — formulaire pour assigner une tâche à un agent
2. Système de routing : tâche → bon layer → bon ship → bon agent
3. Historique des tâches injectées avec statuts
4. Lien avec le Veto system de Beth

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 4 OK"
```

---

## Phase 5 : Dashboard Agent Portal (Pattern 7)

### Contrat Dashboard
```typescript
interface AgentsDashboardProps {
  embedded?: boolean;
}

// Sections obligatoires :
// 1. Grille des agents par Layer (A0/A1/A2/A3) avec statuts
// 2. Logs interactifs (terminal-style, scrollable)
// 3. Quick Task Injector (inline)
// 4. Fleet status (vaisseaux actifs)
```

### Intégration CC
```typescript
case 'agents': return <AgentsDashboard embedded />;
```

### Build Gate ✅
```bash
npx tsc --noEmit && echo "Phase 5 OK"
```

---

## Phase 6 & 7 : Style + Audit

1. Terminal-style logs (monospace, vert sur noir)
2. Status dots pulsants pour les agents actifs
3. Deep linking `aspace://app/agents?layer=A3`
4. Test : injecter une tâche → log apparaît → agent status change

### Condition de sortie
Phase 7 passée → `git tag v0.1.8-baseline`
