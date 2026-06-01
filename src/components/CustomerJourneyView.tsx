import React, { useState, useEffect, useRef } from 'react';
import { isSafeKey } from '../utils/security';

import { Eye, Search, CreditCard, Heart, Megaphone, ArrowLeft, ArrowRight, Mic, MicOff } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { CUSTOMER_JOURNEY_GUIDANCE, TooltipContent } from '../utils/guidance';

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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const StageCell: React.FC<StageCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  stageNumber, 
  isLast = false,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colors = [
    { bg: 'bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/50 dark:border-sky-400/40 ring-2 ring-sky-500/20 dark:ring-sky-400/10 shadow-lg shadow-sky-500/5', hoverShadow: 'hover:shadow-sky-500/5', hoverRing: 'hover:border-sky-500/30 dark:hover:border-sky-400/30', icon: 'bg-sky-600', text: 'text-sky-600 dark:text-sky-400', num: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    { bg: 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/50 dark:border-violet-400/40 ring-2 ring-violet-500/20 dark:ring-violet-400/10 shadow-lg shadow-violet-500/5', hoverShadow: 'hover:shadow-violet-500/5', hoverRing: 'hover:border-violet-500/30 dark:hover:border-violet-400/30', icon: 'bg-violet-600', text: 'text-violet-600 dark:text-violet-400', num: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    { bg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/50 dark:border-emerald-400/40 ring-2 ring-emerald-500/20 dark:ring-emerald-400/10 shadow-lg shadow-emerald-500/5', hoverShadow: 'hover:shadow-emerald-500/5', hoverRing: 'hover:border-emerald-500/30 dark:hover:border-emerald-400/30', icon: 'bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', num: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/50 dark:border-amber-400/40 ring-2 ring-amber-500/20 dark:ring-amber-400/10 shadow-lg shadow-amber-500/5', hoverShadow: 'hover:shadow-amber-500/5', hoverRing: 'hover:border-amber-500/30 dark:hover:border-amber-400/30', icon: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', num: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/50 dark:border-rose-400/40 ring-2 ring-rose-500/20 dark:ring-rose-400/10 shadow-lg shadow-rose-500/5', hoverShadow: 'hover:shadow-rose-500/5', hoverRing: 'hover:border-rose-500/30 dark:hover:border-rose-400/30', icon: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', num: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  ];

  const c = colors[stageNumber] || colors[0];

  return (
    <div className="flex items-stretch w-full">
      <div className={`relative flex-1 p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 min-h-[320px] ${
        isFocused 
          ? `${c.bg}` 
          : `hover:-translate-y-1.5 hover:shadow-2xl ${c.hoverShadow} ${c.hoverRing}`
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
          placeholder={`Touchpoints, actions & emotions...`}
        />
        {tooltipContent && <Tooltip content={tooltipContent} />}
      </div>
      {!isLast && (
        <div className="hidden lg:flex items-center px-2 text-zinc-300 dark:text-zinc-700">
          <ArrowRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export const CustomerJourneyView: React.FC<CustomerJourneyViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['customerJourney']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['customerJourney']> | null>(null);
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
        if (cleanSessionTranscript && currentActiveField && isSafeKey(currentActiveField)) {
          const baseText = initialTextRef.current.trim();
          const formattedTranscript = `- ${cleanSessionTranscript}`;
          const updatedValue = baseText 
            ? `${baseText}\n${formattedTranscript}` 
            : formattedTranscript;
          
          setCanvasDataRef.current(prev => ({
            ...prev,
            customerJourney: {
              ...(prev.customerJourney || { awareness: '', consideration: '', purchase: '', retention: '', advocacy: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Customer Journey:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['customerJourney']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentJourney = canvasDataRef.current.customerJourney || { awareness: '', consideration: '', purchase: '', retention: '', advocacy: '' };
    initialTextRef.current = currentJourney[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Customer Journey:', error);
      setActiveField(null);
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-2">
        <StageCell stageNumber={0}
          icon={<Eye className="w-4 h-4" />} title="Awareness" subtitle="Discovery & First Impressions"
          value={cj.awareness} onChange={(val) => updateJourney('awareness', val)}
          isSupported={isSupported} isListening={activeField === 'awareness'} onToggleListening={() => toggleListening('awareness')}
          tooltipContent={CUSTOMER_JOURNEY_GUIDANCE.awareness} />
        <StageCell stageNumber={1}
          icon={<Search className="w-4 h-4" />} title="Consideration" subtitle="Research & Comparison"
          value={cj.consideration} onChange={(val) => updateJourney('consideration', val)}
          isSupported={isSupported} isListening={activeField === 'consideration'} onToggleListening={() => toggleListening('consideration')}
          tooltipContent={CUSTOMER_JOURNEY_GUIDANCE.consideration} />
        <StageCell stageNumber={2}
          icon={<CreditCard className="w-4 h-4" />} title="Purchase" subtitle="Decision & Conversion"
          value={cj.purchase} onChange={(val) => updateJourney('purchase', val)}
          isSupported={isSupported} isListening={activeField === 'purchase'} onToggleListening={() => toggleListening('purchase')}
          tooltipContent={CUSTOMER_JOURNEY_GUIDANCE.purchase} />
        <StageCell stageNumber={3}
          icon={<Heart className="w-4 h-4" />} title="Retention" subtitle="Onboarding & Loyalty"
          value={cj.retention} onChange={(val) => updateJourney('retention', val)}
          isSupported={isSupported} isListening={activeField === 'retention'} onToggleListening={() => toggleListening('retention')}
          tooltipContent={CUSTOMER_JOURNEY_GUIDANCE.retention} />
        <StageCell stageNumber={4} isLast
          icon={<Megaphone className="w-4 h-4" />} title="Advocacy" subtitle="Referrals & Word-of-Mouth"
          value={cj.advocacy} onChange={(val) => updateJourney('advocacy', val)}
          isSupported={isSupported} isListening={activeField === 'advocacy'} onToggleListening={() => toggleListening('advocacy')}
          tooltipContent={CUSTOMER_JOURNEY_GUIDANCE.advocacy} />
      </div>
    </motion.div>
  );
};
