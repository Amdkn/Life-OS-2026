import { B3TaskProfile, B3WorkerDescriptor, B3CompositeAssembly } from '../types/b3-polymorphic';

export function resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor | (B3WorkerDescriptor & { compositeDetails: B3CompositeAssembly }) {
  if (!taskProfile || !taskProfile.id) {
    throw new Error('Invalid task profile: missing id');
  }

  // 100% deterministic routing
  if (taskProfile.requiredDeterminism === 'strict_atomic' || taskProfile.isStrictlyDeterministic) {
    return {
      id: `${taskProfile.id}-deterministic-worker`,
      incarnationType: 'cli', // or 'hook', but strict atomic logic defaults to CLI for this example.  Could also be a 'hook'. Let's use 'cli'.
      intelligence: 'deterministic_code',
      determinism: 'strict_atomic',
      capabilities: ['execute_local_script', 'read_fs_readonly'], // Just example capabilities
      estimatedTokenCost: 0, // Strict rule: 0 for deterministic
      estimatedLatencyMs: 50,
      ioAuthorizations: ['local_fs_read'],
      executionVectors: ['local_shell']
    };
  }

  // Hybrid task routing (synthesis + validation)
  if (taskProfile.requiredDeterminism === 'gated_validation' &&
      (taskProfile.requiredIntelligence === 'light_llm' || taskProfile.requiredIntelligence === 'deep_reasoning')) {

    const primaryAgent: B3WorkerDescriptor = {
      id: `${taskProfile.id}-llm-worker`,
      incarnationType: 'agent',
      intelligence: taskProfile.requiredIntelligence,
      determinism: 'probabilistic_creative',
      capabilities: ['text_generation', 'reasoning'],
      estimatedTokenCost: taskProfile.requiredIntelligence === 'deep_reasoning' ? 5000 : 1000,
      estimatedLatencyMs: taskProfile.requiredIntelligence === 'deep_reasoning' ? 5000 : 1500,
      ioAuthorizations: ['llm_api_access'],
      executionVectors: ['remote_llm']
    };

    const validationGate: B3WorkerDescriptor = {
      id: `${taskProfile.id}-validation-gate`,
      incarnationType: 'hook',
      intelligence: 'rule_based',
      determinism: 'strict_atomic',
      capabilities: ['output_validation', 'schema_check'],
      estimatedTokenCost: 0,
      estimatedLatencyMs: 20,
      ioAuthorizations: ['memory_read'],
      executionVectors: ['local_process']
    };

    const compositeDetails: B3CompositeAssembly = {
      id: `${taskProfile.id}-composite-assembly`,
      primaryIncarnation: primaryAgent,
      secondaryIncarnations: [validationGate],
      assemblyPattern: 'supervisor_worker'
    };

    return {
      id: `${taskProfile.id}-composite-wrapper`,
      incarnationType: 'composite',
      intelligence: taskProfile.requiredIntelligence,
      determinism: 'gated_validation',
      capabilities: ['complex_task_execution', 'validated_output'],
      estimatedTokenCost: primaryAgent.estimatedTokenCost + validationGate.estimatedTokenCost,
      estimatedLatencyMs: primaryAgent.estimatedLatencyMs + validationGate.estimatedLatencyMs,
      ioAuthorizations: [...primaryAgent.ioAuthorizations, ...validationGate.ioAuthorizations],
      executionVectors: [...primaryAgent.executionVectors, ...validationGate.executionVectors],
      compositeDetails
    };
  }

  // Default fallback for probabilistic tasks that aren't specifically gated
  return {
    id: `${taskProfile.id}-default-worker`,
    incarnationType: 'agent',
    intelligence: taskProfile.requiredIntelligence,
    determinism: taskProfile.requiredDeterminism,
    capabilities: ['general_assistance'],
    estimatedTokenCost: 1500,
    estimatedLatencyMs: 2000,
    ioAuthorizations: ['llm_api_access'],
    executionVectors: ['remote_llm']
  };
}
