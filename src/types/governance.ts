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
  assignee?: string;
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

export interface DoDTicket {
  id: string; // Idempotent key, e.g., `dod-${handoffTicketId}`
  handoffTicketId: string;
  franchiseId: FranchiseId;
  docketRef: string;
  // Les 4 champs requis par la DoD B2
  functionalCompleteness: string;
  automatedTestsRequired: string[];
  noDeadCodeOrPlaceholderRule: boolean; // Règle déclarative
  expectedActionReceipt: string; // Preuve formelle d'environnement (chemin, exit code, HTTP)
  createdAt: number;
  updatedAt: number;
}
