import React, { useState, useEffect, useRef } from 'react';
import { Shield, UserPlus, Repeat, ShoppingCart, Factory, ArrowLeft, Mic, MicOff } from 'lucide-react';
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
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
}

const ForcesCell: React.FC<ForcesCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "",
  isSupported,
  isListening,
  onToggleListening
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 min-h-[300px] ${
      isFocused
        ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/50 dark:border-red-400/40 ring-2 ring-red-500/20 dark:ring-red-400/10 shadow-lg shadow-red-500/5'
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-500/5 dark:hover:shadow-red-400/5 hover:border-red-500/30 dark:hover:border-red-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        placeholder={`Analyze ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const PorterForcesView: React.FC<PorterForcesViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['porterForces']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['porterForces']> | null>(null);
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
            porterForces: {
              ...(prev.porterForces || { competitiveRivalry: '', threatOfNewEntrants: '', threatOfSubstitutes: '', bargainingPowerOfBuyers: '', bargainingPowerOfSuppliers: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Porter Forces:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['porterForces']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentForces = canvasDataRef.current.porterForces || { competitiveRivalry: '', threatOfNewEntrants: '', threatOfSubstitutes: '', bargainingPowerOfBuyers: '', bargainingPowerOfSuppliers: '' };
    initialTextRef.current = currentForces[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Porter Forces:', error);
      setActiveField(null);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Top: Threat of New Entrants */}
        <div className="md:col-span-3">
          <ForcesCell
            icon={<UserPlus className="w-5 h-5" />}
            title="Threat of New Entrants"
            subtitle="How easy is it to enter the market?"
            value={forces.threatOfNewEntrants}
            onChange={(val) => updateForces('threatOfNewEntrants', val)}
            isSupported={isSupported}
            isListening={activeField === 'threatOfNewEntrants'}
            onToggleListening={() => toggleListening('threatOfNewEntrants')}
          />
        </div>

        {/* Middle Row: Suppliers | Rivalry | Buyers */}
        <ForcesCell
          icon={<Factory className="w-5 h-5" />}
          title="Supplier Power"
          subtitle="How much leverage do suppliers have?"
          value={forces.bargainingPowerOfSuppliers}
          onChange={(val) => updateForces('bargainingPowerOfSuppliers', val)}
          isSupported={isSupported}
          isListening={activeField === 'bargainingPowerOfSuppliers'}
          onToggleListening={() => toggleListening('bargainingPowerOfSuppliers')}
        />
        <ForcesCell
          icon={<Shield className="w-5 h-5" />}
          title="Competitive Rivalry"
          subtitle="How intense is the competition?"
          value={forces.competitiveRivalry}
          onChange={(val) => updateForces('competitiveRivalry', val)}
          isSupported={isSupported}
          isListening={activeField === 'competitiveRivalry'}
          onToggleListening={() => toggleListening('competitiveRivalry')}
        />
        <ForcesCell
          icon={<ShoppingCart className="w-5 h-5" />}
          title="Buyer Power"
          subtitle="How much leverage do customers have?"
          value={forces.bargainingPowerOfBuyers}
          onChange={(val) => updateForces('bargainingPowerOfBuyers', val)}
          isSupported={isSupported}
          isListening={activeField === 'bargainingPowerOfBuyers'}
          onToggleListening={() => toggleListening('bargainingPowerOfBuyers')}
        />

        {/* Bottom: Threat of Substitutes */}
        <div className="md:col-span-3">
          <ForcesCell
            icon={<Repeat className="w-5 h-5" />}
            title="Threat of Substitutes"
            subtitle="What alternatives exist for customers?"
            value={forces.threatOfSubstitutes}
            onChange={(val) => updateForces('threatOfSubstitutes', val)}
            isSupported={isSupported}
            isListening={activeField === 'threatOfSubstitutes'}
            onToggleListening={() => toggleListening('threatOfSubstitutes')}
          />
        </div>
      </div>
    </motion.div>
  );
};
