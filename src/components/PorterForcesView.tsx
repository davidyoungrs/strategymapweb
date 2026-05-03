import React from 'react';
import { Shield, UserPlus, Repeat, ShoppingCart, Factory, ArrowLeft } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface PorterForcesViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface ForcesCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const ForcesCell: React.FC<ForcesCellProps> = ({ icon, title, subtitle, value, onChange, className = "" }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
      isFocused
        ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 ring-1 ring-red-100/50 dark:ring-red-900/20'
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isFocused
            ? 'bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none scale-110'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
            isFocused ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'
          }`}>{title}</h3>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium"
        placeholder={`Analyze ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const PorterForcesView: React.FC<PorterForcesViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const updateForces = (field: keyof NonNullable<CanvasData['porterForces']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      porterForces: {
        ...(prev.porterForces || { competitiveRivalry: '', threatOfNewEntrants: '', threatOfSubstitutes: '', bargainingPowerOfBuyers: '', bargainingPowerOfSuppliers: '' }),
        [field]: value
      }
    }));
  };

  const forces = canvasData.porterForces || {
    competitiveRivalry: '', threatOfNewEntrants: '', threatOfSubstitutes: '',
    bargainingPowerOfBuyers: '', bargainingPowerOfSuppliers: ''
  };

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Porter's Five Forces</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Competitive Landscape Analysis</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top: Threat of New Entrants */}
        <ForcesCell
          icon={<UserPlus className="w-5 h-5" />}
          title="Threat of New Entrants"
          subtitle="How easy is it to enter the market?"
          value={forces.threatOfNewEntrants}
          onChange={(val) => updateForces('threatOfNewEntrants', val)}
          className="border-b"
        />

        {/* Middle Row: Suppliers | Rivalry | Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ForcesCell
            icon={<Factory className="w-5 h-5" />}
            title="Supplier Power"
            subtitle="How much leverage do suppliers have?"
            value={forces.bargainingPowerOfSuppliers}
            onChange={(val) => updateForces('bargainingPowerOfSuppliers', val)}
            className="md:border-r border-b md:border-b-0"
          />
          <ForcesCell
            icon={<Shield className="w-5 h-5" />}
            title="Competitive Rivalry"
            subtitle="How intense is the competition?"
            value={forces.competitiveRivalry}
            onChange={(val) => updateForces('competitiveRivalry', val)}
            className="md:border-r border-b md:border-b-0"
          />
          <ForcesCell
            icon={<ShoppingCart className="w-5 h-5" />}
            title="Buyer Power"
            subtitle="How much leverage do customers have?"
            value={forces.bargainingPowerOfBuyers}
            onChange={(val) => updateForces('bargainingPowerOfBuyers', val)}
            className="border-b md:border-b-0"
          />
        </div>

        {/* Bottom: Threat of Substitutes */}
        <ForcesCell
          icon={<Repeat className="w-5 h-5" />}
          title="Threat of Substitutes"
          subtitle="What alternatives exist for customers?"
          value={forces.threatOfSubstitutes}
          onChange={(val) => updateForces('threatOfSubstitutes', val)}
          className="border-t"
        />
      </div>
    </motion.div>
  );
};
