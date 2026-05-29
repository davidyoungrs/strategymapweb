import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Target, 
  Eye, 
  Heart,
  ArrowLeft,
  Mic,
  MicOff
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { BUSINESS_PLAN_GUIDANCE, TooltipContent } from '../utils/guidance';

interface BusinessPlanViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
  type: 'summary' | 'identity';
}

interface EditorSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  minHeight?: string;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const EditorSection: React.FC<EditorSectionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  placeholder,
  minHeight = "400px",
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 rounded-3xl bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl ${
      isFocused 
        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5' 
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    }`}>
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
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
              {tooltipContent && <Tooltip content={tooltipContent} />}
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
        className="w-full bg-transparent resize-none outline-none text-base leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent transition-colors"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
};

export const BusinessPlanView: React.FC<BusinessPlanViewProps> = ({
  canvasData,
  setCanvasData,
  onBack,
  type
}) => {
  const [activeField, setActiveField] = useState<keyof NonNullable<CanvasData['businessPlan']> | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof NonNullable<CanvasData['businessPlan']> | null>(null);
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
            businessPlan: {
              ...(prev.businessPlan || { executiveSummary: '', mission: '', vision: '', values: '' }),
              [currentActiveField]: updatedValue
            }
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Business Plan:', event.error);
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

  const toggleListening = (field: keyof NonNullable<CanvasData['businessPlan']>) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    const currentPlan = canvasDataRef.current.businessPlan || { executiveSummary: '', mission: '', vision: '', values: '' };
    initialTextRef.current = currentPlan[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Business Plan:', error);
      setActiveField(null);
    }
  };

  const updatePlan = (field: keyof NonNullable<CanvasData['businessPlan']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      businessPlan: {
        ...(prev.businessPlan || { executiveSummary: '', mission: '', vision: '', values: '' }),
        [field]: value
      }
    }));
  };

  const plan = canvasData.businessPlan || { 
    executiveSummary: '', 
    mission: '', 
    vision: '', 
    values: '' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">
            {type === 'summary' ? 'Executive Summary' : 'Mission, Vision & Values'}
          </h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Your Business Foundation</p>
        </div>
      </div>

      <div className="space-y-6">
        {type === 'summary' ? (
          <EditorSection
            icon={<FileText className="w-6 h-6" />}
            title="Executive Summary"
            subtitle="The high-level pitch of your business"
            value={plan.executiveSummary}
            onChange={(val) => updatePlan('executiveSummary', val)}
            placeholder="Write a compelling overview of your business strategy, goals, and market opportunity..."
            minHeight="600px"
            isSupported={isSupported}
            isListening={activeField === 'executiveSummary'}
            onToggleListening={() => toggleListening('executiveSummary')}
            tooltipContent={BUSINESS_PLAN_GUIDANCE.executiveSummary}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <EditorSection
              icon={<Target className="w-6 h-6" />}
              title="Mission Statement"
              subtitle="What do we do today?"
              value={plan.mission}
              onChange={(val) => updatePlan('mission', val)}
              placeholder="Our mission is to..."
              minHeight="150px"
              isSupported={isSupported}
              isListening={activeField === 'mission'}
              onToggleListening={() => toggleListening('mission')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.mission}
            />
            <EditorSection
              icon={<Eye className="w-6 h-6" />}
              title="Vision Statement"
              subtitle="Where are we going?"
              value={plan.vision}
              onChange={(val) => updatePlan('vision', val)}
              placeholder="Our vision is to become..."
              minHeight="150px"
              isSupported={isSupported}
              isListening={activeField === 'vision'}
              onToggleListening={() => toggleListening('vision')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.vision}
            />
            <EditorSection
              icon={<Heart className="w-6 h-6" />}
              title="Core Values"
              subtitle="What do we stand for?"
              value={plan.values}
              onChange={(val) => updatePlan('values', val)}
              placeholder="List the guiding principles that define your culture and decision-making..."
              minHeight="200px"
              isSupported={isSupported}
              isListening={activeField === 'values'}
              onToggleListening={() => toggleListening('values')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.values}
            />
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 uppercase tracking-tight">AI Strategist Ready</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
              Open the AI Strategist in the sidebar to have Gemma review your {type === 'summary' ? 'summary' : 'mission and values'}. It will provide feedback on clarity, alignment, and strategic impact.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
