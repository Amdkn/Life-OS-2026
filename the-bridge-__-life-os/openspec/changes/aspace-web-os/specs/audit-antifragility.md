# Spec: System Audit & Antifragility (Phase 7)

## Vision
Pour empêcher toute défaillance silencieuse (comme l'erreur de module export default vs named import qui produit une page blanche), le système doit être **antifragile**. Il doit capturer l'entropie, l'isoler, et prévenir l'utilisateur sans s'effondrer.

## User Stories

### S-AUDIT-01: React Error Boundaries (Fail-safe Shell)
**As** Amadeus, **I want** the Shell to elegantly catch any React render errors or module import failures within an App, **so that** the entire OS doesn't crash to a white page.
- **Acceptance**: Implement a global `ErrorBoundary` component wrapping the `Desktop` canvas and individual `WindowFrame` components. If an app crashes, it displays a glassmorphic "Crash Terminal" UI detailing the error stack, while keeping the OS Shell (TopBar, Dock) functional.
- **TVR**: ✅T (React ComponentDidCatch) ✅V (High - vital) ✅R (High - prevents total failure)

### S-AUDIT-02: App Registry Sanity Checks
**As** an Architect, **I want** the App Registry to validate module imports dynamically, **so that** a syntax or export mismatch is caught during boot.
- **Acceptance**: Update `app-registry.ts` to try/catch the resolving of App components. If an `undefined` component is registered (due to import mismatch), mark the app as `status: 'corrupted'` and visualy disable its icon in the Dock with a ⚠️ badge.
- **TVR**: ✅T (Dynamic import checks) ✅V (Medium) ✅R (High)

### S-AUDIT-03: Data Isolation Verification (LD01-LD08)
**As** Amadeus, **I want** a diagnostic script to verify that my Life Domains never cross-contaminate their databases, **so that** my E-Myth architecture remains pure.
- **Acceptance**: Create a `verifyIsolation()` util in the Command Center Dashboard. It scans `ld01` to `ld08` IndexedDB instances and checks for prohibited foreign keys. Result displayed in the Fleet Status.
- **TVR**: ✅T (IndexedDB scanning) ✅V (Medium) ✅R (High)

### S-AUDIT-04: Veto E2E Lock Test
**As** Beth (A1), **I want** automated assurance that my Veto Toggle physically prevents any DB writes from A3 frameworks, **so that** I maintain absolute control.
- **Acceptance**: Implement a middleware/proxy in `idb.ts` that automatically throws an "OVERRIDE DENIED: Veto is Active" error if a `.put()` or `.add()` is attempted while `shell.store` has `vetoEngaged === true`.
- **TVR**: ✅T (IndexedDB Wrapper logic) ✅V (High) ✅R (Absolute)

### S-AUDIT-05: Automating Gemini CLI (The Spark)
**As** GravityClaw, **I want** my A3 execution counterparts (Gemini CLI) to be triggerable directly from the terminal via programmatic commands, **so that** the spec-to-code pipeline is fully autonomous.
- **Acceptance**: Create a terminal script (e.g., `npm run execute:phase7`) that launches Gemini CLI with a predefined prompt instructing it to read Phase 7 specs and implement them without human intervention.
- **TVR**: ✅T (CLI Arguments) ✅V (High - enables autonomy) ✅R (Medium)
