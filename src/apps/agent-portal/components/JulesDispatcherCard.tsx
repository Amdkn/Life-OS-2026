import React, { useState, useEffect } from 'react';
import { JulesApiClient, ListSessionsResponse, JulesSession } from '../../../services/jules/jules-api-client';
import { JulesDispatcher } from '../../../services/jules/dispatch/dispatcher';
import { DispatchJob } from '../../../services/jules/dispatch/types';

export const JulesDispatcherCard: React.FC = () => {
    const [sessionsData, setSessionsData] = useState<ListSessionsResponse | null>(null);
    const [dispatchQueue, setDispatchQueue] = useState<DispatchJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Reconcile standard sessions if available (with fallback to UNKNOWN)
            let data: ListSessionsResponse | null = null;
            try {
                data = await JulesApiClient.listSessions();
            } catch (apiErr: any) {
                // If Jules API isn't up, we just fallback to unknown quota
                data = { sessions: [], quota: { max: 100, remaining: null } };
            }
            setSessionsData(data);

            // Get local Blackboard dispatch queue
            const state = await JulesDispatcher.getActiveState();

            // To be robust with UI list rendering
            const sortedJobs = Array.from(state.jobs.values()).sort((a,b) => b.createdAt - a.createdAt);
            setDispatchQueue(sortedJobs);

        } catch (err: any) {
            setError(err.message || 'Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDispatch = async () => {
        try {
            setLoading(true);
            setError(null);

            // PRD-056: Real dispatch requires an actual ID and scope.
            const result = await JulesDispatcher.createJob({
                categoryId: 'C5',
                repository: 'Life-OS-2026',
                tranche: 'PRD-056-DISPATCH',
                payloadText: 'Execute automated PRD dispatch for convergence blackboard.',
                writeScopes: ['src/services/jules/dispatch/dispatcher.ts'],
                dependencies: []
            });

            if (!result.success && result.error !== 'Job creation is currently locked' && result.error !== 'Write scope collision') {
                setError(result.error || 'Failed to enqueue');
            } else {
                await JulesDispatcher.scheduleTick();
            }

            await fetchSessions();
        } catch (err: any) {
             setError(err.message || 'Failed to dispatch session');
        } finally {
            setLoading(false);
        }
    };

    const quotaDisplay = () => {
        if (!sessionsData) return 'Chargement...';
        if (!sessionsData.quota || sessionsData.quota.remaining === null || sessionsData.quota.remaining === undefined) {
            return 'Quota inconnu';
        }
        return `${sessionsData.quota.remaining} / ${sessionsData.quota.max} tâches restantes`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Jules Dispatcher</h2>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quotas Quotidiens</h3>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {quotaDisplay()}
                </p>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sessions Actives</h3>
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                {loading && dispatchQueue.length === 0 ? (
                    <p className="text-gray-500">Chargement de la file d'attente...</p>
                ) : dispatchQueue.length === 0 ? (
                    <p className="text-gray-500">Aucun job dans la file.</p>
                ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {dispatchQueue.map((job: DispatchJob) => (
                            <li key={job.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md flex justify-between items-center border-l-4" style={{borderLeftColor: job.state === 'running' ? '#3b82f6' : job.state === 'reserved' ? '#8b5cf6' : job.state === 'integrated' ? '#10b981' : '#9ca3af'}}>
                                <div className="flex flex-col">
                                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{job.id}</span>
                                    <span className="text-[10px] text-gray-500">{job.categoryId}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    job.state === 'integrated' ? 'bg-green-100 text-green-800' :
                                    job.state === 'failed' || job.state === 'blocked' ? 'bg-red-100 text-red-800' :
                                    job.state === 'ready' || job.state === 'reserved' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                }`}>
                                    {job.state}
                                </span>
                            </li>
                        ))}

                        {/* Display classic Jules API sessions too if any */}
                        {sessionsData?.sessions && sessionsData.sessions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Sessions Exécutives Distantes</h4>
                                {sessionsData.sessions.map((session: JulesSession) => (
                                    <li key={session.id} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md flex justify-between items-center mt-1">
                                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{session.id}</span>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            session.status === 'error' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {session.status}
                                        </span>
                                    </li>
                                ))}
                            </div>
                        )}
                    </ul>
                )}
            </div>

            <button
                onClick={handleDispatch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Traitement...' : 'Déclencher Session Rapide (AUTO_CREATE_PR)'}
            </button>
        </div>
    );
};
