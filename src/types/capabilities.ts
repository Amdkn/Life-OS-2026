export interface CapabilityRequest {
  id: string;
  capability:
    | 'calendar.block.create'
    | 'task.create'
    | 'drive.area.ensure'
    | 'sheet.muse.update'
    | 'document.development.append';
  payload: Record<string, any>;
  correlation_id: string;
  source: string;
  requested_at: string;
}

export interface EffectReceipt {
  id: string;
  request_id: string;
  correlation_id: string;
  status: 'SUCCESS' | 'FAILED' | 'UNKNOWN';
  adapter: string;
  external_id?: string;
  readback?: Record<string, any>;
  error?: string;
  completed_at: string;
}
