export type JobState = "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED" | "BLOCKED_CONTRACT";

export const VALID_JOB_TRANSITIONS: Record<JobState, JobState[]> = {
  PENDING: ["IN_PROGRESS", "FAILED", "BLOCKED_CONTRACT"],
  IN_PROGRESS: ["SUCCESS", "FAILED", "BLOCKED_CONTRACT"],
  SUCCESS: [], // terminal
  FAILED: ["PENDING"], // retry
  BLOCKED_CONTRACT: [] // terminal unless resolved
};

export function isValidTransition(from: JobState, to: JobState): boolean {
  return VALID_JOB_TRANSITIONS[from].includes(to);
}

export interface CrossCategoryEvent<T = any> {
  schemaVersion: number;
  eventId: string;
  correlationId: string;
  causationId: string;
  occurredAt: string; // UTC ISO-8601
  aggregateId: string;
  aggregateVersion: number;
  type: string;
  payload: T;
}

export interface EventContract<T = any> {
  type: string;
  producer: string; // expected actor/scope
  consumer: string;
  supportedVersions: number[];
  validatePayload: (payload: any) => payload is T;
  rejectionPolicy: "BLOCK" | "REJECT_AND_CONTINUE";
}

export interface DispatchContext {
  actor: string;
  scope: string; // The service context attempting to dispatch
}

export interface DispatchResult {
  jobState: JobState;
  effectApplied: boolean;
  isIdempotentReplay?: boolean;
  correlationId?: string;
  reason?: string;
}

export class ContractRegistry {
  private contracts: Map<string, EventContract> = new Map();
  // To enforce idempotency per consumer. Key could be `consumer:eventId`
  private processedEvents: Map<string, { correlationId: string }> = new Map();

  // For testing requirement #4: "Deux tranches revendiquant le même writer : admission refusée avant dispatch ; deux scopes disjoints restent admissibles."
  // We can track registered writers per consumer or contract
  private registeredWriters: Map<string, string> = new Map();

  register<T>(contract: EventContract<T>, writerScope: string): void {
    if (this.registeredWriters.has(contract.consumer)) {
      const existingWriter = this.registeredWriters.get(contract.consumer);
      if (existingWriter !== writerScope) {
        throw new Error(`Admission refused: Consumer ${contract.consumer} already claimed by writer ${existingWriter}. ${writerScope} cannot claim it.`);
      }
    } else {
      this.registeredWriters.set(contract.consumer, writerScope);
    }
    this.contracts.set(contract.type, contract);
  }

  dispatch(event: CrossCategoryEvent, context: DispatchContext): DispatchResult {
    const contract = this.contracts.get(event.type);

    if (!contract) {
      return {
        jobState: "FAILED",
        effectApplied: false,
        reason: `No contract found for event type: ${event.type}`,
      };
    }

    // Validate context/tenant
    // The context.scope must match the expected producer
    if (context.scope !== contract.producer) {
      return {
        jobState: "FAILED",
        effectApplied: false,
        reason: `Falsified tenant/context: Expected producer scope ${contract.producer}, got ${context.scope}`,
      };
    }

    // Validate version
    if (!contract.supportedVersions.includes(event.schemaVersion)) {
      if (contract.rejectionPolicy === "BLOCK") {
        return {
          jobState: "BLOCKED_CONTRACT",
          effectApplied: false,
          reason: `Version ${event.schemaVersion} is incompatible and rejection policy is BLOCK.`,
        };
      } else {
        return {
          jobState: "FAILED",
          effectApplied: false,
          reason: `Version ${event.schemaVersion} is not supported.`,
        };
      }
    }

    // Validate payload
    if (!contract.validatePayload(event.payload)) {
      return {
        jobState: "FAILED",
        effectApplied: false,
        reason: "Payload validation failed.",
      };
    }

    // Idempotency check
    const idempotencyKey = `${contract.consumer}:${event.eventId}`;
    if (this.processedEvents.has(idempotencyKey)) {
      const existingRecord = this.processedEvents.get(idempotencyKey)!;
      return {
        jobState: "SUCCESS",
        effectApplied: false,
        isIdempotentReplay: true,
        correlationId: existingRecord.correlationId,
        reason: "Idempotent replay. No new effect applied.",
      };
    }

    // Apply effect (simulated via return)
    this.processedEvents.set(idempotencyKey, { correlationId: event.correlationId });

    return {
      jobState: "SUCCESS",
      effectApplied: true,
      correlationId: event.correlationId,
    };
  }
}
