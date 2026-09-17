import { DispatchJob, JobState, DispatchResult } from './types';
import { appendEvent, getEvents, tryAcquireLock, releaseLock, BlackboardEvent } from '../../../lib/blackboard/client';

const WORKSPACE_ID = 'jules-dispatch-workspace';
const ACTOR_ID = 'dispatcher-service';
const ACTOR_LAYER = 'system';
const MAX_CONCURRENT_CATEGORIES = 3;

// We simulate a secure hash
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

export class JulesDispatcher {

    /**
     * Reads all dispatch events from the blackboard and reconstructs the current state of jobs.
     */
    static async getJobs(): Promise<Map<string, DispatchJob>> {
        const jobs = new Map<string, DispatchJob>();

        try {
            const events = await getEvents(WORKSPACE_ID);
            for (const ev of events) {
                if (ev.event_type === 'job_created' || ev.event_type === 'job_updated') {
                    try {
                        const payload = JSON.parse(ev.payload_json) as DispatchJob;
                        jobs.set(payload.id, payload);
                    } catch (e) {
                        // ignore malformed event
                    }
                }
            }
        } catch (error) {
             console.error("Failed to read jobs from blackboard", error);
        }

        return jobs;
    }

    /**
     * Reconstructs the state and returns jobs organized by state and category.
     */
    static async getActiveState() {
        const jobs = await this.getJobs();
        const activeCategories = new Set<string>();
        const activeJobs: DispatchJob[] = [];
        const runningJobs: DispatchJob[] = [];

        const activeStates: JobState[] = ['requested', 'ready', 'reserved', 'submitted', 'running', 'pr_ready', 'uncertain'];

        // The issue is 'requested' and 'ready' are in activeStates.
        // So their categories are added to activeCategories!
        // BUT wait, PRD says 'Three active categories'. Does requested/ready count towards the limit?
        // No, 'ready' is waiting for admission into 'reserved' if limits allow.
        // So activeCategories should only be populated by jobs that are already reserved or later.

        for (const job of jobs.values()) {
            if (activeStates.includes(job.state)) {
                activeJobs.push(job);
                if (['reserved', 'submitted', 'running', 'pr_ready', 'uncertain'].includes(job.state)) {
                    activeCategories.add(job.categoryId);
                }
                if (['submitted', 'running', 'pr_ready', 'uncertain'].includes(job.state)) {
                     runningJobs.push(job);
                }
            }
        }

        return { jobs, activeJobs, runningJobs, activeCategories };
    }

    /**
     * Request a new job to be created.
     */
    static async createJob(jobParams: Omit<DispatchJob, 'id' | 'createdAt' | 'updatedAt' | 'state' | 'briefHash'> & { payloadText: string }): Promise<DispatchResult> {
        const briefHash = hashString(jobParams.payloadText);
        const jobId = `${jobParams.repository}/${jobParams.categoryId}/${jobParams.tranche}`;

        const lockKey = `dispatch-lock-${jobId}`;
        const locked = await tryAcquireLock(lockKey, ACTOR_ID, 5000);

        if (!locked) {
            return { success: false, error: 'Job creation is currently locked' };
        }

        try {
            const state = await this.getActiveState();
            const existingJob = state.jobs.get(jobId);

            // Check for exact duplicate
            if (existingJob) {
                if (existingJob.briefHash === briefHash) {
                    return { success: true, jobId, state: existingJob.state };
                }
            }

            // Check write scope collisions against active jobs
            for (const activeJob of state.activeJobs) {
                 if (activeJob.id !== jobId) {
                     const overlap = jobParams.writeScopes.some(scope => activeJob.writeScopes.includes(scope));
                     if (overlap) {
                         return { success: false, error: 'Write scope collision' };
                     }
                 }
            }

            const newJob: DispatchJob = {
                id: jobId,
                categoryId: jobParams.categoryId,
                repository: jobParams.repository,
                tranche: jobParams.tranche,
                briefHash,
                state: 'requested',
                writeScopes: jobParams.writeScopes,
                dependencies: jobParams.dependencies,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            const event: BlackboardEvent = {
                id: crypto.randomUUID(),
                workspace_id: WORKSPACE_ID,
                actor_id: ACTOR_ID,
                actor_layer: ACTOR_LAYER,
                event_type: 'job_created',
                payload_json: JSON.stringify(newJob),
                timestamp: Date.now()
            };

            await appendEvent(event);
            return { success: true, jobId: newJob.id, state: newJob.state };

        } finally {
            await releaseLock(lockKey, ACTOR_ID);
        }
    }

    /**
     * Updates an existing job state.
     */
    static async updateJobState(jobId: string, newState: JobState, sessionId?: string): Promise<DispatchResult> {
        const lockKey = `dispatch-update-${jobId}`;
        const locked = await tryAcquireLock(lockKey, ACTOR_ID, 5000);

        if (!locked) {
            return { success: false, error: 'Job update is currently locked' };
        }

        try {
            const state = await this.getActiveState();
            const job = state.jobs.get(jobId);
            if (!job) {
                return { success: false, error: 'Job not found' };
            }

            job.state = newState;
            job.updatedAt = Date.now();
            if (sessionId) {
                job.sessionId = sessionId;
            }

            const event: BlackboardEvent = {
                id: crypto.randomUUID(),
                workspace_id: WORKSPACE_ID,
                actor_id: ACTOR_ID,
                actor_layer: ACTOR_LAYER,
                event_type: 'job_updated',
                payload_json: JSON.stringify(job),
                timestamp: Date.now()
            };

            await appendEvent(event);
            return { success: true, jobId: job.id, state: job.state };

        } finally {
            await releaseLock(lockKey, ACTOR_ID);
        }
    }

    /**
     * Scheduler loop step to move jobs from requested -> ready -> reserved etc.
     */
    static async scheduleTick(): Promise<void> {
        const lockKey = `dispatch-schedule-tick`;
        const locked = await tryAcquireLock(lockKey, ACTOR_ID, 5000);
        if (!locked) return; // another tick is running

        try {
            const state = await this.getActiveState();

            // requested -> ready
            for (const job of state.jobs.values()) {
                if (job.state === 'requested') {
                    // Check if dependencies are integrated
                    const depsIntegrated = job.dependencies.every(depId => {
                         const depJob = state.jobs.get(depId);
                         return depJob && depJob.state === 'integrated';
                    });
                    if (depsIntegrated) {
                        await this.updateJobState(job.id, 'ready');
                    } else {
                        await this.updateJobState(job.id, 'blocked');
                    }
                }
            }

            // ready -> reserved
            // Refresh state after updates
            const freshState = await this.getActiveState();
            // Since updateJobState appends events, freshState recalculates activeCategories correctly based on blackboard events.
            // However, we might have multiple jobs moving to reserved in the same tick.
            let currentActiveCount = freshState.activeCategories.size;
            const localActiveCats = new Set(freshState.activeCategories);

            for (const job of Array.from(freshState.jobs.values()).sort((a,b) => a.createdAt - b.createdAt)) {
                if (job.state === 'ready') {
                    // Admision rules: max 3 categories
                    const canAdmit = localActiveCats.has(job.categoryId) || currentActiveCount < MAX_CONCURRENT_CATEGORIES;

                    if (canAdmit) {
                        await this.updateJobState(job.id, 'reserved');
                        // Update active categories set for next iteration
                        if (!localActiveCats.has(job.categoryId)) {
                            localActiveCats.add(job.categoryId);
                            currentActiveCount++;
                        }
                    }
                }
            }

        } finally {
            await releaseLock(lockKey, ACTOR_ID);
        }
    }
}
