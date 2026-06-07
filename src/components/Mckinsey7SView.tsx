import React, { useState, useEffect, useRef } from 'react';
import { Target, Network, Cpu, Heart, Sun, Users, Award, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { MCKINSEY_7S_GUIDANCE } from '../utils/guidance';

interface Mckinsey7SViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

interface SevenSCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: { definition: string; questions: string[]; example?: string };
  isCenter?: boolean;
}

const SevenSCell: React.FC<SevenSCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  className = "", 
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent,
  isCenter = false
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`relative p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl flex flex-col group transition-all duration-300 ${
      isCenter ? 'min-h-[220px] md:col-span-3 lg:col-span-3 border-amber-500/30 dark:border-amber-500/20' : 'min-h-[280px]'
    } ${
      isFocused
        ? isCenter 
          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/50 dark:border-amber-400/40 ring-2 ring-amber-500/20 dark:ring-amber-400/10 shadow-lg shadow-amber-500/5'
          : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5'
        : isCenter 
          ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/5 dark:hover:shadow-amber-400/5 hover:border-amber-500/45 dark:hover:border-amber-400/45'
          : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isFocused
              ? isCenter 
                ? 'bg-amber-500 text-white shadow-lg scale-110'
                : 'bg-blue-600 text-white shadow-lg scale-110'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused 
                  ? isCenter ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
              {tooltipContent && <Tooltip content={tooltipContent} />}
            </div>
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        placeholder={`Describe your ${title.toLowerCase()}...`}
      />
    </div>
  );
};

export const Mckinsey7SView: React.FC<Mckinsey7SViewProps> = ({ canvasData, setCanvasData, onBack }) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['mckinsey7s']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['mckinsey7s']> | null>(null);
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
            mckinsey7s: {
              ...(prev.mckinsey7s || { sharedValues: '', strategy: '', structure: '', systems: '', style: '', staff: '', skills: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in McKinsey 7S:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['mckinsey7s']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const current7S = canvasDataRef.current.mckinsey7s || { sharedValues: '', strategy: '', structure: '', systems: '', style: '', staff: '', skills: '' };
    initialTextRef.current = current7S[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in McKinsey 7S:', error);
      setActiveField(null);
    }
  };

  const defaults = { sharedValues: '', strategy: '', structure: '', systems: '', style: '', staff: '', skills: '' };

  const update7S = (field: keyof NonNullable<CanvasData['mckinsey7s']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      mckinsey7s: { ...(prev.mckinsey7s || defaults), [field]: value }
    }));
  };

  const s7 = canvasData.mckinsey7s || defaults;

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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">McKinsey 7S Framework</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Organizational Alignment & Fit</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hard Elements */}
        <div className="space-y-4">
          <div className="px-6 py-2.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl inline-block">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Hard Elements</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <SevenSCell
              icon={<Target className="w-4 h-4" />} title="Strategy" subtitle="Direction & Advantage"
              value={s7.strategy} onChange={(val) => update7S('strategy', val)}
              isSupported={isSupported} isListening={activeField === 'strategy'} onToggleListening={() => toggleListening('strategy')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.strategy}
            />
            <SevenSCell
              icon={<Network className="w-4 h-4" />} title="Structure" subtitle="Reporting Lines & Hierarchy"
              value={s7.structure} onChange={(val) => update7S('structure', val)}
              isSupported={isSupported} isListening={activeField === 'structure'} onToggleListening={() => toggleListening('structure')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.structure}
            />
            <SevenSCell
              icon={<Cpu className="w-4 h-4" />} title="Systems" subtitle="Daily Procedures & Flows"
              value={s7.systems} onChange={(val) => update7S('systems', val)}
              isSupported={isSupported} isListening={activeField === 'systems'} onToggleListening={() => toggleListening('systems')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.systems}
            />
          </div>
        </div>

        {/* Central Core: Shared Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <SevenSCell
            isCenter
            icon={<Heart className="w-5 h-5 text-amber-500" />} title="Shared Values" subtitle="Core Norms & Corporate Culture"
            value={s7.sharedValues} onChange={(val) => update7S('sharedValues', val)}
            isSupported={isSupported} isListening={activeField === 'sharedValues'} onToggleListening={() => toggleListening('sharedValues')}
            tooltipContent={MCKINSEY_7S_GUIDANCE.sharedValues}
          />
        </div>

        {/* Soft Elements */}
        <div className="space-y-4">
          <div className="px-6 py-2.5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl inline-block">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em]">Soft Elements</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <SevenSCell
              icon={<Sun className="w-4 h-4" />} title="Style" subtitle="Leadership & Tone"
              value={s7.style} onChange={(val) => update7S('style', val)}
              isSupported={isSupported} isListening={activeField === 'style'} onToggleListening={() => toggleListening('style')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.style}
            />
            <SevenSCell
              icon={<Users className="w-4 h-4" />} title="Staff" subtitle="Talent & Human Capital"
              value={s7.staff} onChange={(val) => update7S('staff', val)}
              isSupported={isSupported} isListening={activeField === 'staff'} onToggleListening={() => toggleListening('staff')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.staff}
            />
            <SevenSCell
              icon={<Award className="w-4 h-4" />} title="Skills" subtitle="Competencies & Expertise"
              value={s7.skills} onChange={(val) => update7S('skills', val)}
              isSupported={isSupported} isListening={activeField === 'skills'} onToggleListening={() => toggleListening('skills')}
              tooltipContent={MCKINSEY_7S_GUIDANCE.skills}
            />
          </div>
        </div>

        <div className="px-8 py-4 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center font-bold">
          The <span className="font-black uppercase tracking-tighter">7S Framework</span> was created by Tom Peters and Robert Waterman at McKinsey & Company in 1980.
        </div>
      </div>
    </motion.div>
  );
};
