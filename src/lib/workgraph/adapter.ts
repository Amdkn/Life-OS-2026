export interface WorkGraphReceipt {
  correlation_id: string;
  status: 'SCHEDULED' | 'CLAIMED' | 'EXECUTING' | 'EFFECT_OBSERVED' | 'UNKNOWN' | 'FAILED';
  effect_evidence?: any;
  error?: string;
  timestamp: number;
}

export interface WorkGraphAdapter {
  submitReceipt(receipt: WorkGraphReceipt): Promise<void>;
}

export class LocalWorkGraphAdapter implements WorkGraphAdapter {
  async submitReceipt(receipt: WorkGraphReceipt): Promise<void> {
    // In M4, we just log to simulate the external boundary until the true integration is merged.
    // This provides the executable boundary.
    console.log('[WorkGraph] receipt submitted:', receipt);
  }
}
