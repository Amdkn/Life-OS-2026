/** 
 * App Discovery — V0.10.0 Absolute Apex 
 * This module triggers the registration side-effects of all apps.
 * It MUST be imported at the root level (main.tsx) to avoid circular dependencies in app-registry.
 */

console.log("🧿 [Boot] app-discovery.ts started");

// APEX CORE DISCOVERY: Vite literal macro (MUST be a literal string for the compiler)
// This side-effect eagerly imports all register.ts files in src/apps/
// @ts-ignore - Vite Macro
import.meta.glob('../apps/*/register.ts', { eager: true });

console.info("[Apex Discovery] All apps have been discovered and registered.");
