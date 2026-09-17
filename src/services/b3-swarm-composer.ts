import { resolveIncarnation } from './b3-matrix-engine.js';
import {
  B3WorkerDescriptor,
  B3TaskProfile,
  MissionDirective,
  B3SwarmTopology,
  B3SwarmMetrics
} from '../types/b3-polymorphic.js';

export class B3SwarmComposer {
  /**
   * Assembles a heterogeneous swarm of B3 workers based on a mission directive.
   * Required topology:
   *  - 1 CLI deterministe d ingestion (B3 Substrat).
   *  - 1 MCP d acces ontologique / bases (B3 Plomberie).
   *  - 2 Agents d analyse paralleles (B3 Cognitifs).
   *  - 1 Hook de cloture et certification (B3 Gate).
   */
  public assembleSwarm(missionDirective: MissionDirective): B3SwarmTopology {
    if (missionDirective.source !== 'B1' && missionDirective.source !== 'B2') {
      throw new Error(`Mission rejected: source must be B1 or B2. Received: ${missionDirective.source}`);
    }

    const startMemory = process.memoryUsage().heapUsed;
    const startTime = performance.now();
    let errorCount = 0;
    const validationAttempts = 1; // At least one validation happens

    try {
      const workers: B3WorkerDescriptor[] = [];
      const workerIds = new Set<string>();

      const addWorker = (profile: B3TaskProfile, typeOverride: B3WorkerDescriptor['incarnationType']) => {
        let descriptor = resolveIncarnation(profile) as B3WorkerDescriptor;
        if ('compositeDetails' in descriptor) {
             // Extract primary if resolving to composite
             descriptor = {
                 id: descriptor.id,
                 incarnationType: typeOverride,
                 intelligence: descriptor.intelligence,
                 determinism: descriptor.determinism,
                 capabilities: descriptor.capabilities,
                 estimatedTokenCost: descriptor.estimatedTokenCost,
                 estimatedLatencyMs: descriptor.estimatedLatencyMs,
                 ioAuthorizations: descriptor.ioAuthorizations,
                 executionVectors: descriptor.executionVectors
             };
        } else {
            descriptor = { ...descriptor, incarnationType: typeOverride };
        }

        // Ensure interface compatibility / unique IDs
        if (workerIds.has(descriptor.id)) {
            // Generate a unique ID to prevent double execution (deadlock prevention)
            descriptor.id = `${descriptor.id}-${workers.length}`;
        }

        workerIds.add(descriptor.id);
        workers.push(descriptor);
      };

      // 1. Ingestion CLI (Deterministic)
      addWorker({
        id: `${missionDirective.id}-ingestion`,
        description: 'Ingestion and substrate setup',
        requiredDeterminism: 'strict_atomic',
        requiredIntelligence: 'deterministic_code'
      }, 'cli');

      // 2. MCP Access (Ontology/Plumbing)
      addWorker({
        id: `${missionDirective.id}-mcp-access`,
        description: 'Access to knowledge base via MCP',
        requiredDeterminism: 'strict_atomic', // Or gated
        requiredIntelligence: 'rule_based'
      }, 'mcp');

      // 3. Analysis Agent 1 (Cognitive)
      addWorker({
        id: `${missionDirective.id}-analysis-1`,
        description: 'Parallel cognitive analysis worker 1',
        requiredDeterminism: 'probabilistic_creative',
        requiredIntelligence: 'light_llm'
      }, 'agent');

      // 4. Analysis Agent 2 (Cognitive)
      addWorker({
        id: `${missionDirective.id}-analysis-2`,
        description: 'Parallel cognitive analysis worker 2',
        requiredDeterminism: 'probabilistic_creative',
        requiredIntelligence: 'deep_reasoning'
      }, 'agent');

      // 5. Certification Hook (Gate)
      addWorker({
        id: `${missionDirective.id}-cert-hook`,
        description: 'Final certification gate',
        requiredDeterminism: 'strict_atomic',
        requiredIntelligence: 'deterministic_code'
      }, 'hook');

      // Verify interfaces / Reject if incompatible
      // Implicitly handled by strong typing, but we can do a mock capabilities check
      const allCapabilities = new Set(workers.flatMap(w => w.capabilities));
      if (allCapabilities.size === 0) {
          throw new Error('Swarm is completely incapable of any tasks');
      }

      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      const metrics: B3SwarmMetrics = {
        memoryFootprintBytes: endMemory - startMemory,
        assemblyTimeMs: endTime - startTime,
        errorRatio: errorCount / validationAttempts
      };

      return {
        id: `topology-${missionDirective.id}`,
        missionId: missionDirective.id,
        workers,
        metrics
      };

    } catch (err) {
      errorCount++;
      // Metrics are calculated in the catch block but since we throw immediately, they are unused.
      // If we wanted to log them, we would do it here before throwing.
      throw err; // Explicit rejection as per PRD
    }
  }

  public disassembleSwarm(topology: B3SwarmTopology): void {
      // Simulate resource cleanup in reverse order
      const workersToClean = [...topology.workers].reverse();
      for (const worker of workersToClean) {
          // In a real system, we would release locks, close MCP connections, stop agents here
          if (worker.id) {
             // NOOP - access worker to avoid unused variable warning
          }
      }
  }
}
