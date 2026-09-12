# PRD-091: B3 Polymorphic Matrix Engine & Dual-Axis Topology

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
  - Fonction 
esolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor.
  - Resolution deterministe : si la tache est 100% deterministe (ex: calcul TVA, parsing JSON, verif de hashes), interdiction formelle d appeler un LLM ; resolution en Hook ou CLI script local.
  - Resolution hybride : si la tache necessite synthese + validation, instanciation d un couple Composite (Agent LLM supervise par Gate Hook de validation).
- Tests & Validation :
  - Creer src/services/__tests__/b3-matrix-engine.test.ts.
  - Valider 
pm run build et 
px tsc --noEmit.
