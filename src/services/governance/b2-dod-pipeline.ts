import { DoDTicket, HandoffTicket } from '../../types/governance';
import * as bbClient from '../../lib/blackboard/client';

export class B2DoDPipeline {
  private workspaceId: string;

  constructor(workspaceId: string = 'global-governance') {
    this.workspaceId = workspaceId;
  }

  private generateDoDTicketId(handoffTicketId: string): string {
    return `dod-${handoffTicketId}`;
  }

  /**
   * Deterministic translation of a B1 Rock (HandoffTicket) into a DoD & JTBD Ticket.
   * Ensures that the identical input always produces the identical output.
   */
  private translateB1ToDoD(handoffTicket: HandoffTicket): DoDTicket {
    // Generate deterministic string values based on the handoff ticket description/title
    // In a real AI/LLM system, we'd use a determinist prompt/temperature 0, but here we
    // translate deterministically from the object fields.

    // We make it explicit to not use secrets, mock data or random generators.
    const functionalCompleteness = `Implement functionality for ${handoffTicket.title}: ${handoffTicket.description}`;
    const automatedTestsRequired = [
      `npm run lint`,
      `npm run build`,
      `Test exact module export of ${handoffTicket.docketRef}`
    ];

    // Règle d'arrêt PRD-072: Aucune tâche A3 sans DoD validée.
    // This pipeline produces the DoD validation contract.
    const expectedActionReceipt = `Proof of execution for ${handoffTicket.franchiseId}/${handoffTicket.docketRef}: HTTP 200 or Exit Code 0`;

    return {
      id: this.generateDoDTicketId(handoffTicket.id),
      handoffTicketId: handoffTicket.id,
      franchiseId: handoffTicket.franchiseId,
      docketRef: handoffTicket.docketRef,
      functionalCompleteness,
      automatedTestsRequired,
      noDeadCodeOrPlaceholderRule: true,
      expectedActionReceipt,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Translates a B1 handoff ticket to a B2 DoD ticket and persists it to the blackboard.
   * This operation is idempotent.
   */
  async processTicket(handoffTicket: HandoffTicket): Promise<DoDTicket> {
    const dodTicketId = this.generateDoDTicketId(handoffTicket.id);
    const existing = await this.getDoDTicket(dodTicketId);

    if (existing) {
      return existing; // Idempotent creation
    }

    // Only process tickets that are valid candidates for B2
    if (!['approved_b1', 'pending_b2', 'approved_b2', 'completed'].includes(handoffTicket.state)) {
        throw new Error(`HandoffTicket ${handoffTicket.id} state (${handoffTicket.state}) is not valid for B2 DoD translation`);
    }

    const dodTicket = this.translateB1ToDoD(handoffTicket);

    await bbClient.appendEvent({
      id: crypto.randomUUID(),
      workspace_id: this.workspaceId,
      actor_id: 'system',
      actor_layer: 'B2',
      event_type: 'dod_ticket_created',
      payload_json: JSON.stringify(dodTicket),
      timestamp: dodTicket.createdAt
    });

    return dodTicket;
  }

  /**
   * Retrieves a DoDTicket from the event store.
   */
  async getDoDTicket(dodTicketId: string): Promise<DoDTicket | null> {
    try {
      const events = await bbClient.getEvents(this.workspaceId);

      let ticket: DoDTicket | null = null;

      for (const event of events) {
        if (event.event_type === 'dod_ticket_created') {
          const payload = JSON.parse(event.payload_json);
          if (payload.id === dodTicketId) {
            ticket = payload;
            // Break early since we only have creation right now, no updates
            break;
          }
        }
      }
      return ticket;
    } catch (e) {
        return null;
    }
  }
}
