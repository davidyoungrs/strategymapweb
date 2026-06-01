import React, { useState, useEffect, useRef } from 'react';
import { isSafeKey } from '../utils/security';

import { 
  Gavel, 
  TrendingUp, 
  Users, 
  Cpu, 
  Leaf, 
  Scale,
  ArrowLeft,
  Mic,
  MicOff
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { PESTEL_GUIDANCE } from '../utils/guidance';

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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: { definition: string; questions: string[]; example?: string };
}

const PestelCell: React.FC<PestelCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "",
  color,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative p-8 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 min-h-[300px] ${
      isFocused 
        ? `bg-${color}-500/5 dark:bg-${color}-500/10 border-${color}-500/50 dark:border-${color}-400/40 ring-2 ring-${color}-500/20 dark:ring-${color}-400/10 shadow-lg shadow-${color}-500/5` 
        : `hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-${color}-500/5 dark:hover:shadow-${color}-400/5 hover:border-${color}-500/30 dark:hover:border-${color}-400/30`
    } ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused 
              ? `bg-${color}-600 text-white shadow-lg shadow-${color}-200 dark:shadow-none scale-110` 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused ? `text-${color}-600 dark:text-${color}-400` : 'text-zinc-900 dark:text-zinc-100'
              }`}>
                {title}
              </h3>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>

        {isSupported && (
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
              isListening
                ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title={isListening ? `Stop recording ${title.toLowerCase()} factors` : `Start voice-to-text for ${title.toLowerCase()} factors`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
            ) : (
              <Mic className="w-4 h-4" />
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
        placeholder={`Analyze ${title.toLowerCase()} factors...`}
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

export const PestelView: React.FC<PestelViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['pestel']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['pestel']> | null>(null);
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
            pestel: {
              ...(prev.pestel || { political: '', economic: '', social: '', technological: '', environmental: '', legal: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in PESTEL:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['pestel']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentPestel = canvasDataRef.current.pestel || { political: '', economic: '', social: '', technological: '', environmental: '', legal: '' };
    initialTextRef.current = currentPestel[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in PESTEL:', error);
      setActiveField(null);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PestelCell
          icon={<Gavel className="w-5 h-5" />}
          title="Political"
          subtitle="Government & Policy"
          value={pestel.political}
          color="blue"
          onChange={(val) => updatePestel('political', val)}
          isSupported={isSupported}
          isListening={activeField === 'political'}
          onToggleListening={() => toggleListening('political')}
          tooltipContent={PESTEL_GUIDANCE.political}
          className=""
        />
        <PestelCell
          icon={<TrendingUp className="w-5 h-5" />}
          title="Economic"
          subtitle="Markets & Growth"
          value={pestel.economic}
          color="emerald"
          onChange={(val) => updatePestel('economic', val)}
          isSupported={isSupported}
          isListening={activeField === 'economic'}
          onToggleListening={() => toggleListening('economic')}
          tooltipContent={PESTEL_GUIDANCE.economic}
          className=""
        />
        <PestelCell
          icon={<Users className="w-5 h-5" />}
          title="Social"
          subtitle="Demographics & Trends"
          value={pestel.social}
          color="violet"
          onChange={(val) => updatePestel('social', val)}
          isSupported={isSupported}
          isListening={activeField === 'social'}
          onToggleListening={() => toggleListening('social')}
          tooltipContent={PESTEL_GUIDANCE.social}
          className=""
        />
        <PestelCell
          icon={<Cpu className="w-5 h-5" />}
          title="Technological"
          subtitle="Innovation & R&D"
          value={pestel.technological}
          color="amber"
          onChange={(val) => updatePestel('technological', val)}
          isSupported={isSupported}
          isListening={activeField === 'technological'}
          onToggleListening={() => toggleListening('technological')}
          tooltipContent={PESTEL_GUIDANCE.technological}
          className=""
        />
        <PestelCell
          icon={<Leaf className="w-5 h-5" />}
          title="Environmental"
          subtitle="Sustainability & Climate"
          value={pestel.environmental}
          color="green"
          onChange={(val) => updatePestel('environmental', val)}
          isSupported={isSupported}
          isListening={activeField === 'environmental'}
          onToggleListening={() => toggleListening('environmental')}
          tooltipContent={PESTEL_GUIDANCE.environmental}
          className=""
        />
        <PestelCell
          icon={<Scale className="w-5 h-5" />}
          title="Legal"
          subtitle="Laws & Regulations"
          value={pestel.legal}
          color="zinc"
          onChange={(val) => updatePestel('legal', val)}
          isSupported={isSupported}
          isListening={activeField === 'legal'}
          onToggleListening={() => toggleListening('legal')}
          tooltipContent={PESTEL_GUIDANCE.legal}
          className=""
        />
      </div>
    </motion.div>
  );
};
