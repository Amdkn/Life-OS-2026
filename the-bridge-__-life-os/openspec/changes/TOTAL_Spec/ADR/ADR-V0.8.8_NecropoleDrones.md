# ADR-V0.8.8 — La Nécropole des Drones (Graveyard)

## 1. Contexte & Problème
Lorsqu'un script devient obsolète (L'API cible n'est plus maintenue par ex.), le Commanditaire doit avoir la possibilité de stopper l'automatisation sans l'effacer définitivement, de manière à garder un log des "Assets" passés.

## 2. Décisions (Sunsetting & Filtrage)

### 2.1 Action de Decommissioning
Le store Zustand DEAL se dote de la logique d'état : `deprecated`.
Le bouton "Delete" ou "Trash" sur les Muses actives est remplacé sémantiquement par "Decommission Drone". Il ne déclenche pas une suppression sur IndexedDB, mais un simple `patch { status: 'deprecated' }`.

### 2.2 L'Archive View (Le Cimetière)
Afin de ne pas polluer le centre de commandement actif, les Muses `deprecated` sont retirées de la vue par défaut via un `.filter(m => m.status !== 'deprecated')` dans `Muses.tsx`.
Cependant, un toggle "Show Archives" permet de ré-afficher ce cimetière dans un mode basse opacité (`opacity-50 grayscale`), certifiant qu'elles n'impactent plus aucune statistique (LDR V0.8.6).

## 3. Conséquences & Isolation
*   Protection contre la perte de l'historique de productivité.
*   Le "Garbage Collection" (Suppression définitive) est délégué au niveau de l'Administration IT (Agent L0) et non disponible via l'UI fluide afin d'éviter les suppressions accidentelles par le Commandant surchargé.

## 4. Étapes DDD (A3)
*   **Étape A** : Déclarer la nouvelle UI action "Decommission".
*   **Étape B** : Incorporer le filtrage par défaut cachant les `deprecated`.
*   **Étape C** : Créer le Toggle "Archives" pour les révéler.
