import React, { useMemo, useState } from 'react';
import { useGtdStore, type GTDItem } from '../../../stores/fw-gtd.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { ListTodo, CheckCircle2, Link as LinkIcon, Trash2, Save, X, Layers, Target } from 'lucide-react';

export function OrganizeView() {
  const { items, processItem, removeItem } = useGtdStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const allProjects = useParaStore(s => s.projects);
  const allGoals = useTwelveWeekStore(s => s.goals);

  // Filtrage : Actionable uniquement
  const actionableItems = useMemo(() => {
    return items.filter(i => i.status === 'actionable');
  }, [items]);

  const activeProjects = useMemo(() => allProjects.filter(p => p.status !== 'archived'), [allProjects]);

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex justify-center items-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
           <ListTodo className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--theme-text)]">Organize Protocol</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--theme-text)]/40">Align actions with PARA & 12WY Nexus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {actionableItems.map(item => (
          <div key={item.id}>
            {editingId === item.id ? (
              <TaskEditor 
                item={item} 
                projects={activeProjects}
                goals={allGoals}
                onSave={async (patch: any) => {
                  await processItem(item.id, patch, "Organized and linked via protocol");
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
                onDelete={async () => {
                  await removeItem(item.id);
                  setEditingId(null);
                }}
              />
            ) : (
              <div 
                onClick={() => setEditingId(item.id)}
                className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${(!item.projectId && !item.goalId) ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--theme-text)]/90">{item.content}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-text)]/30">
                       <span className="text-blue-400/60">{item.context || '@NONE'}</span>
                       {item.projectId && (
                         <span className="flex items-center gap-1 text-blue-400">
                           <Layers className="w-2.5 h-2.5" /> 
                           {activeProjects.find(p => p.id === item.projectId)?.title || 'Linked Project'}
                         </span>
                       )}
                       {item.goalId && (
                         <span className="flex items-center gap-1 text-teal-400">
                           <Target className="w-2.5 h-2.5" /> 
                           {allGoals.find(g => g.id === item.goalId)?.title || 'Linked Goal'}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <LinkIcon className="w-4 h-4 text-[var(--theme-text)]/10 group-hover:text-blue-400 transition-all" />
              </div>
            )}
          </div>
        ))}
        
        {actionableItems.length === 0 && (
          <div className="text-center py-20 opacity-20 border border-dashed border-white/10 rounded-[2.5rem]">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] font-bold">No actionable items to organize</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskEditor({ item, projects, goals, onSave, onCancel, onDelete }: any) {
  const [formData, setFormData] = useState({ ...item });

  const handlePatch = (patch: any) => {
    setFormData((prev: any) => ({ ...prev, ...patch }));
  };

  return (
    <div className="p-8 rounded-3xl bg-[#0F0F0F] border-2 border-[var(--theme-accent)] shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="space-y-6">
        <textarea 
          value={formData.content}
          onChange={e => handlePatch({ content: e.target.value })}
          className="w-full bg-transparent border-none text-xl font-bold text-[var(--theme-text)] placeholder-white/10 focus:outline-none resize-none"
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5 text-[var(--theme-text)]">
          {/* PARA Bridge */}
          <div className="space-y-2">
            <label className="text-[10px] text-[var(--theme-text)]/40 uppercase font-bold tracking-widest ml-1">Linked Project (PARA)</label>
            <select 
              value={formData.projectId || ''} 
              onChange={e => handlePatch({ projectId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#111]">-- No Project Link --</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id} className="bg-[#111]">{p.title}</option>
              ))}
            </select>
          </div>

          {/* 12WY Bridge */}
          <div className="space-y-2">
            <label className="text-[10px] text-[var(--theme-text)]/40 uppercase font-bold tracking-widest ml-1">Linked Goal (12 Week Year)</label>
            <select 
              value={formData.goalId || ''} 
              onChange={e => handlePatch({ goalId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#111]">-- No Goal Link --</option>
              {goals.map((g: any) => (
                <option key={g.id} value={g.id} className="bg-[#111]">{g.title} (W{g.targetWeek})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-[var(--theme-text)]/40 uppercase font-bold tracking-widest ml-1">Context</label>
            <select 
              value={formData.context || ''} 
              onChange={e => handlePatch({ context: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-accent)] appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#111]">-- Select Context --</option>
              <option value="@home" className="bg-[#111]">@Home</option>
              <option value="@work" className="bg-[#111]">@Work</option>
              <option value="@errands" className="bg-[#111]">@Errands</option>
              <option value="waiting" className="bg-[#111]">Waiting</option>
              <option value="someday" className="bg-[#111]">Someday</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-[var(--theme-text)]/40 uppercase font-bold tracking-widest ml-1">Energy Level</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => handlePatch({ energy: e })}
                  className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all
                    ${formData.energy === e 
                      ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] text-[var(--theme-bg)]' 
                      : 'bg-white/5 border-white/10 text-[var(--theme-text)]/40 hover:bg-white/10'}
                  `}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <button 
            onClick={onDelete}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--theme-text)]/40 hover:text-[var(--theme-text)] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="px-8 py-3 bg-[var(--theme-accent)] hover:scale-105 text-[var(--theme-bg)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[var(--theme-accent)]/20"
            >
              <Save className="w-4 h-4" /> Commit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
