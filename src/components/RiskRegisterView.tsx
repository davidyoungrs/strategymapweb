import React from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { CanvasData, RiskRegisterItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface RiskRegisterViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

const TypeBadge: React.FC<{ 
  type: 'Risk' | 'Opportunity', 
  onClick: () => void 
}> = ({ type, onClick }) => {
  const colors = {
    Risk: 'bg-rose-500 text-white border-rose-600 shadow-rose-100',
    Opportunity: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-100'
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 shadow-lg ${colors[type]}`}
    >
      {type}
    </button>
  );
};

const LevelBadge: React.FC<{ 
  level: 'Low' | 'Medium' | 'High', 
  type: 'Risk' | 'Opportunity',
  onClick: () => void 
}> = ({ level, type, onClick }) => {
  const colors = type === 'Risk' ? {
    Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    High: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800'
  } : {
    Low: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    Medium: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    High: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700'
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${colors[level]}`}
    >
      {level}
    </button>
  );
};

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const risks = canvasData.riskRegister || [];

  const addRow = () => {
    const newRisk: RiskRegisterItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Risk',
      risk: '',
      probability: 'Medium',
      impact: 'Medium',
      mitigation: ''
    };
    setCanvasData(prev => ({
      ...prev,
      riskRegister: [...(prev.riskRegister || []), newRisk]
    }));
  };

  const removeRow = (id: string) => {
    setCanvasData(prev => ({
      ...prev,
      riskRegister: (prev.riskRegister || []).filter(r => r.id !== id)
    }));
  };

  const updateRow = (id: string, updates: Partial<RiskRegisterItem>) => {
    setCanvasData(prev => ({
      ...prev,
      riskRegister: (prev.riskRegister || []).map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const toggleLevel = (id: string, field: 'probability' | 'impact') => {
    const levels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const current = risks.find(r => r.id === id)?.[field] || 'Medium';
    const next = levels[(levels.indexOf(current) + 1) % 3];
    updateRow(id, { [field]: next });
  };

  const toggleType = (id: string) => {
    const current = risks.find(r => r.id === id)?.type || 'Risk';
    const next = current === 'Risk' ? 'Opportunity' : 'Risk';
    updateRow(id, { type: next });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Risk & Opportunity Register</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Identify Threats • Capture Potential</p>
          </div>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-32 text-center">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-32 text-center">Probability</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-32 text-center">Impact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Action / Response Strategy</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <AnimatePresence initial={false}>
                {risks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-zinc-400">
                        <AlertTriangle className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-medium">No items identified yet. Click "Add Item" to start.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  risks.map((risk) => (
                    <motion.tr 
                      key={risk.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">
                        <TypeBadge 
                          type={risk.type} 
                          onClick={() => toggleType(risk.id)} 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={risk.risk}
                          onChange={(e) => updateRow(risk.id, { risk: e.target.value })}
                          placeholder={risk.type === 'Risk' ? "Potential threat..." : "Market opportunity..."}
                          className="w-full bg-transparent border-none outline-none resize-none text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <LevelBadge 
                          level={risk.probability} 
                          type={risk.type}
                          onClick={() => toggleLevel(risk.id, 'probability')} 
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <LevelBadge 
                          level={risk.impact} 
                          type={risk.type}
                          onClick={() => toggleLevel(risk.id, 'impact')} 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={risk.mitigation}
                          onChange={(e) => updateRow(risk.id, { mitigation: e.target.value })}
                          placeholder={risk.type === 'Risk' ? "Mitigation plan..." : "Capture strategy..."}
                          className={`w-full bg-transparent border-none outline-none resize-none text-sm font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-800 italic ${
                            risk.type === 'Risk' ? 'text-zinc-600 dark:text-zinc-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeRow(risk.id)}
                          className="p-2 text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-3xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100 uppercase tracking-tight">Threat Mitigation</h4>
              <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 leading-relaxed font-medium">
                Identify high-probability risks early. Focus on those with "High" impact and develop clear contingency plans.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-3xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Value Capture</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed font-medium">
                Opportunities are potential value multipliers. Rank them by "Impact" to prioritize where to invest your resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
