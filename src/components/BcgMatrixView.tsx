import React, { useState, useEffect, useRef } from 'react';
import { Star, Coins, HelpCircle, Dog, ArrowLeft, Mic, MicOff } from 'lucide-react';
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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
}

const BcgCell: React.FC<BcgCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "", 
  accentColor, 
  strategy,
  isSupported,
  isListening,
  onToggleListening
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const colorMap: Record<string, { bg: string, ring: string, hoverBg: string, hoverRing: string, hoverShadow: string, iconBg: string, text: string, badge: string }> = {
    amber: {
      bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-transparent ring-2 ring-amber-500/20 dark:ring-amber-400/10',
      ring: 'border-amber-500/50 dark:border-amber-400/40',
      hoverBg: 'hover:bg-amber-500/5 dark:hover:bg-amber-500/10',
      hoverRing: 'hover:border-amber-500/30 dark:hover:border-amber-400/30',
      hoverShadow: 'hover:shadow-amber-500/5 dark:hover:shadow-amber-400/5',
      iconBg: 'bg-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-none',
      text: 'text-amber-600 dark:text-amber-400', 
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    },
    green: {
      bg: 'bg-green-500/5 dark:bg-green-500/10 border-transparent ring-2 ring-green-500/20 dark:ring-green-400/10',
      ring: 'border-green-500/50 dark:border-green-400/40',
      hoverBg: 'hover:bg-green-500/5 dark:hover:bg-green-500/10',
      hoverRing: 'hover:border-green-500/30 dark:hover:border-green-400/30',
      hoverShadow: 'hover:shadow-green-500/5 dark:hover:shadow-green-400/5',
      iconBg: 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none',
      text: 'text-green-600 dark:text-green-400', 
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    },
    violet: {
      bg: 'bg-violet-500/5 dark:bg-violet-500/10 border-transparent ring-2 ring-violet-500/20 dark:ring-violet-400/10',
      ring: 'border-violet-500/50 dark:border-violet-400/40',
      hoverBg: 'hover:bg-violet-500/5 dark:hover:bg-violet-500/10',
      hoverRing: 'hover:border-violet-500/30 dark:hover:border-violet-400/30',
      hoverShadow: 'hover:shadow-violet-500/5 dark:hover:shadow-violet-400/5',
      iconBg: 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none',
      text: 'text-violet-600 dark:text-violet-400', 
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400'
    },
    zinc: {
      bg: 'bg-zinc-500/5 dark:bg-zinc-500/10 border-transparent ring-2 ring-zinc-500/20 dark:ring-zinc-400/10',
      ring: 'border-zinc-500/50 dark:border-zinc-400/40',
      hoverBg: 'hover:bg-zinc-500/5 dark:hover:bg-zinc-500/10',
      hoverRing: 'hover:border-zinc-500/30 dark:hover:border-zinc-400/30',
      hoverShadow: 'hover:shadow-zinc-500/5 dark:hover:shadow-zinc-400/5',
      iconBg: 'bg-zinc-600 text-white shadow-lg shadow-zinc-200 dark:shadow-none',
      text: 'text-zinc-600 dark:text-zinc-400', 
      badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
  };

  const colors = colorMap[accentColor] || colorMap.zinc;

  return (
    <div className={`p-8 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 min-h-[350px] ${
      isFocused
        ? `${colors.bg} ${colors.ring}`
        : `hover:-translate-y-1.5 hover:shadow-2xl ${colors.hoverShadow} ${colors.hoverBg} ${colors.hoverRing}`
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
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colors.badge}`}>
            {strategy}
          </span>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        placeholder={`List your ${title.toLowerCase()} products...`}
      />
    </div>
  );
};

export const BcgMatrixView: React.FC<BcgMatrixViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['bcgMatrix']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['bcgMatrix']> | null>(null);
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
            bcgMatrix: {
              ...(prev.bcgMatrix || { stars: '', cashCows: '', questionMarks: '', dogs: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in BCG Matrix:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['bcgMatrix']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentBcg = canvasDataRef.current.bcgMatrix || { stars: '', cashCows: '', questionMarks: '', dogs: '' };
    initialTextRef.current = currentBcg[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in BCG Matrix:', error);
      setActiveField(null);
    }
  };

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

      <div className="space-y-6">
        {/* Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="text-center py-3 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">High Market Share</span>
          </div>
          <div className="text-center py-3 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Low Market Share</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <BcgCell
            icon={<Star className="w-5 h-5" />}
            title="Stars"
            subtitle="High growth, high share"
            value={bcg.stars}
            onChange={(val) => updateBcg('stars', val)}
            accentColor="amber"
            strategy="Invest"
            isSupported={isSupported}
            isListening={activeField === 'stars'}
            onToggleListening={() => toggleListening('stars')}
          />
          <BcgCell
            icon={<HelpCircle className="w-5 h-5" />}
            title="Question Marks"
            subtitle="High growth, low share"
            value={bcg.questionMarks}
            onChange={(val) => updateBcg('questionMarks', val)}
            accentColor="violet"
            strategy="Analyze"
            isSupported={isSupported}
            isListening={activeField === 'questionMarks'}
            onToggleListening={() => toggleListening('questionMarks')}
          />
          <BcgCell
            icon={<Coins className="w-5 h-5" />}
            title="Cash Cows"
            subtitle="Low growth, high share"
            value={bcg.cashCows}
            onChange={(val) => updateBcg('cashCows', val)}
            accentColor="green"
            strategy="Harvest"
            isSupported={isSupported}
            isListening={activeField === 'cashCows'}
            onToggleListening={() => toggleListening('cashCows')}
          />
          <BcgCell
            icon={<Dog className="w-5 h-5" />}
            title="Dogs"
            subtitle="Low growth, low share"
            value={bcg.dogs}
            onChange={(val) => updateBcg('dogs', val)}
            accentColor="zinc"
            strategy="Divest"
            isSupported={isSupported}
            isListening={activeField === 'dogs'}
            onToggleListening={() => toggleListening('dogs')}
          />
        </div>
      </div>
    </motion.div>
  );
};
