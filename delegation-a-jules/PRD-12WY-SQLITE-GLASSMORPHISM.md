# PRD-001 : Architecture 12WY Solarpunk Glassmorphism & Moteur Local SQLite

## 1. Contexte & Vision 7D (Solarpunk Kardashev Type 2-4)
Life-OS-2026 est le hub d'exécution personnelle et d'alignement existentiel d'Amadou Kone (A0).
Suite à l'instabilité et la mise en pause du cloud Supabase (plan gratuit / pause), l'architecture bascule vers la doctrine **Local-First Native** :
- **SQLite / IndexedDB embarqué** comme source de vérité temps réel locale (latence sub-milliseconde, résilience 100% offline).
- **Supabase** relégué en synchronisation asynchrone / backup de fond (toutes les 24h).
- **Design System Glassmorphism Solarpunk Haut de Gamme** : interfaces vivantes, transparences néon / émeraude, micro-animations Framer Motion, alignement 12WY strict (Vision -> Goals -> Tactics -> TimeBlocks).

---

## 2. Objectifs Techniques Pour Jules (Google Labs)

### A. Intégration SQLite Local-First
1. Intégrer un adaptateur local SQLite dans `src/lib/sqlite-adapter.ts` (ou via sql.js WASM / backend API local) capable de persister l'intégralité des 8 domaines (`ld01_business`, `ld02_finance`, `ld03_health`, `ld04_cognition`, `ld05_habitat`, `ld06_social`, `ld07_creativity`, `ld08_legacy`).
2. Mettre en place un sync engine différé de 24h vers Supabase sans jamais bloquer l'UI locale ni afficher de splash de blocage ("CHECKING MEMORY INTEGRITY...").

### B. Refonte UI/UX Glassmorphism Solarpunk du Framework 12WY
Aligner `src/apps/twelve-week/` sur le canon visuel et fonctionnel de la V3 :
1. **Vision Screen (`src/apps/twelve-week/components/VisionCommandCard.tsx`)** :
   - Affichage Solarpunk Glassmorphism des 3 horizons (H1 / H3 / H10).
   - Intégration du Quarter Intent Q3 2026 : Activer le triptyque MORTY (12WY = PARA = DEAL) sur Life-OS-2026.
2. **Goals Command Card (`GoalCommandCard.tsx`)** :
   - Suivi hebdomadaire interactif W1 à W12 avec barres de progression néon/émeraude.
   - Intégration des 7 objectifs historiques canoniques.
3. **Tactics & Execution Bar (`MeasurementBar.tsx`)** :
   - Score d'exécution déterministe (pourcentage d'actions critiques complétées par semaine).
   - Séparation stricte entre Lead Indicators (actions maîtrisables) et Lag Indicators (résultats observés).
4. **TimeBlocks & Strategic Cycles** :
   - Blocs stratégiques de 3h sanctuarisés sans interruption.

---

## 3. Invariants de Compilation & Definition of Done (DoD)
- **Typage TypeScript Strict** : `npm run lint` (`tsc --noEmit`) = 0 erreur.
- **Build de Production Réussi** : `npm run build` (`vite build`) validé à 100%.
- **Tolérance Zéro Régression** : Les applications annexes (Ikigai, Life Wheel, PARA, Agent Portal) restent 100% opérationnelles.
- **Port d'Écoute** : Port 4444 stable (`http://127.0.0.1:4444/`).
