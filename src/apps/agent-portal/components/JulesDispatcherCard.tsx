import React, { useState, useEffect } from 'react';
import { JulesApiClient, ListSessionsResponse, JulesSession } from '../../../services/jules/jules-api-client';

export const JulesDispatcherCard: React.FC = () => {
    const [sessionsData, setSessionsData] = useState<ListSessionsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await JulesApiClient.listSessions();
            setSessionsData(data);
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
            await JulesApiClient.createSession({
                autoCreatePr: true,
                requirePlanApproval: false,
                prompt: 'Execute automated PRD dispatch.'
            });
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

                {loading && !sessionsData ? (
                    <p className="text-gray-500">Chargement des sessions...</p>
                ) : sessionsData?.sessions.length === 0 ? (
                    <p className="text-gray-500">Aucune session active.</p>
                ) : (
                    <ul className="space-y-2">
                        {sessionsData?.sessions.map((session: JulesSession) => (
                            <li key={session.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
                                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{session.id}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    session.status === 'error' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {session.status}
                                </span>
                            </li>
                        ))}
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
