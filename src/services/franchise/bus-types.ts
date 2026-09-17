import type { FranchiseId } from '../../types/franchise.js';

export type InnovationType = 'invoice_module' | 'field_checklist' | 'lease_taxation';
export type ProposalStatus = 'proposed' | 'adopted' | 'rejected';

export interface InnovationPayload {
  sourceFranchise: FranchiseId;
  type: InnovationType;
  contentHash: string;
  description: string;
  templateData: Record<string, unknown>; // Never raw client data, only templates
}

export interface AdoptionProposal {
  id: string; // Event ID or unique proposal ID
  targetFranchise: FranchiseId;
  sourceFranchise: FranchiseId;
  innovationType: InnovationType;
  contentHash: string; // Idempotency key
  description: string;
  templateData: Record<string, unknown>;
  status: ProposalStatus;
  createdAt: number;
  resolvedAt?: number;
}
