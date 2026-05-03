import React from 'react';
import { 
  Gavel, 
  TrendingUp, 
  Users, 
  Cpu, 
  Leaf, 
  Scale,
  ArrowLeft
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface PestelViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface PestelCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  color: string;
}

const PestelCell: React.FC<PestelCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "",
  color
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
      isFocused 
        ? `bg-${color}-50/50 dark:bg-${color}-900/10 border-${color}-100 dark:border-${color}-900/30 ring-1 ring-${color}-100/50 dark:ring-${color}-900/20` 
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isFocused 
            ? `bg-${color}-600 text-white shadow-lg shadow-${color}-200 dark:shadow-none scale-110` 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
            isFocused ? `text-${color}-600 dark:text-${color}-400` : 'text-zinc-900 dark:text-zinc-100'
          }`}>
            {title}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium transition-colors"
        placeholder={`Analyze ${title.toLowerCase()} factors...`}
      />
    </div>
  );
};

export const PestelView: React.FC<PestelViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const updatePestel = (field: keyof NonNullable<CanvasData['pestel']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      pestel: {
        ...(prev.pestel || { political: '', economic: '', social: '', technological: '', environmental: '', legal: '' }),
        [field]: value
      }
    }));
  };

  const pestel = canvasData.pestel || { 
    political: '', 
    economic: '', 
    social: '', 
    technological: '', 
    environmental: '', 
    legal: '' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
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
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">PESTEL Analysis</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">External Environment Audit</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-[700px]">
        <PestelCell
          icon={<Gavel className="w-5 h-5" />}
          title="Political"
          subtitle="Government & Policy"
          value={pestel.political}
          color="blue"
          onChange={(val) => updatePestel('political', val)}
          className="border-b md:border-r"
        />
        <PestelCell
          icon={<TrendingUp className="w-5 h-5" />}
          title="Economic"
          subtitle="Markets & Growth"
          value={pestel.economic}
          color="emerald"
          onChange={(val) => updatePestel('economic', val)}
          className="border-b lg:border-r"
        />
        <PestelCell
          icon={<Users className="w-5 h-5" />}
          title="Social"
          subtitle="Demographics & Trends"
          value={pestel.social}
          color="violet"
          onChange={(val) => updatePestel('social', val)}
          className="border-b md:border-r lg:border-r-0"
        />
        <PestelCell
          icon={<Cpu className="w-5 h-5" />}
          title="Technological"
          subtitle="Innovation & R&D"
          value={pestel.technological}
          color="amber"
          onChange={(val) => updatePestel('technological', val)}
          className="border-b md:border-b-0 md:border-r lg:border-b-0 lg:border-r"
        />
        <PestelCell
          icon={<Leaf className="w-5 h-5" />}
          title="Environmental"
          subtitle="Sustainability & Climate"
          value={pestel.environmental}
          color="green"
          onChange={(val) => updatePestel('environmental', val)}
          className="border-b md:border-b-0 lg:border-b-0 lg:border-r"
        />
        <PestelCell
          icon={<Scale className="w-5 h-5" />}
          title="Legal"
          subtitle="Laws & Regulations"
          value={pestel.legal}
          color="zinc"
          onChange={(val) => updatePestel('legal', val)}
          className=""
        />
      </div>
    </motion.div>
  );
};
