import React, { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { useParaStore, type Project } from '../../../stores/fw-para.store';
import { useIkigaiStore } from '../../../stores/fw-ikigai.store';
import { DOMAIN_TO_LD } from '../../../utils/paraAdapter';
import { writeToLD } from '../../../lib/ld-router';

export function VisionAligner({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const allVisions = useIkigaiStore(s => s.visions);
  const currentVision = allVisions.find(v => v.id === project.ikigaiVisionId);
  const updateProject = useParaStore(s => s.updateProject);

  const handleAlign = async (visionId: string) => {
    // Si clique sur celui déjà actif, on annule
    const newId = visionId === project.ikigaiVisionId ? undefined : visionId;
    await updateProject(project.id, { ikigaiVisionId: newId });
    setIsOpen(false);
  };

  return (
    <div className="relative mt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-amber-500 transition-colors shadow-sm"
      >
        <Eye className="w-3 h-3" />
        {currentVision ? `Aligned: ${currentVision.title}` : 'Align to Ikigai'}
        <ChevronDown className={`w-3 h-3 opacity-50 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
           <h5 className="text-[8px] uppercase tracking-widest text-white/30 px-2 py-1 mb-1 font-bold">Select Vision Node</h5>
           <div className="max-h-40 overflow-auto custom-scrollbar">
             {allVisions.map(v => (
               <button 
                 key={v.id} 
                 onClick={() => handleAlign(v.id)}
                 className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 truncate transition-colors ${v.id === currentVision?.id ? 'text-amber-500 font-bold bg-amber-500/5' : 'text-white/60'}`}
               >
                 [{v.horizon}] {v.title}
               </button>
             ))}
             {allVisions.length === 0 && (
               <div className="px-2 py-4 text-center">
                 <span className="text-[10px] text-white/20 italic">No visions found in protocol.</span>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
