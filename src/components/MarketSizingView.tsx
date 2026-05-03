import React from 'react';
import { 
  Globe2, 
  Target, 
  Flag,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface MarketSizingViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface SizingCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  description: string;
  onValueChange: (val: string) => void;
  onDescChange: (val: string) => void;
  color: string;
}

const SizingCell: React.FC<SizingCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  description, 
  onValueChange, 
  onDescChange,
  color 
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colorVariants: Record<string, any> = {
    blue: { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-600', icon: 'bg-blue-600', shadow: 'shadow-blue-100' },
    indigo: { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-600', icon: 'bg-indigo-600', shadow: 'shadow-indigo-100' },
    violet: { bg: 'bg-violet-50/50', border: 'border-violet-100', text: 'text-violet-600', icon: 'bg-violet-600', shadow: 'shadow-violet-100' },
  };

  const cv = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`p-6 border border-zinc-100 dark:border-zinc-800 rounded-3xl transition-all duration-300 ${
      isFocused 
        ? `${cv.bg} dark:bg-zinc-900/40 ${cv.border} dark:border-zinc-700 ring-1 ring-zinc-100 dark:ring-zinc-800` 
        : 'bg-white dark:bg-zinc-950 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isFocused ? `${cv.icon} text-white shadow-lg` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isFocused ? cv.text : 'text-zinc-900 dark:text-zinc-100'}`}>{title}</h3>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
        <div className={`flex items-center gap-1 px-4 py-2 rounded-xl border ${isFocused ? cv.border : 'border-zinc-100 dark:border-zinc-800'} bg-white dark:bg-zinc-900`}>
          <DollarSign className="w-3 h-3 text-zinc-400" />
          <input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0.00"
            className="w-24 bg-transparent outline-none text-sm font-black text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
          />
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Describe your ${title}...`}
        className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium h-24"
      />
    </div>
  );
};

export const MarketSizingView: React.FC<MarketSizingViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const updateMarket = (field: keyof NonNullable<CanvasData['marketSizing']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      marketSizing: {
        ...(prev.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' }),
        [field]: value
      }
    }));
  };

  const market = canvasData.marketSizing || { 
    tam: '', sam: '', som: '', 
    tamDescription: '', samDescription: '', somDescription: '' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Market Sizing</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">TAM • SAM • SOM Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visualization Side */}
        <div className="lg:col-span-5 flex justify-center py-12 lg:sticky lg:top-8">
          <div className="relative w-80 h-80">
            {/* TAM Circle */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 flex items-start justify-center pt-8"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">TAM</span>
            </motion.div>
            {/* SAM Circle */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute inset-[15%] rounded-full bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-start justify-center pt-8 shadow-inner"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">SAM</span>
            </motion.div>
            {/* SOM Circle */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-[30%] rounded-full bg-violet-600 shadow-xl flex items-center justify-center text-white"
            >
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Your Market</span>
                <p className="text-lg font-black tracking-tighter mt-1 italic">SOM</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Inputs Side */}
        <div className="lg:col-span-7 space-y-6">
          <SizingCell
            icon={<Globe2 className="w-6 h-6" />}
            title="Total Addressable Market"
            subtitle="TAM • The global opportunity"
            value={market.tam}
            description={market.tamDescription}
            onValueChange={(v) => updateMarket('tam', v)}
            onDescChange={(v) => updateMarket('tamDescription', v)}
            color="blue"
          />
          <SizingCell
            icon={<Target className="w-6 h-6" />}
            title="Serviceable Addressable Market"
            subtitle="SAM • Market segment you can reach"
            value={market.sam}
            description={market.samDescription}
            onValueChange={(v) => updateMarket('sam', v)}
            onDescChange={(v) => updateMarket('samDescription', v)}
            color="indigo"
          />
          <SizingCell
            icon={<Flag className="w-6 h-6" />}
            title="Serviceable Obtainable Market"
            subtitle="SOM • Target you will realistically capture"
            value={market.som}
            description={market.somDescription}
            onValueChange={(v) => updateMarket('som', v)}
            onDescChange={(v) => updateMarket('somDescription', v)}
            color="violet"
          />
        </div>
      </div>
    </motion.div>
  );
};
