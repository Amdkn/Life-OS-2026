import React, { useState } from 'react';
import { useGtdStore, type GTDItem } from '../../../stores/fw-gtd.store';
import { useTwelveWeekStore } from '../../../stores/fw-12wy.store';
import { useParaStore } from '../../../stores/fw-para.store';
import { Play, UserPlus, Clock, Archive, Trash2, FolderGit2, Target, PlusCircle } from 'lucide-react';

export function InboxGate() {
  const { items, addItem, processItem } = useGtdStore();
  const { goals, addTactic } = useTwelveWeekStore();
  const { projects } = useParaStore();
  const [content, setContent] = useState('');

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addItem(content);
    setContent('');
  };

  const handleAction = async (id: string, action: 'completed' | 'delegated' | 'deferred' | 'archived' | 'dropped', reasoning: string) => {
    await processItem(id, { status: action }, reasoning);
  };

  const promoteTo12WYTactic = async (item: GTDItem, targetGoalId: string) => {
    const newTacticId = crypto.randomUUID();
    await addTactic({
      id: newTacticId,
      type: 'wy-tactic',
      title: item.content,
      description: 'Promoted from GTD Inbox Gate',
      goalId: targetGoalId,
      week: 1, // Defaulting to week 1, could be enhanced
      status: 'pending',
      updatedAt: Date.now(),
      createdAt: Date.now()
    });
    await processItem(item.id, { tacticId: newTacticId, goalId: targetGoalId, status: 'completed' }, 'Promoted to 12WY Tactic');
  };

  const routeToParaProject = async (item: GTDItem, projectId: string) => {
    await processItem(item.id, { projectId, status: 'completed' }, 'Routed to PARA Project');
  };


  const inboxItems = items.filter(i => i.status === 'inbox');

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-2xl font-black mb-4 text-blue-400 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Cerritos Inbox Gate
        </h2>
        <form onSubmit={handleCapture} className="flex gap-4">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Capture an idea, task, or thought..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
            Capture
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {inboxItems.length === 0 ? (
          <div className="text-center opacity-50 py-10 bg-black/20 rounded-2xl border border-white/5">
            Inbox Zero Reached (Cerritos is clear)
          </div>
        ) : (
          inboxItems.map(item => (
            <div key={item.id} className="p-5 bg-black/30 border border-white/10 rounded-2xl flex flex-col gap-4">
              <div className="text-lg font-medium text-white">{item.content}</div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
                <span className="text-xs uppercase font-bold text-white/40 mr-2">2-Min Rule:</span>
                <button onClick={() => handleAction(item.id, 'completed', 'Did it immediately (< 2 min)')} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-bold transition-colors">
                  <Play className="w-4 h-4" /> Do
                </button>
                <button onClick={() => handleAction(item.id, 'delegated', 'Delegated to someone else')} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-bold transition-colors">
                  <UserPlus className="w-4 h-4" /> Delegate
                </button>
                <button onClick={() => handleAction(item.id, 'deferred', 'Deferred for later action')} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg text-sm font-bold transition-colors">
                  <Clock className="w-4 h-4" /> Defer
                </button>
                <button onClick={() => handleAction(item.id, 'archived', 'Archived for reference')} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-sm font-bold transition-colors">
                  <Archive className="w-4 h-4" /> Archive
                </button>
                <button onClick={() => handleAction(item.id, 'dropped', 'Dropped/Trashed')} className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-sm font-bold transition-colors">
                  <Trash2 className="w-4 h-4" /> Drop
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
                <span className="text-xs uppercase font-bold text-white/40 mr-2 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Route:
                </span>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      promoteTo12WYTactic(item, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-1.5 bg-white/5 text-white border border-white/10 hover:border-white/20 rounded-lg text-sm outline-none transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>To 12WY Goal Tactic...</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      routeToParaProject(item, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-1.5 bg-white/5 text-white border border-white/10 hover:border-white/20 rounded-lg text-sm outline-none transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>To PARA Project...</option>
                  {projects.filter(p => p.status === 'active').map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
