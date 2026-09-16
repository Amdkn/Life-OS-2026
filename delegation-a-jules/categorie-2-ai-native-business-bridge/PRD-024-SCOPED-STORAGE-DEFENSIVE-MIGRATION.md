# PRD-024 — Scoped Storage & Moteur de Persistance Défensive


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-023 (assistant.store persiste sous scope) ; PRD-001 (idb.ts reste la couche IndexedDB ; le scoping s'applique aux clés, pas un second moteur) ; PRD-011 (un scope de blackboard multi-profils s'appuie sur le service, pas sur des clés localStorage).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/components/ViewportGuard.tsx` (vérifié présent) ; `LAYOUT_KEY = 'life-os-layout-v1'` : A SOURCER dans le code réel avant d'envelopper (clé à localiser).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** charge corrompue injectée => réinitialisation de la vue par défaut sans écran blanc au reload ; isolation stricte des scopes ; enveloppe versionnée décodée et assainie au boot.

**Critères d'acceptation négatifs (doivent rester vrais) :** **« vérifiée par tests Jest/Vitest » est invalide au 2026-09-12 : aucun runner (jest, vitest) n'est déclaré dans package.json.** Soit ajouter vitest comme travail séparé et le déclarer, soit requalifier en vérification manuelle scriptée + npm run lint/build ; ne jamais présenter ces commandes comme des tests ; pas de réinitialisation silencieuse qui détruit des données utilisateur sans trace.

**Sécurité / isolation / idempotence / persistance :** réinitialisation défensive bornée à la zone corrompue, journalisée, jamais l'ensemble des données ; isolation multi-profils (Life OS perso vs Business OS pro) par préfixe de clé ; aucune migration destructrice sans sauvegarde préalable.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** enveloppement réversible : revert = les clés brutes redeviennent lisibles (conserver la compatibilité de lecture au premier boot post-rollback).

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
