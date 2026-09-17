import {
  ContractRegistry,
  CrossCategoryEvent,
  EventContract,
} from "../src/contracts/crossCategoryEvents.js";

// Utility for assertions
function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function runTests() {
  console.log("Running Contract Integration Tests...\n");

  const registry = new ContractRegistry();

  // Mock Payloads
  interface TestPayload {
    message: string;
    count: number;
  }

  // Contract 1: Standard valid contract
  const testContract: EventContract<TestPayload> = {
    type: "TEST_EVENT",
    producer: "scope_a",
    consumer: "scope_b",
    supportedVersions: [1, 2],
    validatePayload: (payload: any): payload is TestPayload => {
      return (
        typeof payload === "object" &&
        payload !== null &&
        typeof payload.message === "string" &&
        typeof payload.count === "number"
      );
    },
    rejectionPolicy: "BLOCK",
  };

  // Register Contract 1
  registry.register(testContract, "writer_b");

  console.log("Test 1: Successful end-to-end event dispatching");
  const validEvent: CrossCategoryEvent<TestPayload> = {
    schemaVersion: 1,
    eventId: "evt-001",
    correlationId: "corr-001",
    causationId: "caus-001",
    occurredAt: new Date().toISOString(),
    aggregateId: "agg-001",
    aggregateVersion: 1,
    type: "TEST_EVENT",
    payload: {
      message: "Hello World",
      count: 42,
    },
  };

  const res1 = registry.dispatch(validEvent, { actor: "system", scope: "scope_a" });
  assert(res1.jobState === "SUCCESS", "Valid event should result in SUCCESS");
  assert(res1.effectApplied === true, "Effect should be applied for a new valid event");
  assert(res1.correlationId === "corr-001", "CorrelationId should match");
  console.log("✅ Test 1 Passed\n");


  console.log("Test 2: Structured rejection");
  // 2a. Invalid payload
  const invalidPayloadEvent: CrossCategoryEvent<any> = {
    ...validEvent,
    eventId: "evt-002",
    payload: { message: "Invalid", count: "not-a-number" }, // invalid type
  };
  const res2a = registry.dispatch(invalidPayloadEvent, { actor: "system", scope: "scope_a" });
  assert(res2a.jobState === "FAILED", "Invalid payload should result in FAILED");
  assert(res2a.effectApplied === false, "Effect should not be applied on failed payload validation");

  // 2b. Unregistered version with REJECT_AND_CONTINUE policy
  const testContractV2: EventContract<TestPayload> = {
    ...testContract,
    type: "TEST_EVENT_V2",
    consumer: "scope_b2", // Use a different consumer to avoid claiming the same writer
    supportedVersions: [2],
    rejectionPolicy: "REJECT_AND_CONTINUE",
  };
  registry.register(testContractV2, "writer_b2");

  const invalidVersionEvent: CrossCategoryEvent<TestPayload> = {
    ...validEvent,
    eventId: "evt-003",
    type: "TEST_EVENT_V2",
    schemaVersion: 1, // Contract only supports version 2
  };
  const res2b = registry.dispatch(invalidVersionEvent, { actor: "system", scope: "scope_a" });
  assert(res2b.jobState === "FAILED", "Unsupported version with REJECT_AND_CONTINUE should result in FAILED");
  assert(res2b.effectApplied === false, "Effect should not be applied on unsupported version");

  // 2c. Falsified tenant/context
  const res2c = registry.dispatch(validEvent, { actor: "system", scope: "scope_x" });
  assert(res2c.jobState === "FAILED", "Falsified scope should result in FAILED");
  assert(res2c.effectApplied === false, "Effect should not be applied on falsified scope");
  console.log("✅ Test 2 Passed\n");


  console.log("Test 3: Idempotency");
  const res3 = registry.dispatch(validEvent, { actor: "system", scope: "scope_a" });
  assert(res3.jobState === "SUCCESS", "Replayed event should still result in SUCCESS status");
  assert(res3.effectApplied === false, "Effect should not be applied again for idempotent replay");
  assert(res3.isIdempotentReplay === true, "isIdempotentReplay should be true");
  assert(res3.correlationId === "corr-001", "CorrelationId must be preserved");
  console.log("✅ Test 3 Passed\n");


  console.log("Test 4: Blocked contract");
  const blockedEvent: CrossCategoryEvent<TestPayload> = {
    ...validEvent,
    eventId: "evt-004",
    schemaVersion: 3, // Unsupported version
  };
  const res4 = registry.dispatch(blockedEvent, { actor: "system", scope: "scope_a" });
  assert(res4.jobState === "BLOCKED_CONTRACT", "Unsupported version with BLOCK policy should result in BLOCKED_CONTRACT");
  assert(res4.effectApplied === false, "Effect should not be applied");
  console.log("✅ Test 4 Passed\n");


  console.log("Test 5: Validate authorized scope constraints");
  let caughtError = false;
  try {
    const conflictingContract: EventContract<TestPayload> = {
      type: "TEST_EVENT_CONFLICT",
      producer: "scope_c",
      consumer: "scope_b", // same consumer as testContract
      supportedVersions: [1],
      validatePayload: testContract.validatePayload,
      rejectionPolicy: "BLOCK",
    };
    registry.register(conflictingContract, "writer_c"); // different writer
  } catch (error: any) {
    caughtError = true;
    assert(error.message.includes("Admission refused"), "Should refuse admission with correct message");
  }
  assert(caughtError, "Registering a conflicting writer should throw an error");

  // Registering with the same writer should work
  const sameWriterContract: EventContract<TestPayload> = {
    type: "TEST_EVENT_SAME_WRITER",
    producer: "scope_c",
    consumer: "scope_b", // same consumer as testContract
    supportedVersions: [1],
    validatePayload: testContract.validatePayload,
    rejectionPolicy: "BLOCK",
  };
  registry.register(sameWriterContract, "writer_b"); // same writer

  // Registering a new consumer with a different writer should work
  const disjointContract: EventContract<TestPayload> = {
    type: "TEST_EVENT_DISJOINT",
    producer: "scope_c",
    consumer: "scope_d", // different consumer
    supportedVersions: [1],
    validatePayload: testContract.validatePayload,
    rejectionPolicy: "BLOCK",
  };
  registry.register(disjointContract, "writer_c");
  console.log("✅ Test 5 Passed\n");

  console.log("All contract integration tests passed successfully! 🎉");
}

try {
  runTests();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
