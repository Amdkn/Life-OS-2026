# PRD-023 — AssistantOverlay Multi-Agents & Roster Dynamique

## 1. Valeur et Remplacement
- **Origine Business OS :** `src/agent/AssistantOverlay.tsx`, `src/agent/AgentTile.tsx`, `src/stores/assistant.store.ts`.
- **Obstacle dans Life OS :** Un seul agent ou des assistants figés en texte, sans présence spatiale sur le bureau virtuel.
- **Remplacement :** Rapatrier le système d'assistants multi-personnages côte à côte sur le bureau virtuel, avec des tuiles `AgentTile` indépendantes, gestion des bulles de chat, et streaming de réponses.

## 2. Périmètre et Implémentation
- Créer le composant `src/agent/AssistantOverlay.tsx` s'abonnant à `assistant.store.ts`.
- Intégrer les tuiles d'agents pour l'Armada Life OS :
  - `A0 Amadeus` (Supervision souveraine).
  - `A1 Beth` (Conscience & Arbitrage Ikigai).
  - `A1 Morty` (Exécution tactique & Focus).
- Support de la sélection et du positionnement libre sur le bureau virtuel avec borne de sécurité anti-débordement d'écran (`useWindowManager`).

## 3. Acceptation Fonctionnelle
- Affichage simultané des tuiles d'agents sans boucle infinie React (`useShallow`).
- Bascule ouverture/fermeture des bulles de dialogue réactive.
- Validation avec `npm run lint` et `npm run build` (0 erreur).
