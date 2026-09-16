import { HandoffTicket, HandoffState, GovernanceAlert } from '../../types/governance';
import { FranchiseId } from '../../types/franchise';
import * as bbClient from '../../lib/blackboard/client';

export class B1HandoffQueue {
  private workspaceId: string;

  constructor(workspaceId: string = 'global-governance') {
    this.workspaceId = workspaceId;
  }

  private generateTicketId(franchiseId: FranchiseId, docketRef: string): string {
    return `${franchiseId}-${docketRef}`;
  }

  async createTicket(
    franchiseId: FranchiseId,
    docketRef: string,
    title: string,
    description: string
  ): Promise<HandoffTicket> {
    const ticketId = this.generateTicketId(franchiseId, docketRef);
    const existing = await this.getTicket(ticketId);

    if (existing) {
      return existing; // Idempotent creation
    }

    const ticket: HandoffTicket = {
      id: ticketId,
      franchiseId,
      docketRef,
      state: 'draft',
      title,
      description,
      b2DoDValidated: false,
      driftAlerts: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await bbClient.appendEvent({
      id: crypto.randomUUID(),
      workspace_id: this.workspaceId,
      actor_id: 'system',
      actor_layer: 'B1',
      event_type: 'handoff_ticket_created',
      payload_json: JSON.stringify(ticket),
      timestamp: Date.now()
    });

    return ticket;
  }

  async getTicket(ticketId: string): Promise<HandoffTicket | null> {
    try {
      const events = await bbClient.getEvents(this.workspaceId);

      let ticket: HandoffTicket | null = null;

      for (const event of events) {
        if (event.event_type.startsWith('handoff_ticket_')) {
          const payload = JSON.parse(event.payload_json);
          // For handoff_ticket_alert, the payload id is the alert id, the ticket id is payload.ticketId
          const isTargetTicket = event.event_type === 'handoff_ticket_alert' ? payload.ticketId === ticketId : payload.id === ticketId;

          if (isTargetTicket) {
            // Apply event mutation
            if (event.event_type === 'handoff_ticket_created') {
              ticket = payload;
            } else if (ticket) {
               if (event.event_type === 'handoff_ticket_updated') {
                 ticket = { ...ticket, ...payload, updatedAt: event.timestamp };
               } else if (event.event_type === 'handoff_ticket_alert') {
                 ticket.driftAlerts.push(payload.message);
                 ticket.updatedAt = event.timestamp;
               }
            }
          }
        }
      }
      return ticket;
    } catch (e) {
        // If offline/error, return null for now. In real app, we'd have a local cache sync.
        return null;
    }
  }

  async updateTicketState(ticketId: string, newState: HandoffState, actorLayer: string): Promise<HandoffTicket> {
    const ticket = await this.getTicket(ticketId);
    if (!ticket) {
        throw new Error(`Ticket not found: ${ticketId}`);
    }

    const payload = { id: ticketId, state: newState };
    await bbClient.appendEvent({
        id: crypto.randomUUID(),
        workspace_id: this.workspaceId,
        actor_id: 'system',
        actor_layer: actorLayer,
        event_type: 'handoff_ticket_updated',
        payload_json: JSON.stringify(payload),
        timestamp: Date.now()
    });

    return { ...ticket, state: newState, updatedAt: Date.now() };
  }

  async validateB2DoD(ticketId: string): Promise<HandoffTicket> {
      const ticket = await this.getTicket(ticketId);
      if (!ticket) {
          throw new Error(`Ticket not found: ${ticketId}`);
      }

      if (ticket.state !== 'approved_b1' && ticket.state !== 'pending_b2' && ticket.state !== 'approved_b2') {
         throw new Error(`Ticket ${ticketId} is not in a valid state for B2 DoD validation`);
      }

      const payload = { id: ticketId, b2DoDValidated: true, state: 'approved_b2' };
      await bbClient.appendEvent({
          id: crypto.randomUUID(),
          workspace_id: this.workspaceId,
          actor_id: 'system',
          actor_layer: 'B2',
          event_type: 'handoff_ticket_updated',
          payload_json: JSON.stringify(payload),
          timestamp: Date.now()
      });

      return { ...ticket, b2DoDValidated: true, state: 'approved_b2', updatedAt: Date.now() };
  }

  async alertDirectionDrift(ticketId: string, message: string): Promise<void> {
    const alert: GovernanceAlert = {
        id: crypto.randomUUID(),
        ticketId,
        message,
        timestamp: Date.now(),
        recipient: 'CEO'
    };

    await bbClient.appendEvent({
        id: crypto.randomUUID(),
        workspace_id: this.workspaceId,
        actor_id: 'system',
        actor_layer: 'B1', // Alerted by B1 or B2
        event_type: 'handoff_ticket_alert',
        payload_json: JSON.stringify(alert),
        timestamp: alert.timestamp
    });
  }

  // Blocking Rules

  async checkB2Authorization(franchiseId: FranchiseId, docketRef: string): Promise<boolean> {
      const ticketId = this.generateTicketId(franchiseId, docketRef);
      const ticket = await this.getTicket(ticketId);

      if (!ticket) return false;

      // Rule: Aucun travail B2 sans ticket dans la file de transmission B1.
      // Assuming B2 can work if ticket exists and is approved by B1 or already at B2.
      return ['approved_b1', 'pending_b2', 'approved_b2', 'completed'].includes(ticket.state);
  }

  async checkA3B3Authorization(franchiseId: FranchiseId, docketRef: string): Promise<boolean> {
      const ticketId = this.generateTicketId(franchiseId, docketRef);
      const ticket = await this.getTicket(ticketId);

      if (!ticket) return false;

      // Rule: Aucun travail A3/B3 sans DoD validée par B2.
      return ticket.b2DoDValidated === true;
  }
}
