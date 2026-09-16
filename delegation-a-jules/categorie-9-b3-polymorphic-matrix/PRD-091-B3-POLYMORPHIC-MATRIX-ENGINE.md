# PRD-091: B3 Polymorphic Matrix Engine & Dual-Axis Topology

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). **PRD propriétaire de la matrice des rôles B3** — tous les autres PRD de la catégorie (et cat 6 pour les A3) importent ses types, ils ne les recréent pas.

- **Dépendances PRD réelles** : socle de la catégorie — aucune dépendance amont interne. Dépendants : PRD-092, PRD-093, PRD-094, PRD-095 (cat 9). Relation cat 6 : PRD-061 est propriétaire de la compilation des compétences ; PRD-091 définit le type `B3IncarnationType` qui les référence, sans redéfinir leur contenu. Ne pas lancer les dépendants avant l'intégration de PRD-091.
- **Typos corrompues réparées (mesuré dans le texte initial)** : «Fonction 
esolveIncarnation» → `resolveIncarnation` ; «pm run build» → `npm run build` ; «px tsc --noEmit» → `npx tsc --noEmit`.
- **Write_scope (chemins concrets)** : `src/types/b3-polymorphic.ts` (création), `src/services/b3-matrix-engine.ts` (création). Fichier de spec `src/services/__tests__/b3-matrix-engine.test.ts` (création) — **constat mesuré** : package.json ne contient aucun script `test` ni runner (vitest/jest absents des deps). Ne jamais écrire que `npm test` existe ; soit ajouter vitest comme dépendance explicite (dette à assumer), soit la validation tient à `npm run lint` + `npm run build`.
- **Critères positifs** : les 4 types déclarés (B3IncarnationType, IntelligenceLevel, DeterminismLevel, B3WorkerDescriptor + B3CompositeAssembly) exactement comme spécifiés ; `resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor` est une fonction **pure et déterministe** : profil identique → incarnation identique ; tache 100% déterministe → jamais d'incarnation LLM (Hook ou CLI) ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun appel LLM réel dans la fonction de résolution (elle choisit, elle n'exécute pas) ; pas de coût token inventé sans source (les chiffres de coût restent des champs remplis par l'opérateur) ; pas de recréation des skills de PRD-061 ni des identités de PRD-041 ; pas de secret dans les descripteurs.
- **Sécurité & isolation** : B3WorkerDescriptor porte les autorisations I/O déclaratives ; l'application effective des autorisations relève du substrat PRD-092 (hooks) ; pas d'exécution réseau dans la résolution.
- **Idempotence & persistance** : la résolution est sans effet de bord ; le registre des descripteurs est déclaratif ; persistance des décisions d'incarnation (audit) côté blackboard SQLite service (schéma PRD-011, consommation PRD-052) — pas de substitution par IndexedDB navigateur par décret.
- **Reprise / rollback non destructif** : 2-3 fichiers exclusivement nouveaux ; rollback = retrait sans impact sur les apps existantes.

## Objectif
Concevoir et implementer le moteur central polymorphe B3, capable d instancier ou d adapter dynamiquement un agent B3 selon deux axes fondamentaux : le Degre d Intelligence Requis (Non-LLM -> Heuristique -> LLM Local -> Frontier Reasoning) et le Degre de Determinisme Requis (0% deterministe -> 100% atomique/verifie).

## Specifications
- Creer src/types/b3-polymorphic.ts :
  - B3IncarnationType: 'skill' | 'agent' | 'hook' | 'cron' | 'mcp' | 'plugin' | 'cli' | 'api' | 'composite'.
  - IntelligenceLevel: 'deterministic_code' | 'rule_based' | 'light_llm' | 'deep_reasoning'.
  - DeterminismLevel: 'strict_atomic' | 'gated_validation' | 'probabilistic_creative'.
  - B3WorkerDescriptor: Matrice decrivant les capacites, cout token, latence, autorisations I/O et vecteurs d execution.
  - B3CompositeAssembly: Combinaison fluide de plusieurs incarnations pour une meme mission (ex: CLI + Hook 5D + Skill + LLM Agent).
- Implementer src/services/b3-matrix-engine.ts :
  - Fonction resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor.
  - Resolution deterministe : si la tache est 100% deterministe (ex: calcul TVA, parsing JSON, verif de hashes), interdiction formelle d appeler un LLM ; resolution en Hook ou CLI script local.
  - Resolution hybride : si la tache necessite synthese + validation, instanciation d un couple Composite (Agent LLM supervise par Gate Hook de validation).
- Spec de test :
  - Créer ET exécuter les tests de résolution avec un runner explicitement ajouté/configuré dans le scope réservé. La présence du fichier test et lint/build seuls ne suffisent pas. Cas obligatoire : tâche déterministe jamais routée vers LLM ; profil invalide rejeté ; même profil = même résultat.
  - Valider npm run lint (tsc --noEmit) et npm run build.