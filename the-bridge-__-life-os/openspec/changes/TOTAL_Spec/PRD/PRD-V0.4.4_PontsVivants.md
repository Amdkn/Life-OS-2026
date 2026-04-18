# PRD-V0.4.4 — UX Picard : Ponts Vivants

> **Phase** : V0.4.4 · **Statut** : 🏗️ Draft

## 1. TVR
- **T** : Moyenne. Le hotfix ItemModal est chirurgical. L'ajout de `projectId` aux stores GTD/12WY est backward-compatible (champ optionnel). Le FrameworkBridge existe déjà en coquille vide.
- **V** : Critique. Sans ce câblage, le Command Card de Picard est aveugle — il ne voit ni ses actions ni sa stratégie.
- **R** : Le pattern Quick-Add sera réutilisé pour tous les futurs ponts inter-frameworks.

## 2. User Stories

### Phase A : Hotfix ItemModal
- **US-44 : Bouton + New typé**
  - [ ] `ParaApp.tsx` : Le bouton `+ New` passe `type={activeTab === 'resources' ? 'Resource' : 'Project'}`.
  - [ ] Le bouton est **masqué** si `activeTab === 'areas'` ou `activeTab === 'archives'`.
  - [ ] `ItemModal` dispatch vers `addProject()` OU `addResource()` selon le `type` prop.
- **US-45 : `addResource` + `deleteProject` dans le store**
  - [ ] `fw-para.store.ts` : `addResource(r: Resource)` avec sync LD `writeToLD(ldId, 'resources', 'add', ...)`.
  - [ ] `fw-para.store.ts` : `deleteProject(id: string)` avec sync LD `writeToLD(ldId, 'projects', 'delete', ...)`.

### Phase B : Enrichissement Cross-Store
- **US-46 : `projectId` dans GTD**
  - [ ] `fw-gtd.store.ts` : Ajouter `projectId?: string` à `GTDItem`.
  - [ ] `addItem` accepte un `projectId` optionnel.
- **US-47 : `projectId` dans 12WY**
  - [ ] `fw-12wy.store.ts` : Ajouter `projectId?: string` à `Goal`.

### Phase C/D : Ponts Vivants
- **US-48 : GTD Bridge Vivant**
  - [ ] `FrameworkBridge` : selector `useGtdStore(s => s.items.filter(i => i.projectId === projectId))`.
  - [ ] Badge rouge "⚠ STALLED" si `count === 0`.
  - [ ] Quick-Add inline → `useGtdStore.addItem(text)` avec `projectId` pré-rempli.
- **US-49 : 12WY Bridge Vivant**
  - [ ] `FrameworkBridge` : selector `useTwelveWeekStore(s => s.goals.filter(g => g.projectId === projectId))`.
  - [ ] Badge status "On Track" / "Behind" selon `targetWeek`.

## 3. Anti-Patterns
| ❌ | ✅ |
|----|----|
| `addProject()` quand on crée une Resource | Dispatch conditionnel selon `type` prop dans ItemModal |
| Bouton `+ New Area` visible | Masqué (`!['areas','archives'].includes(activeTab)`) |
| Charger TOUT le store GTD dans un composant | Sélecteur Zustand filtré par `projectId` |
| Quick-Add GTD sans `projectId` | `addItem(content, { projectId })` |
