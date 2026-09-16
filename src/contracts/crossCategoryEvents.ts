/**
 * PRD-016: Contrats Inter-Catégories
 * Standardized system events across categories (A1/A2, 12WY, etc.)
 */

export type ErrorType = 'UNKNOWN_VERSION' | 'INVALID_PAYLOAD' | 'FALSIFIED_TENANT' | 'BLOCKED_CONTRACT' | 'DUPLICATE_WRITER';

export class ContractError extends Error {
  constructor(public type: ErrorType, message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export interface SystemEvent<T = any> {
  schemaVersion: number;
  eventId: string;
  correlationId: string;
  causationId?: string;
  occurredAt: string; // UTC ISO-8601
  aggregateId: string;
  aggregateVersion: number;
  type: string;
  payload: T;
}

export interface ContractDefinition<T = any> {
  producer: string;
  consumer: string;
  schemaVersion: number;
  validatePayload: (payload: any) => payload is T;
  handler: (event: SystemEvent<T>) => Promise<void>;
  authorizedScopes: string[];
}

export class ContractRegistry {
  private contracts = new Map<string, ContractDefinition>();

  register(eventType: string, def: ContractDefinition) {
    this.contracts.set(eventType, def);
  }

  get(eventType: string): ContractDefinition | undefined {
    return this.contracts.get(eventType);
  }
}

export class EventDispatcher {
  // Simulates an idempotency store (would be a DB or persistent store in reality)
  private processedEventIds = new Set<string>();

  constructor(private registry: ContractRegistry) {}

  async dispatch(event: SystemEvent, actorContext: { service: string, scope: string }) {
    // Check Idempotency
    if (this.processedEventIds.has(event.eventId)) {
      return; // "un seul effet persistant"
    }

    const contract = this.registry.get(event.type);
    if (!contract) {
      throw new ContractError('BLOCKED_CONTRACT', `No contract registered for event type ${event.type}`);
    }

    // Version Check
    if (event.schemaVersion > contract.schemaVersion) {
      throw new ContractError('UNKNOWN_VERSION', `Version ${event.schemaVersion} is unknown to consumer at version ${contract.schemaVersion}`);
    } else if (event.schemaVersion < contract.schemaVersion) {
      // Incompatible older consumer
      throw new ContractError('BLOCKED_CONTRACT', `Consumer requires version ${contract.schemaVersion}, received ${event.schemaVersion}`);
    }

    // Payload Validation
    if (!contract.validatePayload(event.payload)) {
      throw new ContractError('INVALID_PAYLOAD', `Payload failed validation for event type ${event.type}`);
    }

    // Tenant / Scope falsification validation
    // The PRD mandates: "acteur/scope autorisés par service et non crus depuis payload"
    if (!contract.authorizedScopes.includes(actorContext.scope)) {
      throw new ContractError('FALSIFIED_TENANT', `Scope ${actorContext.scope} is not authorized for this contract`);
    }

    // Execute the effect
    await contract.handler(event);

    // Record idempotency AFTER successful execution
    this.processedEventIds.add(event.eventId);
  }
}
