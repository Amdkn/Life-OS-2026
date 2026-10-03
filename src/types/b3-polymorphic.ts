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
  id: string;
  incarnation: B3IncarnationType;
  intelligence: IntelligenceLevel;
  determinism: DeterminismLevel;
  capabilities: string[];
  tokenCost: number | null; // null if not applicable (e.g. deterministic script)
  latency: 'low' | 'medium' | 'high';
  authorizations: string[];
  executionVectors: string[];
  assembly?: B3CompositeAssembly;
  status?: 'Idle' | 'Running' | 'Gated' | 'Complete'; // Added to fix UI contract drift
  lastLogs?: string;                                // Added to fix UI contract drift
  measuredComputeTime?: number;                     // Added to fix UI contract drift
  measuredBudgetTokens?: number;                    // Added to fix UI contract drift
  triggers?: string[];                              // Added to fix UI contract drift
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

export interface MissionDirective {
  id: string;
  source: 'B1' | 'B2';
  missionProfile: B3TaskProfile;
}

export interface B3SwarmMetrics {
  memoryFootprintBytes: number;
  assemblyTimeMs: number;
  errorRatio?: number;
}

export interface B3SwarmTopology {
  id: string;
  missionId: string;
  workers: B3WorkerDescriptor[];
  metrics: B3SwarmMetrics;
}
