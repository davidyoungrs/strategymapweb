import React from 'react';
import { 
  Package, Settings, Truck, Megaphone, HeadphonesIcon,
  Building2, Users, Cpu, ShoppingBag, ArrowLeft
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface ValueChainViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface ChainCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isPrimary?: boolean;
}

const ChainCell: React.FC<ChainCellProps> = ({ icon, title, subtitle, value, onChange, className = "", isPrimary = true }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const accentColor = isPrimary ? 'teal' : 'violet';

  return (
    <div className={`p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
      isFocused
        ? isPrimary 
          ? 'bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30 ring-1 ring-teal-100/50 dark:ring-teal-900/20'
          : 'bg-violet-50/50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/30 ring-1 ring-violet-100/50 dark:ring-violet-900/20'
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isFocused
            ? isPrimary
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-none scale-110'
              : 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none scale-110'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
            isFocused 
              ? isPrimary ? 'text-teal-600 dark:text-teal-400' : 'text-violet-600 dark:text-violet-400'
              : 'text-zinc-900 dark:text-zinc-100'
          }`}>{title}</h3>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium"
        placeholder={`Describe ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const ValueChainView: React.FC<ValueChainViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const defaults = {
    inboundLogistics: '', operations: '', outboundLogistics: '', marketingSales: '', service: '',
    firmInfrastructure: '', hrManagement: '', technologyDevelopment: '', procurement: ''
  };

  const updateChain = (field: keyof NonNullable<CanvasData['valueChain']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      valueChain: { ...(prev.valueChain || defaults), [field]: value }
    }));
  };

  const vc = canvasData.valueChain || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Value Chain Analysis</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Where Value Is Created</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Support Activities */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="px-8 py-3 bg-violet-50/50 dark:bg-violet-900/5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.3em]">Support Activities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <ChainCell isPrimary={false}
              icon={<Building2 className="w-4 h-4" />} title="Firm Infrastructure" subtitle="Management & Finance"
              value={vc.firmInfrastructure} onChange={(val) => updateChain('firmInfrastructure', val)}
              className="md:border-r border-b lg:border-b-0"
            />
            <ChainCell isPrimary={false}
              icon={<Users className="w-4 h-4" />} title="HR Management" subtitle="Recruiting & Training"
              value={vc.hrManagement} onChange={(val) => updateChain('hrManagement', val)}
              className="border-b lg:border-b-0 lg:border-r"
            />
            <ChainCell isPrimary={false}
              icon={<Cpu className="w-4 h-4" />} title="Technology Dev" subtitle="R&D & Innovation"
              value={vc.technologyDevelopment} onChange={(val) => updateChain('technologyDevelopment', val)}
              className="md:border-r border-b lg:border-b-0"
            />
            <ChainCell isPrimary={false}
              icon={<ShoppingBag className="w-4 h-4" />} title="Procurement" subtitle="Purchasing & Sourcing"
              value={vc.procurement} onChange={(val) => updateChain('procurement', val)}
              className="border-b lg:border-b-0"
            />
          </div>
        </div>

        {/* Primary Activities */}
        <div>
          <div className="px-8 py-3 bg-teal-50/50 dark:bg-teal-900/5 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.3em]">Primary Activities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 min-h-[350px]">
            <ChainCell
              icon={<Package className="w-4 h-4" />} title="Inbound Logistics" subtitle="Receiving & Storage"
              value={vc.inboundLogistics} onChange={(val) => updateChain('inboundLogistics', val)}
              className="md:border-r border-b md:border-b-0"
            />
            <ChainCell
              icon={<Settings className="w-4 h-4" />} title="Operations" subtitle="Production & Assembly"
              value={vc.operations} onChange={(val) => updateChain('operations', val)}
              className="md:border-r border-b md:border-b-0"
            />
            <ChainCell
              icon={<Truck className="w-4 h-4" />} title="Outbound Logistics" subtitle="Distribution & Delivery"
              value={vc.outboundLogistics} onChange={(val) => updateChain('outboundLogistics', val)}
              className="md:border-r border-b md:border-b-0"
            />
            <ChainCell
              icon={<Megaphone className="w-4 h-4" />} title="Marketing & Sales" subtitle="Promotion & Pricing"
              value={vc.marketingSales} onChange={(val) => updateChain('marketingSales', val)}
              className="md:border-r border-b md:border-b-0"
            />
            <ChainCell
              icon={<HeadphonesIcon className="w-4 h-4" />} title="Service" subtitle="After-Sales Support"
              value={vc.service} onChange={(val) => updateChain('service', val)}
            />
          </div>
        </div>

        <div className="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
          The <span className="font-bold uppercase tracking-tighter">Value Chain</span> model was developed by Michael E. Porter in "Competitive Advantage" (1985).
        </div>
      </div>
    </motion.div>
  );
};
