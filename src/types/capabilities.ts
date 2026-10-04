export interface CapabilityRequest {
  id: string;
  factory: string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface EffectReceipt {
  id: string;
  requestId: string;
  status: 'SUCCESS' | 'FAILURE' | 'UNKNOWN' | 'AUTH_REQUIRED';
  adapter: string;
  evidence?: unknown;
  error?: string;
  timestamp: string;
}
