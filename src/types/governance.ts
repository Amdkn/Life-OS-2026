import type { FranchiseId } from './franchise';

export type HandoffState =
  | 'draft'
  | 'pending_b1'
  | 'approved_b1'
  | 'pending_b2'
  | 'approved_b2'
  | 'rejected'
  | 'completed';

export interface HandoffTicket {
  id: string; // Idempotent key: `${franchiseId}-${docketRef}`
  franchiseId: FranchiseId;
  docketRef: string;
  state: HandoffState;
  title: string;
  description: string;
  b2DoDValidated: boolean;
  driftAlerts: string[];
  createdAt: number;
  updatedAt: number;
}

export interface GovernanceAlert {
  id: string;
  ticketId: string;
  message: string;
  timestamp: number;
  recipient: 'CEO';
}
