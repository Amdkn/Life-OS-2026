# ADR-V0.7.4 — Machine à États & Engage View

## 1. Contexte & Problème
L'interface concentrée de `Dashboard.tsx` dans GTD affiche simultanément l'Inbox, les actions et les statistiques. Pour l'A'Space OS, Clarifier (vider l'inbox) et Engager (exécuter la tâche) réclament une posture mentale différente.

## 2. Décisions (Vue Engage Isolée)

### 2.1 Sélecteur Zustand Pur
L'erreur "Infinite Loop" commise en V0.6 ne doit pas se répéter.
```typescript
// DANS ENGAGE.TSX
const allItems = useGtdStore(s => s.items);
const activeContext = useGtdStore(s => s.activeContext);

// Le filtre est HORS du sélecteur Zustand.
const engageItems = useMemo(() => {
   return allItems
     .filter(i => i.status === 'actionable')
     .filter(i => activeContext === 'all' || i.context === activeContext)
     .sort((a,b) => (b.energy === 'high' ? 1 : -1)); // Sort energy etc...
}, [allItems, activeContext]);
```

### 2.2 Refactoring du Dashboard
*   Le composant Root `Dashboard.tsx` n'est plus qu'un "Switch" qui rend soit `<ClarifyView />`, `<OrganizeView />` ou `<EngageView />` selon la valeur `activeTab` du store.
*   `EngageView` ne contient plus la barre de saisie (remplacée de toute façon par l'OmniCapture), mais des filtres rapides (Pilules de contexte) et la liste des tâches à accomplir maintenant.

## 3. Conséquences & Isolation
*   Amélioration drastique des performances de l'application React par l'isolation des re-renders liés à chaque sous-vue.
*   L'UX rejoint parfaitement la philosophie "Lower Decks": on ne regarde pas le fouilli de l'inbox quand on est en mode attaque.

## 4. Étapes DDD (A3)
*   **Étape A** : Créer le routage interne conditionnel dans `Dashboard.tsx`.
*   **Étape B** : Extraire `ClarifyView.tsx` pour vider l'Inbox.
*   **Étape C** : Créer `EngageView.tsx` avec les filtres mémoire (Mémoïsation) appropriés.
