# ADR-V0.7.3 — OmniCapture (Modale Globale)

## 1. Contexte & Problème
La capture "Context-Free" est le cœur du GTD. Pour l'instant, capturer une idée oblige le commandant à aller physiquement dans l'onglet "Dashboard" de l'App GTD, brisant 100% du flux de pensée s'il était en train d'écrire une Stratégie dans 12WY.

## 2. Décisions (Mariner's Shortcut)

### 2.1 Modale Globale au Root
Un composant `<OmniCaptureModal />` est monté extrêmement haut dans l'arbre React (ex: dans `App.tsx` ou le Root Layout du Command Center).
Il écoute l'Event global `keydown` (ex: `Ctrl + Space` ou `Cmd+K`).

### 2.2 Zéro Friction
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
   if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      setIsOpen(true);
   }
};
// Au render: useEffect -> window.addEventListener('keydown', ...)
```
Lorsque modale ouverte -> Blur du background -> L'input texte est `autoFocus` -> Touche `Entrée` valide le formulaire -> Appel asynchrone à `useGtdStore.getState().addItem()` -> Modale fermée.

## 3. Conséquences & Isolation
*   Totalement indépendant de l'endroit où se trouve le commandant. L'OS devient réactif et à son service.
*   En isolation, l'OmniCaptureModal importe `useGtdStore` uniquement pour l'action `addItem` (et non pour lire l'état) ce qui n'entraîne aucun re-render global lorsque l'inbox s'agrandit.

## 4. Étapes DDD (A3)
*   **Étape A** : Créer le composant UI autonome `<OmniCaptureModal />`.
*   **Étape B** : Brancher l'EventListener et la fonction de capture.
*   **Étape C** : Monter le composant au niveau du Dashboard Principal de l'OS.
