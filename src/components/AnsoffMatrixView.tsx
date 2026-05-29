import React, { useState, useEffect, useRef } from 'react';
import { Target, Rocket, Map, Shuffle, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface AnsoffMatrixViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface AnsoffCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  riskLevel: string;
  riskColor: string;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
}

const AnsoffCell: React.FC<AnsoffCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "", 
  riskLevel, 
  riskColor,
  isSupported,
  isListening,
  onToggleListening
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 min-h-[350px] ${
      isFocused
        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5'
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${
              isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
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
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${riskColor}`}>
            {riskLevel}
          </span>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        placeholder={`Plan ${title.toLowerCase()} strategy...`}
      />
    </div>
  );
};

export const AnsoffMatrixView: React.FC<AnsoffMatrixViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['ansoffMatrix']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['ansoffMatrix']> | null>(null);
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
            ansoffMatrix: {
              ...(prev.ansoffMatrix || { marketPenetration: '', productDevelopment: '', marketDevelopment: '', diversification: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Ansoff Matrix:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['ansoffMatrix']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentAnsoff = canvasDataRef.current.ansoffMatrix || { marketPenetration: '', productDevelopment: '', marketDevelopment: '', diversification: '' };
    initialTextRef.current = currentAnsoff[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Ansoff Matrix:', error);
      setActiveField(null);
    }
  };

  const defaults = { marketPenetration: '', productDevelopment: '', marketDevelopment: '', diversification: '' };

  const updateAnsoff = (field: keyof NonNullable<CanvasData['ansoffMatrix']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      ansoffMatrix: { ...(prev.ansoffMatrix || defaults), [field]: value }
    }));
  };

  const am = canvasData.ansoffMatrix || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Ansoff Matrix</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Growth Strategy Framework</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="text-center py-3 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Existing Products</span>
          </div>
          <div className="text-center py-3 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">New Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <AnsoffCell
            icon={<Target className="w-5 h-5" />}
            title="Market Penetration"
            subtitle="Existing products → Existing markets"
            value={am.marketPenetration}
            onChange={(val) => updateAnsoff('marketPenetration', val)}
            riskLevel="Low Risk"
            riskColor="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            isSupported={isSupported}
            isListening={activeField === 'marketPenetration'}
            onToggleListening={() => toggleListening('marketPenetration')}
          />
          <AnsoffCell
            icon={<Rocket className="w-5 h-5" />}
            title="Product Development"
            subtitle="New products → Existing markets"
            value={am.productDevelopment}
            onChange={(val) => updateAnsoff('productDevelopment', val)}
            riskLevel="Medium Risk"
            riskColor="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            isSupported={isSupported}
            isListening={activeField === 'productDevelopment'}
            onToggleListening={() => toggleListening('productDevelopment')}
          />
          <AnsoffCell
            icon={<Map className="w-5 h-5" />}
            title="Market Development"
            subtitle="Existing products → New markets"
            value={am.marketDevelopment}
            onChange={(val) => updateAnsoff('marketDevelopment', val)}
            riskLevel="Medium Risk"
            riskColor="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            isSupported={isSupported}
            isListening={activeField === 'marketDevelopment'}
            onToggleListening={() => toggleListening('marketDevelopment')}
          />
          <AnsoffCell
            icon={<Shuffle className="w-5 h-5" />}
            title="Diversification"
            subtitle="New products → New markets"
            value={am.diversification}
            onChange={(val) => updateAnsoff('diversification', val)}
            riskLevel="High Risk"
            riskColor="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            isSupported={isSupported}
            isListening={activeField === 'diversification'}
            onToggleListening={() => toggleListening('diversification')}
          />
        </div>
      </div>
    </motion.div>
  );
};
