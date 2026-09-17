import React, { useEffect, useState, useMemo } from 'react';
import { useTwelveWeekStore } from '../../stores/fw-12wy.store';
import { useLifeWheelStore } from '../../stores/fw-wheel.store';
import { getEvents } from '../../lib/blackboard/client';
import { JulesApiClient, type JulesSession } from '../../services/jules/jules-api-client';
import { calculateWeeklyScore } from '../twelve-week/hooks/useWeeklyScore';
import { Shield, Target, Zap, Activity, Briefcase } from 'lucide-react';
import { pushToLinear } from '../../lib/linear/client';

export default function ConvergenceCommandCenter() {
    const { tactics, goals, activeVisionId } = useTwelveWeekStore();
    const { domains } = useLifeWheelStore();

    // Sessions Jules
    const [julesSessions, setJulesSessions] = useState<JulesSession[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    // Télémétrie Blackboard
    const [bbEvents, setBbEvents] = useState<any[]>([]);

    // Linear state
    const [linearTitle, setLinearTitle] = useState('');
    const [linearSyncStatus, setLinearSyncStatus] = useState<'idle'|'syncing'|'success'|'queued'|'error'>('idle');

    useEffect(() => {
        // Fetch Jules Sessions
        const fetchSessions = async () => {
            try {
                const data = await JulesApiClient.listSessions();
                setJulesSessions(data?.sessions || []);
            } catch (e) {
                console.error("Failed to fetch Jules sessions", e);
            } finally {
                setLoadingSessions(false);
            }
        };
        fetchSessions();

        // Fetch Blackboard Events
        const fetchEvents = async () => {
            try {
                const events = await getEvents();
                setBbEvents(events);
            } catch (e) {
                console.error("Failed to fetch BB events", e);
            }
        };
        fetchEvents();
    }, []);

    // 12WY Score Global calculation
    const global12WyScore = useMemo(() => {
        let totalScore = 0;
        let validWeeks = 0;
        for (let i = 1; i <= 12; i++) {
            const { score } = calculateWeeklyScore(tactics, goals, activeVisionId, i);
            if (score !== null) {
                totalScore += score;
                validWeeks++;
            }
        }
        return validWeeks > 0 ? Math.round(totalScore / validWeeks) : 0;
    }, [tactics, goals, activeVisionId]);

    const handleLinearSync = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!linearTitle.trim()) return;
        setLinearSyncStatus('syncing');
        try {
            const res = await pushToLinear({
                title: linearTitle,
                teamId: 'QG-LINEAR-DEFAULT'
            });
            if (res.success) {
                setLinearSyncStatus('success');
            } else if (res.queued) {
                setLinearSyncStatus('queued');
            } else {
                setLinearSyncStatus('error');
            }
            setLinearTitle('');
            setTimeout(() => setLinearSyncStatus('idle'), 3000);
        } catch (e) {
             setLinearSyncStatus('error');
             setTimeout(() => setLinearSyncStatus('idle'), 3000);
        }
    };


    return (
        <div className="p-8 h-full flex flex-col gap-8 text-white overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <header className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-widest text-emerald-400 font-outfit">
                        Convergence Command Center
                    </h1>
                    <p className="text-xs font-bold tracking-widest text-white/40 uppercase mt-1">Holding Linear QG & Framework Sync</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">

                {/* Radar des 6 vaisseaux */}
                <div className="col-span-12 lg:col-span-8 glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-6">
                         <Activity className="w-5 h-5 text-emerald-400" />
                         <h2 className="text-sm font-bold uppercase tracking-widest text-white font-outfit">Vessels Radar (Core Health)</h2>
                    </div>
                     <div className="space-y-4">
                        {domains.map(dom => (
                            <div key={dom.id} className="flex justify-between items-center text-[10px]">
                                <span className="font-bold uppercase w-24 truncate" style={{ color: dom.color }}>{dom.name}</span>
                                <div className="flex-1 mx-4 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                     <div className="h-full transition-all duration-1000" style={{ width: `${dom.score}%`, backgroundColor: dom.color, boxShadow: `0 0 10px ${dom.color}40` }} />
                                </div>
                                <span className="font-mono text-white/50 w-8 text-right">{dom.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Score 12WY */}
                <div className="col-span-12 lg:col-span-4 glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3 mb-4 w-full justify-center">
                        <Target className="w-5 h-5 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white font-outfit">Global 12WY Score</h2>
                    </div>
                    <div className="text-6xl font-black text-white tracking-tighter">
                        {global12WyScore}<span className="text-3xl text-white/30">%</span>
                    </div>
                    <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 text-center">Aggregated across active vision</p>
                </div>

                {/* Linear QG Bidirectional Bridge */}
                <div className="col-span-12 glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02]">
                     <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white font-outfit">Linear HQ Bridge</h2>
                    </div>
                    <form onSubmit={handleLinearSync} className="flex gap-4 items-center">
                        <input
                           type="text"
                           placeholder="Create new Linear Issue..."
                           className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                           value={linearTitle}
                           onChange={e => setLinearTitle(e.target.value)}
                           disabled={linearSyncStatus === 'syncing'}
                        />
                        <button
                           type="submit"
                           disabled={linearSyncStatus === 'syncing' || !linearTitle.trim()}
                           className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-sm font-bold rounded-lg transition-colors"
                        >
                            {linearSyncStatus === 'syncing' ? 'Syncing...' : 'Dispatch to Linear'}
                        </button>
                    </form>
                    {linearSyncStatus === 'success' && <p className="text-emerald-400 text-xs mt-2 uppercase font-bold tracking-widest">Issue synced to Linear.</p>}
                    {linearSyncStatus === 'queued' && <p className="text-amber-400 text-xs mt-2 uppercase font-bold tracking-widest">Queued in BB Outbox (Offline).</p>}
                    {linearSyncStatus === 'error' && <p className="text-red-400 text-xs mt-2 uppercase font-bold tracking-widest">Sync failed.</p>}
                </div>

                {/* Jules Sessions */}
                <div className="col-span-12 lg:col-span-6 glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white font-outfit">Active Jules Sessions</h2>
                    </div>

                    {loadingSessions ? (
                        <p className="text-[10px] text-white/40 italic uppercase tracking-widest text-center py-4">Scanning...</p>
                    ) : julesSessions.length === 0 ? (
                        <p className="text-[10px] text-white/40 italic uppercase tracking-widest text-center py-4">No active sessions.</p>
                    ) : (
                        <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {julesSessions.map((s: JulesSession) => (
                                <li key={s.id} className="flex justify-between items-center text-[10px] bg-white/5 border border-white/5 p-3 rounded-xl">
                                    <span className="font-mono text-white/80">{s.id}</span>
                                    <span className={`px-2 py-1 rounded-md font-bold uppercase tracking-wider ${s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                                        {s.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Blackboard Telemetry */}
                <div className="col-span-12 lg:col-span-6 glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02]">
                     <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-5 h-5 text-amber-400" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white font-outfit">Blackboard Telemetry</h2>
                    </div>

                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Total Events</span>
                        <span className="text-2xl font-black text-amber-400 font-mono leading-none">{bbEvents.length}</span>
                    </div>

                    <div className="h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {bbEvents.slice(0, 20).map((ev: any) => (
                            <div key={ev.id} className="flex gap-3 text-[9px] bg-white/5 p-2 rounded-lg border border-white/5 items-center">
                                <span className="font-mono text-white/40 shrink-0">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                                <span className="font-bold uppercase text-amber-400/80 truncate shrink-0">{ev.event_type}</span>
                                <span className="font-mono text-white/60 truncate flex-1 text-right">{ev.actor_id}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
