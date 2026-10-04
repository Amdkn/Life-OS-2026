export interface CapabilityRequest {
  id: string;
  name: string;
  version: string;
  payload: any;
}

export interface EffectReceipt {
  status: 'SUCCESS' | 'FAILURE' | 'UNKNOWN';
  evidence?: any;
  error?: string;
}
