import {
  B3TaskProfile,
  B3WorkerDescriptor,
} from '../types/b3-polymorphic';

/**
 * Pure and deterministic function to resolve the worker incarnation for a given task profile.
 *
 * Rules applied (as per PRD-091):
 * - If task is 100% deterministic (e.g. `determinismLevel === 'strict_atomic'`
 *   or `intelligenceLevel === 'deterministic_code'`), it strictly forbids LLM calls.
 *   It routes to 'hook' (or 'cli' depending on context, we default to 'hook' here).
 * - If task requires synthesis + validation (hybrid), we instantiate a Composite
 *   assembly (Agent LLM supervised by Gate Hook).
 * - Identical profile MUST return an identical descriptor.
 */
export function resolveIncarnation(taskProfile: B3TaskProfile): B3WorkerDescriptor {
  if (!taskProfile || !taskProfile.intelligenceLevel || !taskProfile.determinismLevel) {
    throw new Error("Invalid profile");
  }

  // 1. Check for 100% deterministic tasks
  const isDeterministic =
    taskProfile.determinismLevel === 'strict_atomic' ||
    taskProfile.intelligenceLevel === 'deterministic_code';

  if (isDeterministic) {
    return {
      incarnation: 'hook',
      capabilities: taskProfile.requiredCapabilities || [],
      tokenCost: null,
      latency: 'low',
      authorizations: ['local:fs:read', 'local:fs:write'],
      executionVectors: ['local_process'],
    };
  }

  // 2. Hybrid tasks (requires synthesis + validation)
  const isHybrid =
    taskProfile.determinismLevel === 'gated_validation' ||
    taskProfile.intelligenceLevel === 'deep_reasoning' ||
    taskProfile.intelligenceLevel === 'light_llm';

  if (isHybrid) {
    return {
      incarnation: 'composite',
      capabilities: taskProfile.requiredCapabilities || [],
      tokenCost: 1000,
      latency: 'high',
      authorizations: ['local:network:outbound', 'local:db:read'],
      executionVectors: ['llm_api', 'local_process'],
      assembly: {
        primary: 'agent',
        supervisor: 'hook',
        description: 'Agent LLM supervise par Gate Hook de validation'
      }
    };
  }

  // 3. Fallback for other probabilistic or rule-based cases
  return {
    incarnation: 'skill',
    capabilities: taskProfile.requiredCapabilities || [],
    tokenCost: null,
    latency: 'medium',
    authorizations: [],
    executionVectors: ['local_process']
  };
}
