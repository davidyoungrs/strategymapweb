import React from 'react';
import { Target, Rocket, Map, Shuffle, ArrowLeft } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface AnsoffMatrixViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface AnsoffCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  riskLevel: string;
  riskColor: string;
}

const AnsoffCell: React.FC<AnsoffCellProps> = ({ icon, title, subtitle, value, onChange, className = "", riskLevel, riskColor }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 min-h-[350px] ${
      isFocused
        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-100/50 dark:ring-blue-900/20'
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
              isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
            }`}>{title}</h3>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${riskColor}`}>
          {riskLevel}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium"
        placeholder={`Plan ${title.toLowerCase()} strategy...`}
      />
    </div>
  );
};

export const AnsoffMatrixView: React.FC<AnsoffMatrixViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const defaults = { marketPenetration: '', productDevelopment: '', marketDevelopment: '', diversification: '' };

  const updateAnsoff = (field: keyof NonNullable<CanvasData['ansoffMatrix']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      ansoffMatrix: { ...(prev.ansoffMatrix || defaults), [field]: value }
    }));
  };

  const am = canvasData.ansoffMatrix || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Ansoff Matrix</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Growth Strategy Framework</p>
        </div>
      </div>

      {/* Axis Labels */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="px-8 py-3 text-center border-r border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Existing Products</span>
          </div>
          <div className="px-8 py-3 text-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">New Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <AnsoffCell
            icon={<Target className="w-5 h-5" />}
            title="Market Penetration"
            subtitle="Existing products → Existing markets"
            value={am.marketPenetration}
            onChange={(val) => updateAnsoff('marketPenetration', val)}
            riskLevel="Low Risk"
            riskColor="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            className="md:border-r border-b"
          />
          <AnsoffCell
            icon={<Rocket className="w-5 h-5" />}
            title="Product Development"
            subtitle="New products → Existing markets"
            value={am.productDevelopment}
            onChange={(val) => updateAnsoff('productDevelopment', val)}
            riskLevel="Medium Risk"
            riskColor="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            className="border-b"
          />
          <AnsoffCell
            icon={<Map className="w-5 h-5" />}
            title="Market Development"
            subtitle="Existing products → New markets"
            value={am.marketDevelopment}
            onChange={(val) => updateAnsoff('marketDevelopment', val)}
            riskLevel="Medium Risk"
            riskColor="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            className="md:border-r"
          />
          <AnsoffCell
            icon={<Shuffle className="w-5 h-5" />}
            title="Diversification"
            subtitle="New products → New markets"
            value={am.diversification}
            onChange={(val) => updateAnsoff('diversification', val)}
            riskLevel="High Risk"
            riskColor="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          />
        </div>
      </div>
    </motion.div>
  );
};
