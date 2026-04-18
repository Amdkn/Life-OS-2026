# ADR-V0.6.7 — Formulaires de Genèse (Routage Wheel)

## 1. Contexte & Problème
Une Stratégie à 3 ans (Vision) définie dans le 12 Week Year n'a pas de portée si elle n'est pas attachée à un des 8 Domaines de la Life Wheel (ex: Santé, Business, Mind). Actuellement, la `VisionForgeModal` ne pointe que vers `ikigaiVisionId`.

## 2. Décisions (Le Triple Nexus)

### 2.1 Nouveau Champ Obligatoire
Extension du contrat `WyVision` dans `fw-12wy.store.ts` :
```typescript
export interface WyVision extends ParaItem {
  // ...
  domainId: string; // REQUIRED: Liaison avec la Life Wheel
  ikigaiVisionId?: string; // OPTIONAL: Liaison stricte avec Ikigai
}
```

### 2.2 Re-Route UI (`VisionForgeModal.tsx` & `GoalForgeModal.tsx`)
La modale Vision lira le `fw-wheel.store` pour forcer l'utilisateur à catégoriser sa vision.
```typescript
import { useWheelStore } from '../../../stores/fw-wheel.store';
// ...
const domains = useWheelStore(s => s.nodes); // Extraction des 8 domaines
```
Dans `GoalForgeModal`, le choix de la Vision mère affichera des informations en lecture seule déduites de cette vision (ex: Son `domainId`). 

## 3. Conséquences & Isolation
*   Cette décision densifie le maillage. Un Goal hérite implicitement du Domaine de sa Vision parente, qui hérite potentiellement d'un Pôle Ikigai. O($1$) lookup time.
*   L'intégrité de l'IndexedDB `resources` est maintenue grâce à l'enregistrement du simple string `domainId`.

## 4. Étapes DDD (A3)
*   **Étape A** : Ajouter `domainId` dans l'interface `WyVision` et dans l'action `addVision`.
*   **Étape B** : Mettre à jour `<VisionForgeModal />` avec le select du Wheel Store.
*   **Étape C** : Sécuriser la sélection du Goal via des tags visuels read-only.
