# ADR-V0.6.8 — Vision Central Command (Carte Stratégique)

## 1. Contexte & Problème
L'affichage actuel des Visions dans le Dashboard 12WY se résume à une "liste de courses" statique. Il manque un espace de commandement pour observer une Stratégie et ses objectifs trimestriels enfants. 

## 2. Décisions (Central Command Pattern)

### 2.1 La Sub-Route Zustand
Lorsqu'un utilisateur clique sur une Vision dans le dashboard, au lieu d'ouvrir une modale d'édition, le système `activeTab` combiné à un nouvel état `activeVisionId` basculera la vue principale vers le composant `<VisionCommandCard />`.
```typescript
// hw-12wy.store.ts
interface TwelveWeekState {
   // ...
   activeVisionId: string | null;
   setActiveVisionId: (id: string | null) => void;
}
```

### 2.2 Résolution Paresseuse (Read-Only Bridge)
La Command Card lira le `frameworks`.
```typescript
const vision = visions.find(v => v.id === activeVisionId);
// The Nexus Resolution
const ikigaiRef = useIkigaiStore(s => s.visions.find(v => v.id === vision?.ikigaiVisionId));
const domainRef = useWheelStore(s => s.nodes.find(n => n.id === vision?.domainId));
// Children
const childGoals = goals.filter(g => g.visionId === vision?.id);
```

## 3. Conséquences & Isolation
*   L'application est totalement modulaire. La `VisionCommandCard` assemble à la volée des informations de 3 bases MongoDB/IndexedDB différentes (12WY, Ikigai, Wheel) sans jamais créer de relation "Deep Aggregate" complexe à stocker.
*   Le Glassmorphism est préservé via la superposition des cartes translucides.

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `activeVisionId` au store Zustand.
*   **Étape B** : Créer le composant UI masssif `<VisionCommandCard />`.
*   **Étape C** : Remplacer le rendu conditionnel du Dashboard pour afficher la carte lorsqu'une Vision est "en focus".
