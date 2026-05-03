import React from 'react';
import { 
  Users, 
  Heart, 
  Truck, 
  Handshake, 
  Zap, 
  Box, 
  Wrench, 
  Banknote, 
  Wallet 
} from 'lucide-react';
import { CanvasData } from '../../types';

interface BusinessModelCanvasProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  logoUrl?: string;
}

interface BmcCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isMain?: boolean;
}

const BmcCell: React.FC<BmcCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "",
  isMain = false
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-6 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 ${
      isFocused 
        ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-100/50 dark:ring-blue-900/20' 
        : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    } hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isFocused || isMain 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-blue-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
            isFocused || isMain ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
          }`}>
            {title}
          </h3>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium transition-colors ${
          isMain ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-600 dark:text-zinc-400'
        }`}
        placeholder="Click to start typing..."
      />
    </div>
  );
};

export const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({
  canvasData,
  setCanvasData,
  logoUrl
}) => {
  const updateField = (field: keyof CanvasData, value: any) => {
    setCanvasData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 md:grid-rows-3 min-h-[800px]">
        {/* Row 1 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2"
          icon={<Handshake className="w-4 h-4" />}
          title="Key Partners"
          subtitle="Who helps us?"
          value={canvasData.keyPartners}
          onChange={(val) => updateField('keyPartners', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Zap className="w-4 h-4" />}
          title="Key Activities"
          subtitle="What do we do?"
          value={canvasData.keyActivities}
          onChange={(val) => updateField('keyActivities', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2 relative"
          isMain
          icon={<Box className="w-4 h-4" />}
          title="Value Propositions"
          subtitle="What is our offer?"
          value={canvasData.valuePropositions}
          onChange={(val) => updateField('valuePropositions', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Heart className="w-4 h-4" />}
          title="Customer Relationships"
          subtitle="How do we interact?"
          value={canvasData.customerRelationships}
          onChange={(val) => updateField('customerRelationships', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2"
          icon={<Users className="w-4 h-4" />}
          title="Customer Segments"
          subtitle="Who is our target?"
          value={canvasData.customerSegments}
          onChange={(val) => updateField('customerSegments', val)}
        />

        {/* Row 2 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Wrench className="w-4 h-4" />}
          title="Key Resources"
          subtitle="What do we need?"
          value={canvasData.keyResources}
          onChange={(val) => updateField('keyResources', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Truck className="w-4 h-4" />}
          title="Channels"
          subtitle="How do we reach them?"
          value={canvasData.channels}
          onChange={(val) => updateField('channels', val)}
        />

        {/* Row 3 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-5"
          icon={<Banknote className="w-4 h-4" />}
          title="Cost Structure"
          subtitle="Where does money go?"
          value={canvasData.costStructure}
          onChange={(val) => updateField('costStructure', val)}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-5"
          icon={<Wallet className="w-4 h-4" />}
          title="Revenue Streams"
          subtitle="How do we earn money?"
          value={canvasData.revenueStreams}
          onChange={(val) => updateField('revenueStreams', val)}
        />
      </div>

      {logoUrl && (
        <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg border border-zinc-100 p-2 flex items-center justify-center overflow-hidden">
          <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="px-8 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center">
        The <span className="font-bold uppercase tracking-tighter">Business Model Canvas (BMC)</span>, developed by Alexander Osterwalder, is released under a Creative Commons Attribution-Share Alike 3.0 Unported License. 
        Source: <a href="https://strategyzer.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">Strategyzer.com</a>.
      </div>
    </div>
  );
};
