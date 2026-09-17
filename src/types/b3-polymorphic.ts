export type B3IncarnationType =
  | 'skill'
  | 'agent'
  | 'hook'
  | 'cron'
  | 'mcp'
  | 'plugin'
  | 'cli'
  | 'api'
  | 'composite';

export type IntelligenceLevel =
  | 'deterministic_code'
  | 'rule_based'
  | 'light_llm'
  | 'deep_reasoning';

export type DeterminismLevel =
  | 'strict_atomic'
  | 'gated_validation'
  | 'probabilistic_creative';

export interface B3WorkerDescriptor {
  incarnation: B3IncarnationType;
  capabilities: string[];
  tokenCost: number | null; // null if not applicable (e.g. deterministic script)
  latency: 'low' | 'medium' | 'high';
  authorizations: string[];
  executionVectors: string[];
  assembly?: B3CompositeAssembly;
}

export interface B3CompositeAssembly {
  primary: B3IncarnationType;
  supervisor: B3IncarnationType;
  description: string;
}

export interface B3TaskProfile {
  id: string;
  description: string;
  intelligenceLevel: IntelligenceLevel;
  determinismLevel: DeterminismLevel;
  requiredCapabilities: string[];
}
