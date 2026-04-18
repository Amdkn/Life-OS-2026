# ADR-V0.6.5 — La Forge d'Objectif (Una's Console)

## 1. Contexte & Problème
Lorsqu'il crée un `WyGoal`, le commandant doit impérativement l'attacher à un Projet (PARA) existant (`projectId`). Le `prompt` ne le permet pas. Le processus doit également être fluide si le projet n'existe pas encore.

## 2. Décisions (Le Lien Picard-Una)

### 2.1 Nexus Bidirectionnel Logique
Dans la `<GoalForgeModal />`, l'utilisateur sélectionne un projet depuis une liste déroulante :
```typescript
import { useParaStore } from '../../../stores/fw-para.store';

// Extraction des projets uniquement
const paraProjects = useParaStore(s => s.projects.filter(p => p.status === 'active'));
```

### 2.2 L'Auto-Commission (Injection Inter-Système)
C'est la décision majeure : si le commandant clique sur "Create New Project" dans la modale, la modale va non seulement insérer le `WyGoal` via `useTwelveWeekStore`, mais elle va EN PLUS appeler `useParaStore.getState().addProject()` pour créer le projet dans le store PARA de façon transparente.
```typescript
const handleForge = async () => {
   // 1. Si Auto-Commission, injecte dans PARA d'abord
   const newProjectId = await useParaStore.getState().addProject({...});
   // 2. Insère le Goal avec l'ID du projet
   await useTwelveWeekStore.getState().addGoal({ ...goal, projectId: newProjectId });
}
```

## 3. Conséquences & Isolation
*   Ceci permet le "Frictionless Workflow" de l'A'Space OS. Les barrières entre PARA et 12WY sautent au niveau de l'expérience, mais le stockage (IndexedDB `ld01/resources`) gère chaque entité séparément.

## 4. Étapes DDD (A3)
*   **Étape A** : Créer `<GoalForgeModal />` avec le Selecteur de projet PARA et le Target Week (1-12).
*   **Étape B** : Implémenter le raccourci d'**Auto-Commission**.
*   **Étape C** : Remplacer le `prompt` correspondant dans `TwelveWeekApp.tsx`.
