import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { B3WorkerDescriptor, B3IncarnationType } from '../types/b3-polymorphic';

const execFileAsync = promisify(execFile);

// --- B3HookRegistry ---
export type HookPhase = 'pre-execution' | 'post-execution';

export interface B3HookContext {
  workerId: string;
  operation: string;
  payload: any;
  budgetIter?: number;
}

export type HookFn = (context: B3HookContext) => { allowed: boolean; reason?: string; modifiedPayload?: any };

export class B3HookRegistry {
  private hooks: Map<string, { descriptor: B3WorkerDescriptor; fn: HookFn; phase: HookPhase }> = new Map();

  register(id: string, descriptor: B3WorkerDescriptor, phase: HookPhase, fn: HookFn) {
    if (descriptor.incarnation !== 'hook') {
      throw new Error(`Worker ${id} must have incarnation 'hook'`);
    }
    this.hooks.set(id, { descriptor, fn, phase });
  }

  unregister(id: string) {
    this.hooks.delete(id);
  }

  executeHooks(phase: HookPhase, context: B3HookContext): { allowed: boolean; reason?: string; modifiedContext: B3HookContext } {
    let currentContext = { ...context };

    for (const [hookId, hookDef] of Array.from(this.hooks.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (hookDef.phase === phase) {
        try {
          const result = hookDef.fn(currentContext);
          if (!result.allowed) {
            return { allowed: false, reason: `Blocked by hook ${hookId}: ${result.reason || 'Unknown reason'}`, modifiedContext: currentContext };
          }
          if (result.modifiedPayload !== undefined) {
             currentContext.payload = result.modifiedPayload;
          }
        } catch (e: unknown) {
           const errMsg = e instanceof Error ? e.message : String(e);
           return { allowed: false, reason: `Hook ${hookId} threw an error: ${errMsg}`, modifiedContext: currentContext };
        }
      }
    }
    return { allowed: true, modifiedContext: currentContext };
  }
}

// --- B3CronScheduler ---
export type CronFrequency = '60s' | '15m' | 'daily' | 'weekly';

export interface CronJob {
  id: string;
  descriptor: B3WorkerDescriptor;
  frequency: CronFrequency;
  task: () => Promise<void>;
  lastRunTime?: bigint;
}

export class B3CronScheduler {
  private jobs: Map<string, CronJob> = new Map();
  private isRunning: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  // Drift tolerance in ns (e.g. 5 seconds)
  private readonly TOLERANCE_NS = 5000000000n;

  register(job: CronJob) {
    if (job.descriptor.incarnation !== 'cron') {
      throw new Error(`Worker ${job.id} must have incarnation 'cron'`);
    }
    this.jobs.set(job.id, job);
  }

  unregister(id: string) {
    this.jobs.delete(id);
  }

  private getFrequencyNs(freq: CronFrequency): bigint {
    const SEC = 1000000000n;
    const MIN = 60n * SEC;
    const HOUR = 60n * MIN;
    const DAY = 24n * HOUR;
    switch (freq) {
      case '60s': return 60n * SEC;
      case '15m': return 15n * MIN;
      case 'daily': return DAY;
      case 'weekly': return 7n * DAY;
    }
  }

  async tick(currentTimeNs?: bigint) {
    const now = currentTimeNs ?? process.hrtime.bigint();
    for (const [id, job] of this.jobs.entries()) {
      if (!job.lastRunTime) {
        job.lastRunTime = now;
        continue;
      }

      const intervalNs = this.getFrequencyNs(job.frequency);
      const elapsedNs = now - job.lastRunTime;

      // Check if time passed the interval minus drift tolerance
      if (elapsedNs >= intervalNs - this.TOLERANCE_NS) {
        try {
          await job.task();
        } catch (e) {
          console.error(`Cron job ${id} failed:`, e);
        } finally {
          job.lastRunTime = now;
        }
      }
    }
  }

  start(tickIntervalMs = 1000) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), tickIntervalMs);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// --- B3CliRunner ---
export class B3CliRunner {
  private workspace: string;

  constructor(workspacePath: string) {
      // Must be an absolute bounded path or resolved against current working dir
      this.workspace = path.resolve(workspacePath);
  }

  async runScript(scriptPath: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
      // Ensure the script path is within the bounded workspace
      const resolvedPath = path.resolve(this.workspace, scriptPath);
      if (!resolvedPath.startsWith(this.workspace)) {
         throw new Error(`Security Violation: Attempted to run script outside bounded workspace (${resolvedPath})`);
      }

      try {
        const { stdout, stderr } = await execFileAsync(resolvedPath, args, { cwd: this.workspace });
        return { stdout, stderr };
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        throw new Error(`CLI Runner failed: ${errMsg}`);
      }
  }
}

// --- Security Pipeline ---
export class SecurityPipeline {
  constructor(private hookRegistry: B3HookRegistry) {}

  /**
   * Routes cognitive B3 output through validation hooks before approving disk writes or API calls.
   */
  validateCognitiveOutput(context: B3HookContext): { allowed: boolean; reason?: string; validatedPayload?: any } {
    const preRes = this.hookRegistry.executeHooks('pre-execution', context);
    if (!preRes.allowed) return { allowed: false, reason: preRes.reason };

    // In a real pipeline, the actual operation (e.g., disk write) would happen here
    // For this security gate, we just run post-execution validation too if needed or let the caller proceed
    const postRes = this.hookRegistry.executeHooks('post-execution', preRes.modifiedContext);

    if (!postRes.allowed) return { allowed: false, reason: postRes.reason };

    return { allowed: true, validatedPayload: postRes.modifiedContext.payload };
  }
}

export const defaultHookRegistry = new B3HookRegistry();
export const defaultCronScheduler = new B3CronScheduler();
export const defaultSecurityPipeline = new SecurityPipeline(defaultHookRegistry);
