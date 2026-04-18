# PRD: V0.5.1 La Forge des Principes (CRUD Constitutionnel)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Haute. Nécessite de casser l'existant en localStorage pour implémenter un cache hybride Zustand/IndexedDB classique.
*   **Valeur (V)** : Fondamentale. Transforme un template statique en un moteur d'écriture souverain.
*   **Réutilisabilité (R)** : Le système de "Node" textuel sera le bloc de base pour tous les autres frameworks (12WY Goals, DEAL Definitions).

## 2. User Stories (Phase A - Écriture Souveraine)

*   **US-65 [Ikigai Vision Nodes]** : "En tant que Watcher, je veux voir un bouton `+ New Vision` sur n'importe quelle intersection de ma matrice Ikigai (ex: Mission x H3). Ce bouton ouvre une modale pleine page épurée (typographie d'écriture) pour y rédiger ma vision."
*   **US-66 [Life Wheel Ambitions]** : "En tant que Watcher, je veux un bouton `+ New Ambition` dans l'onglet d'un domaine de ma Life Wheel (ex: Habitat) pour y figer mes standards absolus."
*   **US-67 [Persistance IndexedDB]** : "En tant qu'Architecte, je veux que l'ajout, la modification ou la suppression de ces "Nodes" soient immédiatement sauvegardés dans une table dédiée de l'IndexedDB (ex: `table: 'ikigai'` et `table: 'wheel'`)."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Créer de nouvelles colonnes Horizons | Horions et Piliers SONT constants et Hardcodés. Aucun CRUD sur la structure. |
| Utiliser `persist` de Zustand | Remplacer la logique de Seed/Persist par `readFromLD` et `writeToLD`. |
| Modale Étouffante | Le mode écriture doit ressembler à un traitement de texte minimaliste (Fond sombre, typo élégante). |

## 4. Fichiers Impactés
*   `stores/fw-ikigai.store.ts` (Nouveau type `IkigaiVision`, liaison LD-Router)
*   `stores/fw-wheel.store.ts` (Nouveau type `WheelAmbition`, liaison LD-Router)
*   `apps/ikigai/IkigaiApp.tsx` & composants enfants
*   `apps/life-wheel/LifeWheelApp.tsx` & composants enfants
