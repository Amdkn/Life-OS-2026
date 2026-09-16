export type B3IncarnationType = 'skill' | 'agent' | 'hook' | 'cron' | 'mcp' | 'plugin' | 'cli' | 'api' | 'composite';

export type IntelligenceLevel = 'deterministic_code' | 'rule_based' | 'light_llm' | 'deep_reasoning';

export type DeterminismLevel = 'strict_atomic' | 'gated_validation' | 'probabilistic_creative';

export interface B3WorkerDescriptor {
  id: string;
  incarnationType: B3IncarnationType;
  intelligence: IntelligenceLevel;
  determinism: DeterminismLevel;
  capabilities: string[];
  estimatedTokenCost: number; // 0 for deterministic non-LLM tasks
  estimatedLatencyMs: number;
  ioAuthorizations: string[];
  executionVectors: string[];
}

export interface B3CompositeAssembly {
  id: string;
  primaryIncarnation: B3WorkerDescriptor;
  secondaryIncarnations: B3WorkerDescriptor[];
  assemblyPattern: 'supervisor_worker' | 'pipeline' | 'parallel';
}

export interface B3TaskProfile {
  id: string;
  description: string;
  requiredDeterminism: DeterminismLevel;
  requiredIntelligence: IntelligenceLevel;
  isStrictlyDeterministic?: boolean; // Convenience flag for 100% deterministic tasks
}
