import React, { useState } from 'react';
import { X, Target, Zap } from 'lucide-react';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';
import { useLifeWheelStore } from '../../../stores/fw-wheel.store';

interface GoalForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optionnel si on ouvre la modale depuis une vision spécifique
  prefilledVisionId?: string; 
}

export function GoalForgeModal({ isOpen, onClose, prefilledVisionId }: GoalForgeModalProps) {
  const [title, setTitle] = useState('');
  const [visionId, setVisionId] = useState<string>(prefilledVisionId || '');
  const [projectId, setProjectId] = useState<string>('');
  const [targetWeek, setTargetWeek] = useState(12);
  
  const addGoal = useTwelveWeekStore(s => s.addGoal);
  const visions = useTwelveWeekStore(s => s.visions);
  const ikigaiVisions = useIkigaiStore(s => s.visions);
  const wheelDomains = useLifeWheelStore(s => s.domains);
  
  // PARA Nexus
  const allProjects = useParaStore(s => s.projects);
  const activeProjects = allProjects.filter(p => p.status === 'active');
  const addParaProject = useParaStore(s => s.addProject); // Auto-Commission

  const selectedVision = visions.find(v => v.id === visionId);
  const parentIkigai = ikigaiVisions.find(i => i.id === selectedVision?.ikigaiVisionId);
  const parentDomain = wheelDomains.find(d => d.id === selectedVision?.domainId);

  if (!isOpen) return null;

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !visionId) return;

    let finalProjectId = projectId;

    // Auto-Commission de Projet si "inject_new" est sélectionné
    if (projectId === 'inject_new') {
      // In PARA store, addProject might not return the ID immediately if async with IDB
      // but for this UI we'll generate one
      const newId = `prj-${crypto.randomUUID()}`;
      await addParaProject({
        id: newId,
        title: title, // Même nom par défaut
        status: 'active',
        domain: 'business', // Default assumption
        pillars: [],
        resources: [],
        progress: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as any);
      finalProjectId = newId;
    }

    await addGoal({
      id: crypto.randomUUID(),
      type: 'wy-goal',
      title,
      visionId,
      targetWeek,
      status: 'pending',
      projectId: finalProjectId !== '' && finalProjectId !== 'inject_new' ? finalProjectId : undefined,
      domain: 'life',
      pillars: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as any);

    setTitle('');
    setProjectId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[500px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide">Forge Tactical Goal</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">12WY - 12 Week Horizon</p>
          </div>
        </div>

        <form onSubmit={handleForge} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Command Target</label>
            <input 
              autoFocus
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Ship V1.0 of the Engine"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Parent Vision</label>
               <select 
                 value={visionId} 
                 onChange={e => setVisionId(e.target.value)}
                 className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400/50 font-medium appearance-none cursor-pointer"
               >
                 <option value="" disabled>-- Select Vision --</option>
                 {visions.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
               </select>
               {selectedVision && (
                 <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-1">
                   <p className="text-[9px] uppercase tracking-widest text-white/60">Inherits From:</p>
                   <p className="text-xs font-bold text-teal-400 flex items-center gap-2">
                      {parentDomain?.name || 'No Domain'} <span className="text-white/20">|</span> {parentIkigai?.title || 'Tactical Isolation'}
                   </p>
                 </div>
               )}
             </div>
             <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1">Target Week</label>
               <input 
                  type="number" min="1" max="12"
                  value={targetWeek} 
                  onChange={e => setTargetWeek(Number(e.target.value))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400/50 font-medium font-mono"
               />
             </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5 mt-4">
            <label className="text-[10px] uppercase tracking-widest text-white/60 font-bold ml-1 flex justify-between">
              <span>PARA Linkage (Project)</span>
              <span className="text-teal-400 font-black">NEXUS</span>
            </label>
            <select 
              value={projectId} 
              onChange={e => setProjectId(e.target.value)}
              className="w-full bg-[#111] border border-teal-500/20 rounded-xl px-4 py-3 text-teal-50 focus:outline-none focus:border-teal-400/80 font-medium transition-colors cursor-pointer"
            >
              <option value="">-- No linked Project --</option>
              {activeProjects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
              <option value="inject_new" className="text-teal-400 font-bold">⚡ INJECT NEW PROJECT IN PARA</option>
            </select>
            {projectId === 'inject_new' && (
              <p className="text-[9px] text-teal-400/60 mt-2 px-1 flex items-center gap-1 font-medium italic">
                <Zap className="w-3 h-3" /> Creates a PARA Project with the same title upon save.
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!title.trim() || !visionId}
            className="w-full mt-2 bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            Forge Tactical Goal
          </button>
        </form>
      </div>
    </div>
  );
}
