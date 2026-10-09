import { RyanFactory } from '../ryan/capability-factory.js';
import { RoryEvidenceStore } from '../rory/evidence-store.js';

export class RiverFlowEngine {
  constructor(private evidenceStore: RoryEvidenceStore) {}

  async executeFlow<TInput, TOutput>(
    factory: RyanFactory<TInput, TOutput>,
    input: TInput,
    correlationId: string,
    actorId: string,
    actorLayer: string
  ): Promise<{ status: 'SUCCESS' | 'UNKNOWN' | 'FAILED', output?: TOutput, error?: string }> {
    const harness = factory.buildHarness();
    try {
      const output = await harness(input);
      // Determine status. In a local/bounded canary, if it has a simulated flag,
      // it means it hasn't produced a real effect but simulated it. As per rules, mark it UNKNOWN if we can't get external evidence.
      const status = (output as any)?.simulated ? 'UNKNOWN' : 'SUCCESS';

      await this.evidenceStore.persistReceipt(correlationId, status, { output }, actorId, actorLayer);
      return { status, output };
    } catch (e: any) {
      await this.evidenceStore.persistReceipt(correlationId, 'FAILED', { error: e.message }, actorId, actorLayer);
      return { status: 'FAILED', error: e.message };
    }
  }
}
