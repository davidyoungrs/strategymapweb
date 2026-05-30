import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Lightbulb, Diamond, ShieldCheck, Users, BarChart3, Truck, Banknote, Wallet, ArrowLeft, Mic, MicOff
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { LEAN_GUIDANCE } from '../utils/guidance';

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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: { definition: string; questions: string[]; example?: string };
}

const LeanCell: React.FC<LeanCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "", 
  isMain = false,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`relative p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 ${
      isFocused
        ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 dark:border-indigo-400/40 ring-2 ring-indigo-500/20 dark:ring-indigo-400/10 shadow-lg shadow-indigo-500/5'
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-400/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isFocused || isMain
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused || isMain ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
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
        className={`flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent ${
          isMain ? 'text-zinc-900 dark:text-zinc-50 font-black' : 'text-zinc-800 dark:text-zinc-200'
        }`}
        placeholder={`Define ${title.toLowerCase()}...`}
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

export const LeanCanvasView: React.FC<LeanCanvasViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['leanCanvas']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['leanCanvas']> | null>(null);
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
            leanCanvas: {
              ...(prev.leanCanvas || { problem: '', solution: '', uniqueValueProposition: '', unfairAdvantage: '', lcCustomerSegments: '', keyMetrics: '', lcChannels: '', lcCostStructure: '', lcRevenueStreams: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Lean Canvas:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['leanCanvas']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentLean = canvasDataRef.current.leanCanvas || { problem: '', solution: '', uniqueValueProposition: '', unfairAdvantage: '', lcCustomerSegments: '', keyMetrics: '', lcChannels: '', lcCostStructure: '', lcRevenueStreams: '' };
    initialTextRef.current = currentLean[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Lean Canvas:', error);
      setActiveField(null);
    }
  };

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
          <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight uppercase italic">Lean Canvas</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Startup Business Model</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 md:grid-rows-3 min-h-[800px] gap-6 lg:gap-8">
          {/* Row 1 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2"
            icon={<AlertTriangle className="w-4 h-4" />} title="Problem" subtitle="Top 3 problems"
            value={lc.problem} onChange={(val) => updateLean('problem', val)}
            isSupported={isSupported} isListening={activeField === 'problem'} onToggleListening={() => toggleListening('problem')}
            tooltipContent={LEAN_GUIDANCE.problem} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<Lightbulb className="w-4 h-4" />} title="Solution" subtitle="Top 3 features"
            value={lc.solution} onChange={(val) => updateLean('solution', val)}
            isSupported={isSupported} isListening={activeField === 'solution'} onToggleListening={() => toggleListening('solution')}
            tooltipContent={LEAN_GUIDANCE.solution} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2" isMain
            icon={<Diamond className="w-4 h-4" />} title="Unique Value" subtitle="What makes you different?"
            value={lc.uniqueValueProposition} onChange={(val) => updateLean('uniqueValueProposition', val)}
            isSupported={isSupported} isListening={activeField === 'uniqueValueProposition'} onToggleListening={() => toggleListening('uniqueValueProposition')}
            tooltipContent={LEAN_GUIDANCE.uniqueValueProposition} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<ShieldCheck className="w-4 h-4" />} title="Unfair Advantage" subtitle="Can't be copied"
            value={lc.unfairAdvantage} onChange={(val) => updateLean('unfairAdvantage', val)}
            isSupported={isSupported} isListening={activeField === 'unfairAdvantage'} onToggleListening={() => toggleListening('unfairAdvantage')}
            tooltipContent={LEAN_GUIDANCE.unfairAdvantage} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2"
            icon={<Users className="w-4 h-4" />} title="Customer Segments" subtitle="Target customers"
            value={lc.lcCustomerSegments} onChange={(val) => updateLean('lcCustomerSegments', val)}
            isSupported={isSupported} isListening={activeField === 'lcCustomerSegments'} onToggleListening={() => toggleListening('lcCustomerSegments')}
            tooltipContent={LEAN_GUIDANCE.lcCustomerSegments} />

          {/* Row 2 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<BarChart3 className="w-4 h-4" />} title="Key Metrics" subtitle="Measurable KPIs"
            value={lc.keyMetrics} onChange={(val) => updateLean('keyMetrics', val)}
            isSupported={isSupported} isListening={activeField === 'keyMetrics'} onToggleListening={() => toggleListening('keyMetrics')}
            tooltipContent={LEAN_GUIDANCE.keyMetrics} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-2"
            icon={<Truck className="w-4 h-4" />} title="Channels" subtitle="Path to customers"
            value={lc.lcChannels} onChange={(val) => updateLean('lcChannels', val)}
            isSupported={isSupported} isListening={activeField === 'lcChannels'} onToggleListening={() => toggleListening('lcChannels')}
            tooltipContent={LEAN_GUIDANCE.lcChannels} />

          {/* Row 3 */}
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-5"
            icon={<Banknote className="w-4 h-4" />} title="Cost Structure" subtitle="Fixed & variable costs"
            value={lc.lcCostStructure} onChange={(val) => updateLean('lcCostStructure', val)}
            isSupported={isSupported} isListening={activeField === 'lcCostStructure'} onToggleListening={() => toggleListening('lcCostStructure')}
            tooltipContent={LEAN_GUIDANCE.lcCostStructure} />
          
          <LeanCell className="col-span-1 md:col-span-1 lg:col-span-5"
            icon={<Wallet className="w-4 h-4" />} title="Revenue Streams" subtitle="Revenue model"
            value={lc.lcRevenueStreams} onChange={(val) => updateLean('lcRevenueStreams', val)}
            isSupported={isSupported} isListening={activeField === 'lcRevenueStreams'} onToggleListening={() => toggleListening('lcRevenueStreams')}
            tooltipContent={LEAN_GUIDANCE.lcRevenueStreams} />
        </div>

        <div className="px-8 py-4 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center font-bold">
          The <span className="font-black uppercase tracking-tighter">Lean Canvas</span> was adapted by Ash Maurya from the Business Model Canvas by Alexander Osterwalder.
          Source: <a href="https://leanstack.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-colors ml-1">LeanStack.com</a>.
        </div>
      </div>
    </motion.div>
  );
};
