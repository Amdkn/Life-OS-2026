import { B3HookRegistry, B3CronScheduler, B3CliRunner, SecurityPipeline } from '../src/services/b3-deterministic-runtime';
import { B3WorkerDescriptor, B3IncarnationType } from '../src/types/b3-polymorphic';
import fs from 'fs';
import path from 'path';

// Common descriptor mock
function createMockDescriptor(incarnation: B3IncarnationType): B3WorkerDescriptor {
  return {
    incarnation,
    capabilities: [],
    tokenCost: 0,
    latency: "low",
    authorizations: [],
    executionVectors: []
  };
}

async function runTests() {
  console.log('--- Starting B3 Deterministic Substrate Tests ---\n');
  let exitCode = 0;

  try {
    // 1. Test B3HookRegistry & Security Pipeline
    console.log('Testing B3HookRegistry & SecurityPipeline...');
    const registry = new B3HookRegistry();
    const pipeline = new SecurityPipeline(registry);

    const hookDescriptor = createMockDescriptor('hook');

    // Register a pre-execution hook that blocks if payload contains "secret"
    registry.register('hook-1', hookDescriptor, 'pre-execution', (ctx) => {
      if (typeof ctx.payload === 'string' && ctx.payload.includes('secret')) {
        return { allowed: false, reason: 'Data leak detected' };
      }
      return { allowed: true, modifiedPayload: ctx.payload + '_validated' };
    });

    const goodOutput = pipeline.validateCognitiveOutput({
      workerId: 'worker-1',
      operation: 'write_disk',
      payload: 'hello world'
    });

    if (!goodOutput.allowed || goodOutput.validatedPayload !== 'hello world_validated') {
      throw new Error(`Pipeline failed on valid input: ${JSON.stringify(goodOutput)}`);
    }

    const badOutput = pipeline.validateCognitiveOutput({
      workerId: 'worker-1',
      operation: 'write_disk',
      payload: 'this is a secret token'
    });

    if (badOutput.allowed || badOutput.reason !== 'Blocked by hook hook-1: Data leak detected') {
      throw new Error(`Pipeline failed to block invalid input: ${JSON.stringify(badOutput)}`);
    }
    console.log('✅ B3HookRegistry & SecurityPipeline passed.\n');


    // 2. Test B3CronScheduler (Monotonic Clock Logic)
    console.log('Testing B3CronScheduler...');
    const scheduler = new B3CronScheduler();
    const cronDescriptor = createMockDescriptor('cron');

    let executions: number = 0;
    scheduler.register({
      id: 'cron-1',
      descriptor: cronDescriptor,
      frequency: '60s',
      task: async () => { executions++; }
    });

    // Simulated Time
    const START_TIME = 1000000000000n; // arbitrary start
    const ONE_MIN_NS = 60n * 1000000000n;

    // First tick initializes lastRunTime
    await scheduler.tick(START_TIME);
    if ((executions as number) !== 0) throw new Error('Cron should not execute on first tick');

    // Tick 30s later
    await scheduler.tick(START_TIME + (30n * 1000000000n));
    if ((executions as number) !== 0) throw new Error('Cron executed too early');

    // Tick 60s later (should execute)
    await scheduler.tick(START_TIME + ONE_MIN_NS);
    if ((executions as number) !== 1) throw new Error('Cron failed to execute at 60s');

    // Tick 60s later minus 2s drift tolerance (should execute)
    await scheduler.tick(START_TIME + (2n * ONE_MIN_NS) - (2n * 1000000000n));
    if ((executions as number) !== 2) throw new Error('Cron failed to execute within drift tolerance');
    console.log('✅ B3CronScheduler passed.\n');


    // 3. Test B3CliRunner
    console.log('Testing B3CliRunner...');
    // Create a temporary script to run
    // We use the root directory as workspace for the test to reach the node executable if possible,
    // but better, we can invoke 'node' if it's available in PATH, by wrapping it or running a cross platform script.
    // However, since B3CliRunner enforces script to be within workspace, we must use a script in workspace.
    // Using execFile on windows requires .cmd/.bat, on unix shell scripts or binary.
    // The safest cross platform test without chmod is to run a process that simply echoes.
    // We'll write a simple bash script / bat script based on platform.
    const workspacePath = path.resolve(process.cwd());
    const runner = new B3CliRunner(workspacePath);

    const isWin = process.platform === 'win32';
    const scriptExt = isWin ? 'bat' : 'sh';
    const dummyScriptPath = path.join(workspacePath, `dummy-test-script.${scriptExt}`);

    if (isWin) {
      fs.writeFileSync(dummyScriptPath, '@echo off\necho Hello from CLI');
    } else {
      fs.writeFileSync(dummyScriptPath, '#!/bin/sh\necho "Hello from CLI"');
      fs.chmodSync(dummyScriptPath, '755');
    }

    try {
      const result = await runner.runScript(`dummy-test-script.${scriptExt}`);
      if (!result.stdout.includes('Hello from CLI')) {
        throw new Error(`CLI Runner stdout mismatch: ${result.stdout}`);
      }

      // Test security violation
      try {
        await runner.runScript(`../outside-script.${scriptExt}`);
        throw new Error('CLI Runner failed to block outside script execution');
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        if (!errMsg.includes('Security Violation')) {
          throw e;
        }
      }
      console.log('✅ B3CliRunner passed.\n');
    } finally {
      if (fs.existsSync(dummyScriptPath)) {
        fs.unlinkSync(dummyScriptPath);
      }
    }


  } catch (error) {
    console.error('❌ Test failed:', error);
    exitCode = 1;
  }

  process.exit(exitCode);
}

runTests();
