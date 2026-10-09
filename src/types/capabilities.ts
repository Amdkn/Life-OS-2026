export interface CapabilityRequest {
  id: string;
  // Canonical discriminator (Life OS). Optional: producers using the typed
  // `capability` union below may omit it; RiverBusinessAdapter falls back
  // to 'UNKNOWN' when absent. Clara follow-up: pick ONE discriminator.
  type?: string;
  capability?:
    | 'calendar.block.create'
    | 'task.create'
    | 'drive.area.ensure'
    | 'sheet.muse.update'
    | 'document.development.append';
  payload: Record<string, any>;
  correlation_id: string;
  source: string;
  requested_at?: string;
}

export interface EffectReceipt {
  id?: string;
  request_id: string;
  correlation_id?: string;
  status: 'SUCCESS' | 'FAILED' | 'UNKNOWN';
  adapter: string;
  external_id?: string;
  evidence?: any;
  readback?: Record<string, any>;
  error?: string;
  timestamp: number;
  completed_at?: string;
}