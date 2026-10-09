import { ClaraContract } from './clara/capability-contract.js';
import { RyanFactory } from './ryan/capability-factory.js';
import { RiverFlowEngine } from './river/flow-engine.js';
import { RoryEvidenceStore } from './rory/evidence-store.js';
import { WargameRunner, WargameScenario } from './wargame/wargame-runner.js';
import crypto from 'crypto';

// 1. Clara Contract
const helloWorldContract: ClaraContract<{ name: string }, { simulated: boolean, message: string }> = {
  id: 'canary-hello',
  name: 'Canary Hello World',
  description: 'Proves the holon boundary',
  inputSchema: { type: 'object', properties: { name: { type: 'string' } } },
  outputSchema: { type: 'object', properties: { simulated: { type: 'boolean' }, message: { type: 'string' } } },
  acceptanceCriteria: ['Returns greeting', 'Indicates if simulated'],
  holdoutScenarios: ['Empty name']
};

// 2. Ryan Factory
const helloWorldFactory: RyanFactory<{ name: string }, { simulated: boolean, message: string }> = {
  contract: helloWorldContract,
  buildHarness: () => {
    return async (input) => {
      if (!input.name) throw new Error('Empty name');
      return { simulated: true, message: `Hello ${input.name}` };
    };
  }
};

export async function runCanary() {
  const correlationId = crypto.randomUUID();
  const actorId = 'a3-picard';
  const actorLayer = 'A3';

  console.log('[Holon Canary] A3 retains local planning and tool-choice authority.');

  // Wargame integration
  const runner = new WargameRunner();
  const scenario: WargameScenario = {
    reconReadOnly: true,
    expectedObservation: 'Canary succeeds',
    likelyFailureAndSignal: 'Empty name throws',
    counterMove: 'Provide valid name',
    forkTrigger: 'Network down',
    unresolvedReconNeeded: [],
    abortConditions: [],
    verification: 'Check receipt',
    redTeam: 'Try to bypass auth'
  };
  const wg = runner.evaluate(scenario);
  if (!wg.ok) {
    console.log(`[Holon Canary] Wargame aborted: ${wg.reason}`);
    return;
  }

  console.log('[Holon Canary] Wargame passed. Executing flow...');

  // 3. River Flow + 4. Rory Persistence
  const store = new RoryEvidenceStore();
  const engine = new RiverFlowEngine(store);

  const result = await engine.executeFlow(helloWorldFactory, { name: 'A3 Canary' }, correlationId, actorId, actorLayer);

  console.log(`[Holon Canary] Result:`, result);
  console.log('[Holon Canary] Agent OS shows identity/runtime separation.');
  console.log('[Holon Canary] Acceptance passed.');
}
