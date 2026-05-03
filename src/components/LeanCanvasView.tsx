import React from 'react';
import {
  AlertTriangle, Lightbulb, Diamond, ShieldCheck, Users, BarChart3, Truck, Banknote, Wallet, ArrowLeft
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface LeanCanvasViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface LeanCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isMain?: boolean;
}

const LeanCell: React.FC<LeanCellProps> = ({ icon, title, subtitle, value, onChange, className = "", isMain = false }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
      isFocused
        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 ring-1 ring-indigo-100/50 dark:ring-indigo-900/20'
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isFocused || isMain
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-indigo-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
            isFocused || isMain ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-100'
          }`}>{title}</h3>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium ${
          isMain ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-600 dark:text-zinc-400'
        }`}
        placeholder={`Define ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const LeanCanvasView: React.FC<LeanCanvasViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const defaults = {
    problem: '', solution: '', uniqueValueProposition: '', unfairAdvantage: '',
    lcCustomerSegments: '', keyMetrics: '', lcChannels: '', lcCostStructure: '', lcRevenueStreams: ''
  };

  const updateLean = (field: keyof NonNullable<CanvasData['leanCanvas']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      leanCanvas: { ...(prev.leanCanvas || defaults), [field]: value }
    }));
  };

  const lc = canvasData.leanCanvas || defaults;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Lean Canvas</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Startup Business Model</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 md:grid-rows-3 min-h-[800px]">
          {/* Row 1 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2"
            icon={<AlertTriangle className="w-4 h-4" />} title="Problem" subtitle="Top 3 problems"
            value={lc.problem} onChange={(val) => updateLean('problem', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<Lightbulb className="w-4 h-4" />} title="Solution" subtitle="Top 3 features"
            value={lc.solution} onChange={(val) => updateLean('solution', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2" isMain
            icon={<Diamond className="w-4 h-4" />} title="Unique Value" subtitle="What makes you different?"
            value={lc.uniqueValueProposition} onChange={(val) => updateLean('uniqueValueProposition', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<ShieldCheck className="w-4 h-4" />} title="Unfair Advantage" subtitle="Can't be copied"
            value={lc.unfairAdvantage} onChange={(val) => updateLean('unfairAdvantage', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2"
            icon={<Users className="w-4 h-4" />} title="Customer Segments" subtitle="Target customers"
            value={lc.lcCustomerSegments} onChange={(val) => updateLean('lcCustomerSegments', val)} />

          {/* Row 2 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<BarChart3 className="w-4 h-4" />} title="Key Metrics" subtitle="Measurable KPIs"
            value={lc.keyMetrics} onChange={(val) => updateLean('keyMetrics', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<Truck className="w-4 h-4" />} title="Channels" subtitle="Path to customers"
            value={lc.lcChannels} onChange={(val) => updateLean('lcChannels', val)} />

          {/* Row 3 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-5"
            icon={<Banknote className="w-4 h-4" />} title="Cost Structure" subtitle="Fixed & variable costs"
            value={lc.lcCostStructure} onChange={(val) => updateLean('lcCostStructure', val)} />
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-5"
            icon={<Wallet className="w-4 h-4" />} title="Revenue Streams" subtitle="Revenue model"
            value={lc.lcRevenueStreams} onChange={(val) => updateLean('lcRevenueStreams', val)} />
        </div>

        <div className="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
          The <span className="font-bold uppercase tracking-tighter">Lean Canvas</span> was adapted by Ash Maurya from the Business Model Canvas by Alexander Osterwalder.
          Source: <a href="https://leanstack.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-colors">LeanStack.com</a>.
        </div>
      </div>
    </motion.div>
  );
};
