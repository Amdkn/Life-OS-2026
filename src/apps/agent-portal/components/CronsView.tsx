import React, { useEffect, useState } from 'react';
import { getCrons, toggleCron, triggerPulse } from '../../../services/cron-registry/registry.js';
import { CronJob } from '../../../services/cron-registry/types.js';
import { motion } from 'motion/react';
import { Clock, CheckCircle2 } from 'lucide-react';

const DAYS = ['MON 23', 'TUE 24', 'WED 25', 'THU 26', 'FRI 27', 'SAT 28', 'SUN 29'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);



const CronsView: React.FC = () => {
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCrons = async () => {
    setLoading(true);
    try {
      const data = await getCrons();
      setCrons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrons();
    // Optional: Could poll here for heartbeats or setup WebSocket
    const interval = setInterval(fetchCrons, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleCron(id, !currentStatus);
    await fetchCrons();
  };

  const handlePulse = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await triggerPulse(id);
    await fetchCrons();
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-wider mb-1">Cron Registry</h3>
          <p className="text-xs text-[var(--text-muted)] font-medium">Scheduled automation tasks and background processes</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[11px] font-bold text-white uppercase tracking-widest">{crons.filter(c => c.isActive).length} Crons Active</span>
          </div>
          <button className="bg-[var(--accent-primary)] hover:bg-[#10b981ee] text-black text-[11px] font-black uppercase px-6 py-2.5 rounded-xl shadow-[0_0_20px_var(--accent-primary-glow)] transition-all">
            Deploy New Cron
          </button>
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl border border-[var(--glass-border)] overflow-hidden flex flex-col">
        {/* Header: Days */}
        <div className="grid grid-cols-[80px_1fr] border-b border-[var(--glass-border)]">
          <div className="bg-[var(--glass-l2-bg)] border-r border-[var(--glass-border)]" />
          <div className="grid grid-cols-7">
            {DAYS.map((day, idx) => (
              <div key={day} className={`p-4 text-center border-r last:border-r-0 border-[var(--glass-border)] ${idx === 4 ? 'bg-[var(--glass-bg-active)]' : ''}`}>
                <span className="text-[11px] font-black text-white tracking-widest uppercase">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body: Hours & Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="grid grid-cols-[80px_1fr]">
            {/* Hour labels */}
            <div className="flex flex-col border-r border-[var(--glass-border)]">
              {HOURS.map(hour => (
                <div key={hour} className="h-16 flex items-center justify-center border-b border-[var(--glass-border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-black italic">{hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}</span>
                </div>
              ))}
            </div>

            {/* Grid Cells */}
            <div className="grid grid-cols-7 relative">
              {/* Hour horizontal lines */}
              <div className="absolute inset-0 pointer-events-none">
                {HOURS.map(hour => (
                  <div key={`line-${hour}`} className="h-16 border-b border-[var(--glass-border-subtle)]" />
                ))}
              </div>
              
              {/* Day vertical separators */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-7">
                {DAYS.map((_, idx) => (
                  <div key={`v-line-${idx}`} className="h-full border-r border-[var(--glass-border-subtle)] last:border-r-0" />
                ))}
              </div>

              {/* Mock Events */}
              {crons.map((cron) => (
                <motion.div
                  key={cron.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute p-1"
                  style={{
                    top: `${cron.time * 64}px`,
                    left: `${(cron.day / 7) * 100}%`,
                    width: `${100 / 7}%`,
                    height: '96px',
                    zIndex: 1
                  }}
                >
                  <div 
                    className="h-full w-full rounded-lg border-l-4 p-2 flex flex-col justify-between overflow-hidden cursor-pointer hover:brightness-125 transition-all group shadow-lg"
                    style={{ 
                      backgroundColor: `color-mix(in srgb, ${cron.color}, transparent 85%)`,
                      borderColor: cron.color
                    }}
                  >
                    <div className="text-[9px] font-black text-white uppercase truncate opacity-90">{cron.title}</div>

                    <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-white" />
                        <span className="text-[8px] text-white font-bold">{cron.time}:00 - {cron.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={(e) => handleToggle(cron.id, cron.isActive, e)}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${cron.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                          {cron.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={(e) => handlePulse(cron.id, e)}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[8px] font-bold uppercase text-white"
                        >
                          Pulse
                        </button>
                      </div>
                      {cron.lastPulse && (
                        <div className="text-[7px] text-white/70 mt-0.5">
                          Last: {new Date(cron.lastPulse).toLocaleTimeString()}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              ))}

              {/* Red line for current time (mock) */}
              <div className="absolute top-[880px] left-0 right-0 h-[2px] bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)] z-10 flex items-center">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] -ml-1 border border-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CronsView;





