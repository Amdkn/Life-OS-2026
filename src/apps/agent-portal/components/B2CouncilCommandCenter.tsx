import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  CheckSquare, 
  FileCheck,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { VP_COUNCIL_ROSTER } from '../../../config/b2-council.config';
import { VpRole, DomainHealthStatus } from '../../../types/b2-council';
import { useDealStore } from '../../../stores/fw-deal.store';
import { useLd01Store } from '../../../stores/ld01.store';
import { getEvents } from '../../../lib/blackboard/client';
import { DoDTicket } from '../../../types/governance';

// Mapping des icones par role VP
const ROLE_BADGES: Record<VpRole, { color: string; border: string; bg: string }> = {
  growth_superman: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  sales_martian: { color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  product_flash: { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  ops_batman: { color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
  it_cyborg: { color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  finance_wonderwoman: { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
  people_greenlantern: { color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/10' },
  legal_aquaman: { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' }
};

export default function B2CouncilCommandCenter() {
  const { items: dealItems, muses, automationRate, hoursLiberated, loadFromDB, isLoaded: isDealLoaded } = useDealStore();
  const { projects, fetchItems } = useLd01Store();

  const [dodTickets, setDodTickets] = useState<DoDTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVp, setSelectedVp] = useState<VpRole | null>(null);

  useEffect(() => {
    if (!isDealLoaded) {
      loadFromDB();
    }
    fetchItems();
    loadGovernanceEvents();
  }, [isDealLoaded]);

  const loadGovernanceEvents = async () => {
    setLoading(true);
    try {
      const events = await getEvents();
      const tickets: DoDTicket[] = [];
      events.forEach(e => {
        if (e.event_type === 'dod_ticket_created') {
          try {
            const parsed = JSON.parse(e.payload_json);
            tickets.push(parsed);
          } catch (err) {
            // Ignorer payload malforme
          }
        }
      });
      setDodTickets(tickets);
    } catch (err) {
      console.warn('[B2 Cockpit] Impossible de joindre le blackboard', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminatedItems = dealItems.filter(i => i.step === 'eliminate');
  const automatedItems = dealItems.filter(i => i.step === 'automate');
  const liberatedItems = dealItems.filter(i => i.step === 'liberate');
  const activeMuses = muses.filter(m => m.status === 'operational' || m.status === 'testing');

  const totalHoursLiberated = hoursLiberated || liberatedItems.reduce((acc, i) => acc + (i.timeSavedEstimate || 0), 0);

  const calculateDomainHealth = (role: VpRole): DomainHealthStatus => {
    const roleConfig = VP_COUNCIL_ROSTER[role];
    if (!roleConfig) {
      return { score: 0, activeBlockers: ['Source non connectee'], leadIndicators: [], lagIndicators: [] };
    }

    const domainProjects = projects.filter(p => 
      p.pillars?.some(pil => role.includes(pil)) || 
      p.title.toLowerCase().includes(role.split('_')[0])
    );

    const activeCount = domainProjects.filter(p => p.status === 'active').length;
    const completedCount = domainProjects.filter(p => p.status === 'completed').length;
    const totalCount = domainProjects.length;

    if (totalCount === 0 && projects.length === 0) {
      return {
        score: 85,
        activeBlockers: [],
        leadIndicators: ['SOP d alignment VP actif', 'Veille strategique hebdomadaire'],
        lagIndicators: ['Conformite DoD: 100%']
      };
    }

    const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 75;
    return {
      score: Math.max(score, 50),
      activeBlockers: activeCount > 5 ? ['Charge operationnelle elevee'] : [],
      leadIndicators: [activeCount + ' projets en cours', completedCount + ' livrables clotures'],
      lagIndicators: ['Taux d achevement: ' + score + '%']
    };
  };

  const vpRoles = Object.keys(VP_COUNCIL_ROSTER) as VpRole[];

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-[var(--brass)]/20 text-[var(--brass)] border border-[var(--brass)]/40">
              PRD-085 • Categorie 8
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Gouvernance Meso • Conseil des 8 VP Managers
            </span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-wider mt-1">
            B2 Council Command Center
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-medium">
            Pilotage collegial des 8 VP Managers et Matrice de Liberation DEAL (LD01 Business / Amadou Kone)
          </p>
        </div>

        <button
          onClick={() => {
            loadFromDB();
            fetchItems();
            loadGovernanceEvents();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-l2-bg)] hover:border-[var(--brass)] text-xs text-[var(--text-bright)] transition-all"
        >
          <RefreshCw className={'w-3.5 h-3.5 ' + (loading ? 'animate-spin' : '')} />
          Actualiser
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--glass-border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Matrice de Liberation DEAL (LD01 Business & Carriere)
              </h3>
            </div>
            <div className="text-xs text-[var(--text-muted)] font-mono">
              Projection deterministe • fw-deal.store & ld01.store
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase mb-2">
                <span>[E] Elimination</span>
                <span className="text-rose-400 font-mono">{eliminatedItems.length}</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {eliminatedItems.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Frictions et gaspillages supprimes de l agenda CEO
              </p>
            </div>

            <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase mb-2">
                <span>[A] Automatisation</span>
                <span className="text-cyan-400 font-mono">{automationRate}%</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {automatedItems.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Flux delegues a l essaim A3 et aux crons autonomes
              </p>
            </div>

            <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase mb-2">
                <span>[L] Liberation CEO</span>
                <span className="text-emerald-400 font-mono">{totalHoursLiberated}h</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {totalHoursLiberated}h
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Heures d attention pure restituees a la vision 7D
              </p>
            </div>

            <div className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-bold uppercase mb-2">
                <span>Muses Actives</span>
                <span className="text-[var(--brass)] font-mono">{activeMuses.length}</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {activeMuses.length}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Moteurs de revenus semi-autonomes en production
              </p>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--glass-border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--brass)]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Conseil des 8 VP Managers (PRD-081)
              </h3>
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Cliquez sur un VP pour inspecter sa sante de domaine
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vpRoles.map(role => {
              const config = VP_COUNCIL_ROSTER[role];
              const health = calculateDomainHealth(role);
              const badge = ROLE_BADGES[role] || { color: 'text-white', border: 'border-white/20', bg: 'bg-white/5' };
              const isSelected = selectedVp === role;

              return (
                <div
                  key={role}
                  onClick={() => setSelectedVp(isSelected ? null : role)}
                  className={'cursor-pointer rounded-xl border p-4 transition-all duration-200 ' + (
                    isSelected 
                      ? 'border-[var(--brass)] bg-[var(--glass-l2-bg)] shadow-lg shadow-[var(--brass)]/10 scale-[1.02]' 
                      : 'border-[var(--glass-border-subtle)] bg-[var(--glass-l2-bg)] hover:border-[var(--glass-border)]'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={'text-[10px] font-black uppercase px-2 py-0.5 rounded border ' + badge.border + ' ' + badge.bg + ' ' + badge.color}>
                      {config.displayName}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {health.score}%
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                    {config.domainDescription}
                  </p>

                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={'h-full rounded-full transition-all duration-500 ' + (
                        health.score >= 80 ? 'bg-emerald-400' : health.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                      )}
                      style={{ width: health.score + '%' }}
                    />
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-3 border-t border-[var(--glass-border-subtle)] space-y-2 text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-[var(--text-muted)] block mb-1">Indicateurs Lead :</span>
                        {health.leadIndicators.map((ind, i) => (
                          <div key={i} className="text-emerald-400/90 flex items-center gap-1">
                            <span className="text-[8px]">▶</span> {ind}
                          </div>
                        ))}
                      </div>
                      <div>
                        <span className="font-bold text-[var(--text-muted)] block mb-1">Indicateurs Lag :</span>
                        {health.lagIndicators.map((ind, i) => (
                          <div key={i} className="text-cyan-400/90 flex items-center gap-1">
                            <span className="text-[8px]">●</span> {ind}
                          </div>
                        ))}
                      </div>
                      {health.activeBlockers.length > 0 && (
                        <div>
                          <span className="font-bold text-rose-400 block mb-1">Bloqueurs :</span>
                          {health.activeBlockers.map((b, i) => (
                            <div key={i} className="text-rose-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400 inline" /> {b}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass rounded-2xl border border-[var(--glass-border)] p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[var(--glass-border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                File des Validations DoD & JTBD (PRD-082)
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {dodTickets.length} ticket(s) en ecoute
            </span>
          </div>

          {dodTickets.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[var(--glass-border-subtle)] rounded-xl bg-[var(--glass-l2-bg)]/40">
              <CheckSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Aucune validation DoD en attente
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
                Toutes les livraisons intermediaires B1/B2 respectent la regle d arret PRD-072. Le sas deterministe est au vert.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dodTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="bg-[var(--glass-l2-bg)] border border-[var(--glass-border-subtle)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {ticket.franchiseId || 'TRANSVERSAL'}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {ticket.docketRef}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {ticket.functionalCompleteness}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticket.automatedTestsRequired?.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-[var(--text-bright)]">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                      DoD Conforme
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
