export interface CapabilityRequest<T = any> {
    id: string;
    capability: string;
    payload: T;
    requestedAt: number;
    source: string;
}

export interface EffectReceipt<T = any> {
    id: string;
    requestId: string;
    status: 'SUCCESS' | 'FAILED' | 'UNKNOWN';
    effect: T;
    completedAt: number;
    error?: string;
}

export interface GwsEffect {
    service: 'gmail' | 'calendar' | 'drive' | 'docs';
    action: string;
    resourceId: string;
    url?: string;
}
