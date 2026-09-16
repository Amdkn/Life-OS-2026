# PRD-023 — AssistantOverlay Multi-Agents & Roster Dynamique


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (pont réactif : les tuiles s'abonnent aux événements blackboard, pas à un second store d'agents) ; PRD-024 (scopes si le roster est persisté par profil).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/hooks/useWindowManager.ts` (vérifié) ; `zustand` v5 en dépendance (useShallow disponible).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** tuiles simultanées sans boucle infinie React (useShallow) ; bascule des bulles réactive ; positionnement libre avec borne anti-débordement d'écran.

**Critères d'acceptation négatifs (doivent rester vrais) :** pas de boucle de rendu infinie ; aucun roster fantôme au-delà de A0 Amadeus / A1 Beth / A1 Morty sans déclaration de source ; pas de télémétrie d'agent fictive ; pas de position persistée hors scope (PRD-024).

**Sécurité / isolation / idempotence / persistance :** positionnement borné au viewport ; le store persisté (si activé) passe par `createScopedStorage` (PRD-024) ; pas de contenu arbitraire exécuté depuis un payload d'agent (XSS : rendu texte, pas dangerouslySetInnerHTML).

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** composants additifs : revert sans impact sur le bureau existant.

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
