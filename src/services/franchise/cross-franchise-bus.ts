import { appendEvent, getEvents, BlackboardEvent } from '../../../server/blackboard/repository.js';
import type { FranchiseId } from '../../types/franchise.js';
import type { InnovationPayload, AdoptionProposal, ProposalStatus } from './bus-types.js';

const ALL_FRANCHISES: FranchiseId[] = ['abc_childcare', 'rilcot', 'alikaly_holding', 'marina_cleaning'];
const SYSTEM_ACTOR_ID = 'cross-franchise-bus';
const PROPOSAL_EVENT_TYPE = 'adoption_proposal';
const RESOLUTION_EVENT_TYPE = 'proposal_resolution';

export class CrossFranchiseBus {

  /**
   * Evaluates an innovation and generates adoption proposals for other franchises based on the rules.
   * Rules:
   * - Invoice module (ABC Child Care) -> Marina Cleaning & RILCOT
   * - Field checklists (Marina Cleaning) -> ABC Child Care & RILCOT
   * - Leases/Taxation (Alikaly Bana) -> All other entities
   */
  public async evaluateAndPropose(innovation: InnovationPayload): Promise<AdoptionProposal[]> {
    const targets = this.determineTargets(innovation);
    if (targets.length === 0) return [];

    const existingProposals = this.getAllProposals();
    const newProposals: AdoptionProposal[] = [];

    for (const target of targets) {
      // Idempotency check: same content hash + same target = skip
      const alreadyProposed = existingProposals.some(p =>
        p.contentHash === innovation.contentHash &&
        p.targetFranchise === target
      );

      if (!alreadyProposed) {
        const proposal: AdoptionProposal = {
          id: globalThis.crypto.randomUUID(),
          targetFranchise: target,
          sourceFranchise: innovation.sourceFranchise,
          innovationType: innovation.type,
          contentHash: innovation.contentHash,
          description: innovation.description,
          templateData: innovation.templateData,
          status: 'proposed',
          createdAt: Date.now()
        };

        this.persistProposal(proposal);
        newProposals.push(proposal);
      }
    }

    return newProposals;
  }

  /**
   * Retrieves all proposals directed at a specific franchise.
   */
  public getProposalsForFranchise(franchiseId: FranchiseId): AdoptionProposal[] {
    return this.getAllProposals().filter(p => p.targetFranchise === franchiseId);
  }

  /**
   * Resolves a proposal (adopted or rejected) by a VP.
   */
  public resolveProposal(proposalId: string, resolution: 'adopted' | 'rejected'): AdoptionProposal | null {
    const proposals = this.getAllProposals();
    const proposal = proposals.find(p => p.id === proposalId);

    if (!proposal) return null;
    if (proposal.status !== 'proposed') return proposal; // Already resolved

    const updatedProposal = {
      ...proposal,
      status: resolution,
      resolvedAt: Date.now()
    };

    // Persist resolution as an event
    const event: BlackboardEvent = {
      id: globalThis.crypto.randomUUID(),
      workspace_id: null,
      actor_id: SYSTEM_ACTOR_ID,
      actor_layer: 'franchise_bus',
      event_type: RESOLUTION_EVENT_TYPE,
      payload_json: JSON.stringify({ proposalId, resolution }),
      timestamp: Date.now()
    };
    appendEvent(event);

    return updatedProposal;
  }

  private determineTargets(innovation: InnovationPayload): FranchiseId[] {
    const { sourceFranchise, type } = innovation;

    if (sourceFranchise === 'abc_childcare' && type === 'invoice_module') {
      return ['marina_cleaning', 'rilcot'];
    }

    if (sourceFranchise === 'marina_cleaning' && type === 'field_checklist') {
      return ['abc_childcare', 'rilcot'];
    }

    if (sourceFranchise === 'alikaly_holding' && type === 'lease_taxation') {
      return ALL_FRANCHISES.filter(f => f !== 'alikaly_holding');
    }

    return [];
  }

  private persistProposal(proposal: AdoptionProposal): void {
    const event: BlackboardEvent = {
      id: proposal.id,
      workspace_id: null, // Global or bus-specific workspace
      actor_id: SYSTEM_ACTOR_ID,
      actor_layer: 'franchise_bus',
      event_type: PROPOSAL_EVENT_TYPE,
      payload_json: JSON.stringify(proposal),
      timestamp: proposal.createdAt
    };
    appendEvent(event);
  }

  private getAllProposals(): AdoptionProposal[] {
    try {
      const allEvents = getEvents();

      const proposalEvents = allEvents.filter(e => e.event_type === PROPOSAL_EVENT_TYPE);
      const resolutionEvents = allEvents.filter(e => e.event_type === RESOLUTION_EVENT_TYPE);

      const resolutionMap = new Map<string, { status: ProposalStatus, resolvedAt: number }>();

      for (const res of resolutionEvents) {
        try {
          const payload = JSON.parse(res.payload_json);
          resolutionMap.set(payload.proposalId, {
            status: payload.resolution as ProposalStatus,
            resolvedAt: res.timestamp
          });
        } catch (e) {
          // Skip invalid JSON
        }
      }

      return proposalEvents.map(e => {
        const baseProposal = JSON.parse(e.payload_json) as AdoptionProposal;
        const resolution = resolutionMap.get(baseProposal.id);

        if (resolution) {
          return { ...baseProposal, status: resolution.status, resolvedAt: resolution.resolvedAt };
        }
        return baseProposal;
      });
    } catch (e) {
      // In case we're on the client side, or DB isn't available
      // The bus is strictly server-side, but defensive programming is good.
      return [];
    }
  }
}
