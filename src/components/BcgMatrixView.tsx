import React from 'react';
import { Star, Coins, HelpCircle, Dog, ArrowLeft } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface BcgMatrixViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface BcgCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  accentColor: string;
  strategy: string;
}

const BcgCell: React.FC<BcgCellProps> = ({ icon, title, subtitle, value, onChange, className = "", accentColor, strategy }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colorMap: Record<string, { bg: string, ring: string, iconBg: string, text: string, badge: string }> = {
    amber: {
      bg: 'bg-amber-50/50 dark:bg-amber-900/10', ring: 'ring-amber-100/50 dark:ring-amber-900/20',
      iconBg: 'bg-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-none',
      text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    },
    green: {
      bg: 'bg-green-50/50 dark:bg-green-900/10', ring: 'ring-green-100/50 dark:ring-green-900/20',
      iconBg: 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none',
      text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    },
    violet: {
      bg: 'bg-violet-50/50 dark:bg-violet-900/10', ring: 'ring-violet-100/50 dark:ring-violet-900/20',
      iconBg: 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none',
      text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
    },
    zinc: {
      bg: 'bg-zinc-50/50 dark:bg-zinc-900/10', ring: 'ring-zinc-200/50 dark:ring-zinc-800/20',
      iconBg: 'bg-zinc-600 text-white shadow-lg shadow-zinc-200 dark:shadow-none',
      text: 'text-zinc-600 dark:text-zinc-400', badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
  };

  const colors = colorMap[accentColor] || colorMap.zinc;

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 min-h-[350px] ${
      isFocused
        ? `${colors.bg} border-transparent ${colors.ring} ring-1`
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? `${colors.iconBg} scale-110`
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
              isFocused ? colors.text : 'text-zinc-900 dark:text-zinc-100'
            }`}>{title}</h3>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colors.badge}`}>
          {strategy}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium"
        placeholder={`List your ${title.toLowerCase()} products...`}
      />
    </div>
  );
};

export const BcgMatrixView: React.FC<BcgMatrixViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const defaults = { stars: '', cashCows: '', questionMarks: '', dogs: '' };

  const updateBcg = (field: keyof NonNullable<CanvasData['bcgMatrix']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      bcgMatrix: { ...(prev.bcgMatrix || defaults), [field]: value }
    }));
  };

  const bcg = canvasData.bcgMatrix || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">BCG Matrix</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Product Portfolio Management</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="px-8 py-3 text-center border-r border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">High Market Share</span>
          </div>
          <div className="px-8 py-3 text-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Low Market Share</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <BcgCell
            icon={<Star className="w-5 h-5" />}
            title="Stars"
            subtitle="High growth, high share"
            value={bcg.stars}
            onChange={(val) => updateBcg('stars', val)}
            accentColor="amber"
            strategy="Invest"
            className="md:border-r border-b"
          />
          <BcgCell
            icon={<HelpCircle className="w-5 h-5" />}
            title="Question Marks"
            subtitle="High growth, low share"
            value={bcg.questionMarks}
            onChange={(val) => updateBcg('questionMarks', val)}
            accentColor="violet"
            strategy="Analyze"
            className="border-b"
          />
          <BcgCell
            icon={<Coins className="w-5 h-5" />}
            title="Cash Cows"
            subtitle="Low growth, high share"
            value={bcg.cashCows}
            onChange={(val) => updateBcg('cashCows', val)}
            accentColor="green"
            strategy="Harvest"
            className="md:border-r"
          />
          <BcgCell
            icon={<Dog className="w-5 h-5" />}
            title="Dogs"
            subtitle="Low growth, low share"
            value={bcg.dogs}
            onChange={(val) => updateBcg('dogs', val)}
            accentColor="zinc"
            strategy="Divest"
          />
        </div>
      </div>
    </motion.div>
  );
};
