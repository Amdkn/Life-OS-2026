# PRD-025 — Pont API REST & Harness d'Orchestration Life OS <=> Business OS

## 1. Valeur et Remplacement
- **Origine Business OS :** `api/chat.ts`, `scripts/build-harness.mjs`, `_runtime/bridge/`.
- **Obstacle dans Life OS :** Fonctionnement en silo isolé sans communication bidirectionnelle avec les métriques et offres réelles de Business OS (The OMK Office, JaaS).
- **Remplacement :** Déployer les endpoints API et le harnais d'orchestration (`src/lib/bridge/business-bridge.ts`) permettant à Life OS de synchroniser le bilan temps/énergie avec le pipeline de valeur de Business OS.

## 2. Périmètre et Implémentation
- Route API de synchronisation :
  - `POST /api/bridge/life-to-business` : Transmission de la capacité de bande passante (Strategic Time Blocks disponibles).
  - `GET /api/bridge/business-to-life` : Réception des jalons critiques de cash-flow et deadlines clients pour alimenter W1-W12.
- Intégration dans le header de l'OS du commutateur trimodal (Tech OS, Life OS, Business OS).

## 3. Acceptation Fonctionnelle
- Échange de payloads typés entre Life OS et Business OS vérifié sans régression.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
