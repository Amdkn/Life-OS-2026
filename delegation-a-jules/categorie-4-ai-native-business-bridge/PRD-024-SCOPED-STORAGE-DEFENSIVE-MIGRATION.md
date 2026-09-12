# PRD-024 — Scoped Storage & Moteur de Persistance Défensive

## 1. Valeur et Remplacement
- **Origine Business OS :** `src/lib/auth/storage-scope.ts`, `src/stores/migrationDefensive.ts`.
- **Obstacle dans Life OS :** Risque de collision de données localStorage/IndexedDB lors des montées de version de schémas ou de bascule multi-profils (ex: Life OS perso vs Business OS pro).
- **Remplacement :** Implémenter le stockage compartimenté par tenant/scope (`createScopedStorage(scope)`) et le décodeur d'enveloppe versionnée (`decodeVersionedEnvelope`) pour assainir automatiquement les données locales corrompues sans bloquer le boot.

## 2. Périmètre et Implémentation
- Envelopper les clés de layout (`LAYOUT_KEY = 'life-os-layout-v1'`) avec `SCHEMA_VERSION`.
- En cas de corruption ou de structure invalide, réinitialiser silencieusement la zone concernée sans provoquer d'écran blanc (White Screen of Death).
- Rapatrier `ViewportGuard.tsx` (`src/components/ViewportGuard.tsx`) pour assurer la cohérence du canvas sur toutes les résolutions.

## 3. Acceptation Fonctionnelle
- Test unitaire : injection d'une charge locale corrompue `localStorage.setItem(...)` ; au rechargement, Life OS réinitialise la vue par défaut sans planter.
- Isolation stricte des scopes vérifiée par tests Jest/Vitest.
- Validation avec `npm run lint` et `npm run build` (0 erreur).
