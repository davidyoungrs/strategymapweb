import React from 'react';
import { Eye, Search, CreditCard, Heart, Megaphone, ArrowLeft, ArrowRight } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface CustomerJourneyViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface StageCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  stageNumber: number;
  isLast?: boolean;
}

const StageCell: React.FC<StageCellProps> = ({ icon, title, subtitle, value, onChange, stageNumber, isLast = false }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colors = [
    { bg: 'bg-sky-50/50 dark:bg-sky-900/10', ring: 'ring-sky-100/50', icon: 'bg-sky-600', text: 'text-sky-600 dark:text-sky-400', num: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    { bg: 'bg-violet-50/50 dark:bg-violet-900/10', ring: 'ring-violet-100/50', icon: 'bg-violet-600', text: 'text-violet-600 dark:text-violet-400', num: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    { bg: 'bg-emerald-50/50 dark:bg-emerald-900/10', ring: 'ring-emerald-100/50', icon: 'bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', num: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { bg: 'bg-amber-50/50 dark:bg-amber-900/10', ring: 'ring-amber-100/50', icon: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', num: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { bg: 'bg-rose-50/50 dark:bg-rose-900/10', ring: 'ring-rose-100/50', icon: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', num: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  ];

  const c = colors[stageNumber] || colors[0];

  return (
    <div className="flex items-stretch">
      <div className={`flex-1 p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
        isFocused ? `${c.bg} ${c.ring} ring-1` : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isFocused ? `${c.icon} text-white shadow-lg scale-110` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
          }`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${c.num}`}>{stageNumber + 1}</span>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none transition-colors ${
                isFocused ? c.text : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
            </div>
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium"
          placeholder={`Touchpoints, actions & emotions...`}
        />
      </div>
      {!isLast && (
        <div className="flex items-center px-1 text-zinc-200 dark:text-zinc-700">
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export const CustomerJourneyView: React.FC<CustomerJourneyViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const defaults = { awareness: '', consideration: '', purchase: '', retention: '', advocacy: '' };

  const updateJourney = (field: keyof NonNullable<CanvasData['customerJourney']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      customerJourney: { ...(prev.customerJourney || defaults), [field]: value }
    }));
  };

  const cj = canvasData.customerJourney || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Customer Journey Map</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">End-to-End Experience Design</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
          <StageCell stageNumber={0}
            icon={<Eye className="w-4 h-4" />} title="Awareness" subtitle="Discovery & First Impressions"
            value={cj.awareness} onChange={(val) => updateJourney('awareness', val)} />
          <StageCell stageNumber={1}
            icon={<Search className="w-4 h-4" />} title="Consideration" subtitle="Research & Comparison"
            value={cj.consideration} onChange={(val) => updateJourney('consideration', val)} />
          <StageCell stageNumber={2}
            icon={<CreditCard className="w-4 h-4" />} title="Purchase" subtitle="Decision & Conversion"
            value={cj.purchase} onChange={(val) => updateJourney('purchase', val)} />
          <StageCell stageNumber={3}
            icon={<Heart className="w-4 h-4" />} title="Retention" subtitle="Onboarding & Loyalty"
            value={cj.retention} onChange={(val) => updateJourney('retention', val)} />
          <StageCell stageNumber={4} isLast
            icon={<Megaphone className="w-4 h-4" />} title="Advocacy" subtitle="Referrals & Word-of-Mouth"
            value={cj.advocacy} onChange={(val) => updateJourney('advocacy', val)} />
        </div>
      </div>
    </motion.div>
  );
};
