import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, Settings, Truck, Megaphone, HeadphonesIcon,
  Building2, Users, Cpu, ShoppingBag, ArrowLeft, Mic, MicOff
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { VALUE_CHAIN_GUIDANCE, TooltipContent } from '../utils/guidance';

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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const ChainCell: React.FC<ChainCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "", 
  isPrimary = true,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 ${
      isFocused
        ? isPrimary 
          ? 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/50 dark:border-teal-400/40 ring-2 ring-teal-500/20 dark:ring-teal-400/10 shadow-lg shadow-teal-500/5'
          : 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/50 dark:border-violet-400/40 ring-2 ring-violet-500/20 dark:ring-violet-400/10 shadow-lg shadow-violet-500/5'
        : isPrimary
          ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-teal-500/5 dark:hover:shadow-teal-400/5 hover:border-teal-500/30 dark:hover:border-teal-400/30'
          : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-500/5 dark:hover:shadow-violet-400/5 hover:border-violet-500/30 dark:hover:border-violet-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused 
                  ? isPrimary ? 'text-teal-600 dark:text-teal-400' : 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
              {tooltipContent && <Tooltip content={tooltipContent} />}
            </div>
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>

        {isSupported && (
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-1 rounded-md transition-all duration-300 flex items-center justify-center ${
              isListening
                ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title={isListening ? `Stop recording ${title.toLowerCase()}` : `Start voice-to-text for ${title.toLowerCase()}`}
          >
            {isListening ? (
              <MicOff className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        placeholder={`Describe ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const ValueChainView: React.FC<ValueChainViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['valueChain']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['valueChain']> | null>(null);
  const initialTextRef = useRef('');
  const canvasDataRef = useRef(canvasData);
  const setCanvasDataRef = useRef(setCanvasData);

  useEffect(() => {
    canvasDataRef.current = canvasData;
    setCanvasDataRef.current = setCanvasData;
  }, [canvasData, setCanvasData]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            sessionTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        const cleanSessionTranscript = sessionTranscript.trim();
        const currentActiveField = activeListeningFieldRef.current;
        if (cleanSessionTranscript && currentActiveField) {
          const baseText = initialTextRef.current.trim();
          const formattedTranscript = `- ${cleanSessionTranscript}`;
          const updatedValue = baseText 
            ? `${baseText}\n${formattedTranscript}` 
            : formattedTranscript;
          
          setCanvasDataRef.current(prev => ({
            ...prev,
            valueChain: {
              ...(prev.valueChain || { inboundLogistics: '', operations: '', outboundLogistics: '', marketingSales: '', service: '', firmInfrastructure: '', hrManagement: '', technologyDevelopment: '', procurement: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Value Chain:', event.error);
        }
        setActiveField(null);
        activeListeningFieldRef.current = null;
      };

      recognition.onend = () => {
        setActiveField(null);
        activeListeningFieldRef.current = null;
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = (field: keyof NonNullable<CanvasData['valueChain']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentChain = canvasDataRef.current.valueChain || { inboundLogistics: '', operations: '', outboundLogistics: '', marketingSales: '', service: '', firmInfrastructure: '', hrManagement: '', technologyDevelopment: '', procurement: '' };
    initialTextRef.current = currentChain[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Value Chain:', error);
      setActiveField(null);
    }
  };

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

      <div className="space-y-8">
        {/* Support Activities */}
        <div className="space-y-4">
          <div className="px-6 py-2.5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl inline-block">
            <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.3em]">Support Activities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <ChainCell isPrimary={false}
              icon={<Building2 className="w-4 h-4" />} title="Firm Infrastructure" subtitle="Management & Finance"
              value={vc.firmInfrastructure} onChange={(val) => updateChain('firmInfrastructure', val)}
              isSupported={isSupported} isListening={activeField === 'firmInfrastructure'} onToggleListening={() => toggleListening('firmInfrastructure')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.firmInfrastructure}
            />
            <ChainCell isPrimary={false}
              icon={<Users className="w-4 h-4" />} title="HR Management" subtitle="Recruiting & Training"
              value={vc.hrManagement} onChange={(val) => updateChain('hrManagement', val)}
              isSupported={isSupported} isListening={activeField === 'hrManagement'} onToggleListening={() => toggleListening('hrManagement')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.hrManagement}
            />
            <ChainCell isPrimary={false}
              icon={<Cpu className="w-4 h-4" />} title="Technology Dev" subtitle="R&D & Innovation"
              value={vc.technologyDevelopment} onChange={(val) => updateChain('technologyDevelopment', val)}
              isSupported={isSupported} isListening={activeField === 'technologyDevelopment'} onToggleListening={() => toggleListening('technologyDevelopment')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.technologyDevelopment}
            />
            <ChainCell isPrimary={false}
              icon={<ShoppingBag className="w-4 h-4" />} title="Procurement" subtitle="Purchasing & Sourcing"
              value={vc.procurement} onChange={(val) => updateChain('procurement', val)}
              isSupported={isSupported} isListening={activeField === 'procurement'} onToggleListening={() => toggleListening('procurement')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.procurement}
            />
          </div>
        </div>

        {/* Primary Activities */}
        <div className="space-y-4">
          <div className="px-6 py-2.5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl inline-block">
            <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.3em]">Primary Activities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 min-h-[350px]">
            <ChainCell
              icon={<Package className="w-4 h-4" />} title="Inbound Logistics" subtitle="Receiving & Storage"
              value={vc.inboundLogistics} onChange={(val) => updateChain('inboundLogistics', val)}
              isSupported={isSupported} isListening={activeField === 'inboundLogistics'} onToggleListening={() => toggleListening('inboundLogistics')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.inboundLogistics}
            />
            <ChainCell
              icon={<Settings className="w-4 h-4" />} title="Operations" subtitle="Production & Assembly"
              value={vc.operations} onChange={(val) => updateChain('operations', val)}
              isSupported={isSupported} isListening={activeField === 'operations'} onToggleListening={() => toggleListening('operations')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.operations}
            />
            <ChainCell
              icon={<Truck className="w-4 h-4" />} title="Outbound Logistics" subtitle="Distribution & Delivery"
              value={vc.outboundLogistics} onChange={(val) => updateChain('outboundLogistics', val)}
              isSupported={isSupported} isListening={activeField === 'outboundLogistics'} onToggleListening={() => toggleListening('outboundLogistics')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.outboundLogistics}
            />
            <ChainCell
              icon={<Megaphone className="w-4 h-4" />} title="Marketing & Sales" subtitle="Promotion & Pricing"
              value={vc.marketingSales} onChange={(val) => updateChain('marketingSales', val)}
              isSupported={isSupported} isListening={activeField === 'marketingSales'} onToggleListening={() => toggleListening('marketingSales')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.marketingSales}
            />
            <ChainCell
              icon={<HeadphonesIcon className="w-4 h-4" />} title="Service" subtitle="After-Sales Support"
              value={vc.service} onChange={(val) => updateChain('service', val)}
              isSupported={isSupported} isListening={activeField === 'service'} onToggleListening={() => toggleListening('service')}
              tooltipContent={VALUE_CHAIN_GUIDANCE.service}
            />
          </div>
        </div>

        <div className="px-8 py-4 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center font-bold">
          The <span className="font-black uppercase tracking-tighter">Value Chain</span> model was developed by Michael E. Porter in "Competitive Advantage" (1985).
        </div>
      </div>
    </motion.div>
  );
};
