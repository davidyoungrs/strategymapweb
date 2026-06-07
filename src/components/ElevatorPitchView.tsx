import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  HelpCircle, 
  Sparkles, 
  Tag, 
  Rocket, 
  AlertCircle, 
  Zap, 
  ArrowLeft, 
  Mic, 
  MicOff,
  Quote
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { ELEVATOR_PITCH_GUIDANCE } from '../utils/guidance';

interface ElevatorPitchViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface PitchInputCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: { definition: string; questions: string[]; example?: string };
}

const PitchInputCard: React.FC<PitchInputCardProps> = ({
  icon,
  title,
  subtitle,
  value,
  placeholder,
  onChange,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 ${
      isFocused
        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5'
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? 'bg-blue-600 text-white shadow-lg scale-110'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
              {tooltipContent && <Tooltip content={tooltipContent} />}
            </div>
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        <div>
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
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent outline-none text-sm font-semibold text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
        placeholder={placeholder}
      />
    </div>
  );
};

export const ElevatorPitchView: React.FC<ElevatorPitchViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['elevatorPitch']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['elevatorPitch']> | null>(null);
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
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const cleanSessionTranscript = event.results[0][0].transcript.trim();
        const currentActiveField = activeListeningFieldRef.current;
        if (cleanSessionTranscript && currentActiveField) {
          setCanvasDataRef.current(prev => ({
            ...prev,
            elevatorPitch: {
              ...(prev.elevatorPitch || { targetCustomer: '', unmetNeed: '', productName: '', marketCategory: '', productBenefit: '', competitors: '', differentiator: '' }),
              [currentActiveField]: cleanSessionTranscript
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Elevator Pitch:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['elevatorPitch']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentPitch = canvasDataRef.current.elevatorPitch || { targetCustomer: '', unmetNeed: '', productName: '', marketCategory: '', productBenefit: '', competitors: '', differentiator: '' };
    initialTextRef.current = currentPitch[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Elevator Pitch:', error);
      setActiveField(null);
    }
  };

  const defaults = {
    targetCustomer: '',
    unmetNeed: '',
    productName: '',
    marketCategory: '',
    productBenefit: '',
    competitors: '',
    differentiator: '',
  };

  const updatePitch = (field: keyof NonNullable<CanvasData['elevatorPitch']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      elevatorPitch: { ...(prev.elevatorPitch || defaults), [field]: value }
    }));
  };

  const pitch = canvasData.elevatorPitch || defaults;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Elevator Pitch Canvas</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Core Value Proposition & Positioning</p>
        </div>
      </div>

      {/* Compiled Sentence Showcase Card */}
      <div className="p-8 bg-gradient-to-r from-blue-600/10 to-teal-500/10 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-500/20 dark:border-blue-400/20 rounded-3xl relative overflow-hidden">
        <div className="absolute right-6 top-6 text-blue-500/10 dark:text-blue-400/10 select-none pointer-events-none">
          <Quote className="w-24 h-24 stroke-[4]" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Your Elevator Pitch</h3>
        <p className="text-lg font-black tracking-tight text-zinc-800 dark:text-zinc-100 leading-relaxed italic">
          For{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.targetCustomer || "[the target customer]"}
          </span>{" "}
          who{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.unmetNeed || "[has an unmet need or problem]"}
          </span>
          , the{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.productName || "[product name]"}
          </span>{" "}
          is a{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.marketCategory || "[market category or concise description]"}
          </span>{" "}
          that{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.productBenefit || "[high-level description of what the product does]"}
          </span>
          . Unlike{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.competitors || "[your main competitors]"}
          </span>
          , our product{" "}
          <span className="text-blue-600 dark:text-blue-400 underline decoration-2 decoration-blue-500/30">
            {pitch.differentiator || "[differentiator description]"}
          </span>
          .
        </p>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PitchInputCard
          icon={<Users className="w-4 h-4" />}
          title="Target Customer"
          subtitle="Who is your ideal buyer?"
          value={pitch.targetCustomer}
          placeholder="e.g. early-stage tech founders"
          onChange={(v) => updatePitch('targetCustomer', v)}
          isSupported={isSupported}
          isListening={activeField === 'targetCustomer'}
          onToggleListening={() => toggleListening('targetCustomer')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.targetCustomer}
        />
        <PitchInputCard
          icon={<HelpCircle className="w-4 h-4" />}
          title="Unmet Need"
          subtitle="Their core problem/pain point"
          value={pitch.unmetNeed}
          placeholder="e.g. need to build strategic plans quickly"
          onChange={(v) => updatePitch('unmetNeed', v)}
          isSupported={isSupported}
          isListening={activeField === 'unmetNeed'}
          onToggleListening={() => toggleListening('unmetNeed')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.unmetNeed}
        />
        <PitchInputCard
          icon={<Rocket className="w-4 h-4" />}
          title="Product Name"
          subtitle="The name of your venture"
          value={pitch.productName}
          placeholder="e.g. Kettle Strat"
          onChange={(v) => updatePitch('productName', v)}
          isSupported={isSupported}
          isListening={activeField === 'productName'}
          onToggleListening={() => toggleListening('productName')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.productName}
        />
        <PitchInputCard
          icon={<Tag className="w-4 h-4" />}
          title="Market Category"
          subtitle="What is the solution type?"
          value={pitch.marketCategory}
          placeholder="e.g. on-device strategic planning workspace"
          onChange={(v) => updatePitch('marketCategory', v)}
          isSupported={isSupported}
          isListening={activeField === 'marketCategory'}
          onToggleListening={() => toggleListening('marketCategory')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.marketCategory}
        />
        <PitchInputCard
          icon={<Sparkles className="w-4 h-4" />}
          title="Product Benefit"
          subtitle="Primary benefit & value delivery"
          value={pitch.productBenefit}
          placeholder="e.g. creates secure, local AI-powered canvases"
          onChange={(v) => updatePitch('productBenefit', v)}
          isSupported={isSupported}
          isListening={activeField === 'productBenefit'}
          onToggleListening={() => toggleListening('productBenefit')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.productBenefit}
        />
        <PitchInputCard
          icon={<AlertCircle className="w-4 h-4" />}
          title="Main Competitors"
          subtitle="Primary alternatives/rivals"
          value={pitch.competitors}
          placeholder="e.g. classic cloud-based canvas templates"
          onChange={(v) => updatePitch('competitors', v)}
          isSupported={isSupported}
          isListening={activeField === 'competitors'}
          onToggleListening={() => toggleListening('competitors')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.competitors}
        />
        <PitchInputCard
          icon={<Zap className="w-4 h-4" />}
          title="Differentiator"
          subtitle="Your unique advantage"
          value={pitch.differentiator}
          placeholder="e.g. runs entirely in the browser using offline AI models"
          onChange={(v) => updatePitch('differentiator', v)}
          isSupported={isSupported}
          isListening={activeField === 'differentiator'}
          onToggleListening={() => toggleListening('differentiator')}
          tooltipContent={ELEVATOR_PITCH_GUIDANCE.differentiator}
        />
      </div>
    </motion.div>
  );
};
