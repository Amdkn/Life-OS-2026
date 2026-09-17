import React, { useState } from 'react';
import { useGtdStore, type GTDItem } from '../../stores/fw-gtd.store';
import { useTwelveWeekStore } from '../../stores/fw-12wy.store';
import { useParaStore } from '../../stores/fw-para.store';
import { GtdDealSwarmPipeline } from '../frameworks/pipelines/GtdDealSwarmPipeline';
import {
  Zap, RotateCcw, ListTodo, ShieldAlert, Target,
  Plus, Trash2
} from 'lucide-react';

export function GtdCerritosPipeline() {
  const { activeTab, setActiveTab } = useGtdStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-white/5 p-4 gap-4 bg-black/20">
        <button onClick={() => setActiveTab('capture' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'capture' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:bg-white/5'}`}>1. Capture (Mariner)</button>
        <button onClick={() => setActiveTab('clarify' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'clarify' ? 'bg-amber-500/20 text-amber-400' : 'text-white/40 hover:bg-white/5'}`}>2. Clarify (Boimler)</button>
        <button onClick={() => setActiveTab('organize' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'organize' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:bg-white/5'}`}>3. Organize (Rutherford)</button>
        <button onClick={() => setActiveTab('reflect' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'reflect' ? 'bg-indigo-500/20 text-indigo-400' : 'text-white/40 hover:bg-white/5'}`}>4. Review (Tendi)</button>
        <button onClick={() => setActiveTab('engage' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'engage' ? 'bg-orange-500/20 text-orange-400' : 'text-white/40 hover:bg-white/5'}`}>5. Engage (Freeman)</button>
        <button onClick={() => setActiveTab('swarm' as any)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'swarm' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:bg-white/5'}`}>Swarm</button>
      </div>

      <div className="flex-1 overflow-auto p-10">
        {activeTab === 'capture' && <CaptureMariner />}
        {activeTab === 'clarify' && <ClarifyBoimler />}
        {activeTab === 'organize' && <OrganizeRutherford />}
        {activeTab === 'reflect' && <ReviewTendi />}
        {activeTab === 'engage' && <EngageFreeman />}
        {activeTab === 'swarm' && <GtdDealSwarmPipeline />}
      </div>
    </div>
  );
}

function CaptureMariner() {
  const { addItem, items } = useGtdStore();
  const [content, setContent] = useState('');

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addItem(content);
    setContent('');
  };

  const inboxItems = items.filter(i => i.status === 'inbox');

  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-2"><Plus /> Capture (Mariner)</h2>
      <form onSubmit={handleCapture} className="flex gap-4 mb-8">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind?..."
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600">Capture</button>
      </form>
      <div className="space-y-2">
        {inboxItems.map(item => (
          <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-white/5">{item.content}</div>
        ))}
      </div>
    </div>
  );
}

function ClarifyBoimler() {
  const { items, processItem, removeItem } = useGtdStore();
  const inboxItems = items.filter(i => i.status === 'inbox');

  if (inboxItems.length === 0) {
    return <div className="text-center opacity-50 py-20">Inbox Zero Reached (Boimler is happy)</div>;
  }

  const activeItem = inboxItems[0];

  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-black mb-6 text-amber-400 flex items-center gap-2"><RotateCcw /> Clarify (Boimler)</h2>
      <div className="bg-black/40 p-8 rounded-2xl border border-white/10">
        <h3 className="text-xl mb-6">{activeItem.content}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => processItem(activeItem.id, { status: 'actionable' }, 'Is Actionable')} className="p-4 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold">Actionable</button>
          <button onClick={() => processItem(activeItem.id, { status: 'incubating' }, 'Incubate')} className="p-4 bg-white/5 hover:bg-blue-500/20 text-blue-400 rounded-xl font-bold">Incubate</button>
          <button onClick={() => processItem(activeItem.id, { status: 'reference' }, 'Reference')} className="p-4 bg-white/5 hover:bg-purple-500/20 text-purple-400 rounded-xl font-bold">Reference</button>
          <button onClick={() => removeItem(activeItem.id)} className="p-4 bg-white/5 hover:bg-rose-500/20 text-rose-400 rounded-xl font-bold">Trash</button>
        </div>
      </div>
    </div>
  );
}

function OrganizeRutherford() {
  const { items, processItem } = useGtdStore();
  const { projects } = useParaStore();
  const { addGoal, addTactic, goals } = useTwelveWeekStore();

  const actionableItems = items.filter(i => i.status === 'actionable');

  const promoteTo12WYGoal = async (item: GTDItem) => {
    const newGoalId = crypto.randomUUID();
    // Default to the first vision if it exists, otherwise just a placeholder to keep the schema compliant
    // Ideally this would be selected via UI
    const defaultVisionId = useTwelveWeekStore.getState().visions?.[0]?.id || 'vision-placeholder';
    await addGoal({
      id: newGoalId,
      type: 'wy-goal',
      title: item.content,
      description: 'Promoted from GTD',
      visionId: defaultVisionId,
      targetWeek: 1,
      status: 'pending',
      updatedAt: Date.now(),
      createdAt: Date.now()
    });
    await processItem(item.id, { goalId: newGoalId, status: 'completed' }, 'Promoted to 12WY Goal');
  };

  const promoteTo12WYTactic = async (item: GTDItem, targetGoalId: string) => {
    const newTacticId = crypto.randomUUID();
    await addTactic({
      id: newTacticId,
      type: 'wy-tactic',
      title: item.content,
      description: 'Promoted from GTD',
      goalId: targetGoalId,
      week: 1,
      status: 'pending',
      updatedAt: Date.now(),
      createdAt: Date.now()
    });
    await processItem(item.id, { tacticId: newTacticId, goalId: targetGoalId, status: 'completed' }, 'Promoted to 12WY Tactic');
  };

  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-black mb-6 text-purple-400 flex items-center gap-2"><ListTodo /> Organize (Rutherford)</h2>
      <div className="space-y-4">
        {actionableItems.map(item => (
          <div key={item.id} className="p-6 bg-black/40 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 text-white">{item.content}</h3>

            <div className="flex flex-wrap gap-4 mt-4 border-t border-white/5 pt-4">
              <button
                onClick={() => promoteTo12WYGoal(item)}
                className="px-4 py-2 bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg text-sm font-bold transition-colors"
              >
                Promote to 12WY Goal
              </button>

              <div className="flex gap-2 items-center">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      promoteTo12WYTactic(item, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Promote to Tactic in Goal...</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        {actionableItems.length === 0 && (
          <div className="text-center opacity-50 py-10">No actionable items to organize.</div>
        )}
      </div>
    </div>
  );
}

function ReviewTendi() {
  const { items } = useGtdStore();
  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-black mb-6 text-indigo-400 flex items-center gap-2"><ShieldAlert /> Review (Tendi)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <div className="text-3xl font-black">{items.filter(i => i.status === 'inbox').length}</div>
          <div className="text-xs uppercase text-white/40 font-bold mt-2">Inbox</div>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <div className="text-3xl font-black text-emerald-400">{items.filter(i => i.status === 'actionable').length}</div>
          <div className="text-xs uppercase text-white/40 font-bold mt-2">Actionable</div>
        </div>
      </div>
    </div>
  );
}

function EngageFreeman() {
  const { items, processItem } = useGtdStore();
  const actionable = items.filter(i => i.status === 'actionable');

  return (
    <div className="animate-in fade-in">
      <h2 className="text-2xl font-black mb-6 text-orange-400 flex items-center gap-2"><Target /> Engage (Freeman)</h2>
      <div className="space-y-4">
        {actionable.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <span>{item.content}</span>
            <button onClick={() => processItem(item.id, { status: 'completed' }, 'Completed')} className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
