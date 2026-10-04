export type CapabilityDomain = 'calendar' | 'task' | 'drive' | 'sheet' | 'document';
export type CapabilityAction = 'create' | 'update' | 'append' | 'ensure';

export interface CapabilityRequest {
  id: string;
  domain: CapabilityDomain;
  action: CapabilityAction;
  target: string;
  payload: any;
  timestamp: number;
}

export interface EffectReceipt {
  correlation_id: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  evidence?: any;
  error?: string;
  timestamp: number;
}
