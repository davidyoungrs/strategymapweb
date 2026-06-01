import React, { useState, useEffect, useRef } from 'react';
import { isSafeKey } from '../utils/security';

import { 
  Globe2, 
  Target, 
  Flag,
  ArrowLeft,
  DollarSign,
  Mic,
  MicOff
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { MARKET_SIZING_GUIDANCE, TooltipContent } from '../utils/guidance';

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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const SizingCell: React.FC<SizingCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  description, 
  onValueChange, 
  onDescChange,
  color,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colorVariants: Record<string, any> = {
    blue: { bg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5', hoverShadow: 'hover:shadow-blue-500/5', hoverRing: 'hover:border-blue-500/30 dark:hover:border-blue-400/30', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-600' },
    indigo: { bg: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 dark:border-indigo-400/40 ring-2 ring-indigo-500/20 dark:ring-indigo-400/10 shadow-lg shadow-indigo-500/5', hoverShadow: 'hover:shadow-indigo-500/5', hoverRing: 'hover:border-indigo-500/30 dark:hover:border-indigo-400/30', text: 'text-indigo-600 dark:text-indigo-400', icon: 'bg-indigo-600' },
    violet: { bg: 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/50 dark:border-violet-400/40 ring-2 ring-violet-500/20 dark:ring-violet-400/10 shadow-lg shadow-violet-500/5', hoverShadow: 'hover:shadow-violet-500/5', hoverRing: 'hover:border-violet-500/30 dark:hover:border-violet-400/30', text: 'text-violet-600 dark:text-violet-400', icon: 'bg-violet-600' },
  };

  const cv = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`relative p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl transition-all duration-300 ${
      isFocused 
        ? `${cv.bg}` 
        : `hover:-translate-y-1.5 hover:shadow-2xl ${cv.hoverShadow} ${cv.hoverRing}`
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused ? `${cv.icon} text-white shadow-lg scale-110` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${isFocused ? cv.text : 'text-zinc-900 dark:text-zinc-100'}`}>{title}</h3>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={onToggleListening}
              className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isListening
                  ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title={isListening ? `Stop recording ${title.toLowerCase()}` : `Start voice-to-text for ${title.toLowerCase()}`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}

          <div className={`flex items-center gap-1 px-4 py-2 rounded-xl border ${isFocused ? 'border-zinc-300 dark:border-zinc-700' : 'border-zinc-100 dark:border-zinc-800'} bg-white dark:bg-zinc-900 transition-colors`}>
            <DollarSign className="w-3 h-3 text-zinc-405 dark:text-zinc-600 font-bold" />
            <input
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="0.00"
              className="w-24 bg-transparent outline-none text-sm font-black text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Describe your ${title.toLowerCase()}...`}
        className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold h-24 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent transition-colors"
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

export const MarketSizingView: React.FC<MarketSizingViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['marketSizing']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['marketSizing']> | null>(null);
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
            marketSizing: {
              ...(prev.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Market Sizing:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['marketSizing']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentSizing = canvasDataRef.current.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' };
    initialTextRef.current = currentSizing[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Market Sizing:', error);
      setActiveField(null);
    }
  };

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
              className="absolute inset-0 rounded-full bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 flex items-start justify-center pt-8"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">TAM</span>
            </motion.div>
            {/* SAM Circle */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute inset-[15%] rounded-full bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-start justify-center pt-8 shadow-inner"
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
            isSupported={isSupported}
            isListening={activeField === 'tamDescription'}
            onToggleListening={() => toggleListening('tamDescription')}
            tooltipContent={MARKET_SIZING_GUIDANCE.tamDescription}
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
            isSupported={isSupported}
            isListening={activeField === 'samDescription'}
            onToggleListening={() => toggleListening('samDescription')}
            tooltipContent={MARKET_SIZING_GUIDANCE.samDescription}
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
            isSupported={isSupported}
            isListening={activeField === 'somDescription'}
            onToggleListening={() => toggleListening('somDescription')}
            tooltipContent={MARKET_SIZING_GUIDANCE.somDescription}
          />
        </div>
      </div>
    </motion.div>
  );
};
