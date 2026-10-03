export interface CapabilityRequest {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface EffectReceipt {
  id: string;
  request_id: string;
  external_id: string;
  correlation_id: string;
  evidence: Record<string, unknown>;
  replay_semantics: 'idempotent' | 'once' | 'unsafe';
  status: 'success' | 'failure' | 'unknown';
  created_at: string;
}
