# ADR-V0.6.4 — La Forge de Vision (Pike's Console)

## 1. Contexte & Problème
L'interface de création d'une `WyVision` 12WY utilisait un `window.prompt`. L'expérience utilisateur est brisée et la connexion à `Ikigai` (clé étrangère `ikigaiVisionId`) est physiquement impossible à saisir.

## 2. Décisions (Cross-Store Data)

### 2.1 Injection Zustand (Lecture Seule)
La modale `<VisionForgeModal />` doit afficher les visions existantes de la "Constitution" (Ikigai). Pour éviter la duplication, elle invoquera directement le hook de l'application voisine :
```typescript
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';

// Utilisé pour le <select> du formulaire
const ikigaiVisions = useIkigaiStore(s => s.visions);
```

### 2.2 Zéro Hard Reload
La validation du formulaire exécutera `await useTwelveWeekStore.getState().addVision(newVision)` puis fermera la modale via un state local `isOpen`, permettant un affichage instantané dans le tableau de bord.

## 3. Conséquences & Isolation
*   Cette architecture entérine le principe que les "Applications" (Dossiers `apps/`) peuvent lire les "Stores" (`stores/`) d'autres applications. C'est le **Nexus Frontend**.
*   Par contre, `fw-12wy.store.ts` n'importe pas `fw-ikigai.store.ts`. Les stores restent isolés. L'intégration se fait dans les composants (React View Layer).

## 4. Étapes DDD (A3)
*   **Étape A** : Créer le composant UI `VisionForgeModal.tsx`.
*   **Étape B** : Ajouter des hooks d'ouverture `[isVisionModalOpen, setVisionModalOpen] = useState(false)` dans `TwelveWeekApp.tsx` en remplaçant l'endroit où le `window.prompt` était appelé.
