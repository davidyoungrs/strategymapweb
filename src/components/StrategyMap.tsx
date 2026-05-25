import React from 'react';
import { StrategyMapData, StrategyObjective, CanvasData } from '../types';
import { Plus, Trash2, ArrowUp, ChevronDown, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StrategyMapProps {
  data: StrategyMapData;
  onChange: (data: StrategyMapData) => void;
  projectTitle: string;
  onTitleChange: (title: string) => void;
  userCanvases: CanvasData[];
  onSelectCanvas: (canvas: CanvasData) => void;
}

type PerspectiveKey = 'financial' | 'customer' | 'internal' | 'learning';

export const StrategyMap: React.FC<StrategyMapProps> = ({ 
  data, 
  onChange, 
  projectTitle, 
  onTitleChange,
  userCanvases,
  onSelectCanvas
}) => {
  const perspectives: { key: PerspectiveKey; label: string; color: string }[] = [
    { key: 'financial', label: 'Financial', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' },
    { key: 'customer', label: 'Customer', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100' },
    { key: 'internal', label: 'Internal Process', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100' },
    { key: 'learning', label: 'Learning & Growth', color: 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100' },
  ];

  const addObjective = (perspective: PerspectiveKey) => {
    const newObjective: StrategyObjective = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Objective',
    };
    onChange({
      ...data,
      [perspective]: [...(data[perspective] || []), newObjective],
    });
  };

  const updateObjective = (perspective: PerspectiveKey, id: string, text: string) => {
    onChange({
      ...data,
      [perspective]: (data[perspective] || []).map((obj) => (obj.id === id ? { ...obj, text } : obj)),
    });
  };

  const removeObjective = (perspective: PerspectiveKey, id: string) => {
    onChange({
      ...data,
      [perspective]: (data[perspective] || []).filter((obj) => obj.id !== id),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-start gap-8">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">Strategic Framework</span>
          <div className="relative group max-w-xl">
            <input 
              type="text"
              value={projectTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none focus:ring-0 p-0 w-full uppercase"
              placeholder="Project Title"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <select 
                className="absolute right-0 top-0 opacity-0 cursor-pointer w-8 h-8"
                onChange={(e) => {
                  const selected = userCanvases.find(c => c.id === e.target.value);
                  if (selected) onSelectCanvas(selected);
                }}
                value=""
              >
                <option value="" disabled>Select Plan</option>
                {userCanvases.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          <input 
            type="text"
            value={data.title || 'Strategy Map'}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-full mt-2"
            placeholder="Map Subtitle"
          />
        </div>
    </div>
    
    <div className="flex flex-col gap-8 relative">
      {/* Visual Causality Line */}
      <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-500/20 via-blue-500/20 to-zinc-500/20 -translate-x-1/2 hidden md:block" />


      <div className="flex flex-col gap-4">
        {perspectives.map((p, idx) => (
          <motion.div 
            key={p.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn("relative p-8 rounded-[2rem] border-2 transition-all shadow-sm", p.color)}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center border border-current/10">
                  <Activity className="w-4 h-4 opacity-70" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">{p.label}</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addObjective(p.key)}
                className="p-2 hover:bg-white/50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors border border-current/10"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <AnimatePresence mode="popLayout">
                {data[p.key].map((obj) => (
                  <motion.div 
                    key={obj.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="group relative flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200/50 dark:border-zinc-800/50 min-w-[200px] max-w-[260px] hover:border-blue-500/50 transition-colors"
                  >
                    <textarea
                      value={obj.text}
                      onChange={(e) => updateObjective(p.key, obj.id, e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold resize-none overflow-hidden leading-tight p-0 text-zinc-800 dark:text-zinc-200"
                      rows={2}
                    />
                    <button
                      onClick={() => removeObjective(p.key, obj.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 active:scale-90"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {data[p.key].length === 0 && (
                <div className="text-xs font-bold uppercase tracking-widest opacity-30 py-8">No objectives defined</div>
              )}
            </div>
            
            {p.key !== 'financial' && (
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
              >
                <div className="bg-white dark:bg-zinc-900 p-2 rounded-full border-2 border-zinc-100 dark:border-zinc-800 shadow-xl">
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
      
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">How it works</h4>
        <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed">
          The Strategy Map visualizes your strategic objectives across four key perspectives. 
          The arrows represent the causal links: <strong>Learning & Growth</strong> drives <strong>Internal Processes</strong>, 
          which improves the <strong>Customer</strong> experience, ultimately leading to <strong>Financial</strong> success.
        </p>
      </div>
    </div>
  );
};
