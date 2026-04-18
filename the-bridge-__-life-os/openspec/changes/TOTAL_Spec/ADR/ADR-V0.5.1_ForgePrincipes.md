# ADR-V0.5.1 — La Forge des Principes

## 1. Contexte & Problème
Jusqu'à présent, Ikigai et Life Wheel stockaient des seed datas statiques via le middleware `persist` (localStorage) de Zustand. Pour qu'A'Space OS devienne un système souverain, ces textes fundationnels (Visions et Ambitions) doivent être persistés dans IndexedDB et connectés au LD-Router. De plus, la structure mère (les 8 Domaines et les intersections Ikigai) doit rester immuable.

## 2. Décisions (Type Contract)

### 2.1 Ikigai Vision Nodes
L'interface `IkigaiItem` d'origine comportait seulement `horizon`, `pillar`, etc. Nous la refactorons pour devenir `IkigaiVision` héritant de `ParaItem`.

**APRÈS :**
```typescript
import type { ParaItem } from './fw-para.store';

export type IkigaiPillar = 'craft' | 'mission' | 'passion' | 'vocation';
export type IkigaiHorizon = 'H1' | 'H3' | 'H10' | 'H30' | 'H90';

export interface IkigaiVision extends ParaItem {
  type: 'vision';
  pillar: IkigaiPillar;
  horizon: IkigaiHorizon;
  content: string; // La "Constitution" elle-même
}
```

### 2.2 Life Wheel Ambitions
Nous conservons `WheelDomain` comme définition *statique* (hardcodée) des 8 Domaines, mais nous introduisons une entité `WheelAmbition` pour le contenu que The Watcher rédige à l'intérieur d'un domaine.

**APRÈS :**
```typescript
export interface WheelAmbition extends ParaItem {
  type: 'ambition';
  domainId: string; // Ex: 'd1' (Business)
  content: string; // Les principes immuables du domaine
}
```

## 3. Conséquences & Isolation
*   Abandon de `persist` dans `fw-ikigai.store.ts` et `fw-wheel.store.ts`.
*   Appel de `readFromLD('system', 'ikigai')` au boot pour hydrater les visions.
*   Le bouton "New" est conditionnel à la sélection préalable d'un contenant fixe (une intersection Horizon/Pillar, ou un Domaine Life Wheel). On ne crée pas une vision "dans le vide".

## 4. Étapes DDD (A3)
*   **Étape A** : Mettre à jour `fw-ikigai.store.ts` avec le type `IkigaiVision` + intégration LD.
*   **Étape B** : Mettre à jour `fw-wheel.store.ts` avec le type `WheelAmbition` + intégration LD.
*   **Étape C** : UI Ikigai : Modale d'écriture d'une Vision. UI Wheel : Modale d'écriture d'une Ambition.
