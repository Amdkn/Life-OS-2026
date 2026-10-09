export interface CapabilityRequest {
  id: string;
  type: string;
  payload: Record<string, any>;
  correlation_id: string;
  source: string;
}

export interface EffectReceipt {
  request_id: string;
  status: 'SUCCESS' | 'FAILED' | 'UNKNOWN';
  external_id?: string;
  evidence?: any;
  adapter: string;
  timestamp: number;
}
