import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Heart, 
  Truck, 
  Handshake, 
  Zap, 
  Box, 
  Wrench, 
  Banknote, 
  Wallet,
  Mic,
  MicOff
} from 'lucide-react';
import { CanvasData } from '../../types';
import { Tooltip } from '../Tooltip';
import { BMC_GUIDANCE } from '../../utils/guidance';

interface BusinessModelCanvasProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  logoUrl?: string;
}

interface BmcCellProps {
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

const BmcCell: React.FC<BmcCellProps> = ({ 
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
        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5' 
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    } ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isFocused || isMain 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none transition-colors ${
                isFocused || isMain ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}>
                {title}
              </h3>
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
          isMain ? 'text-zinc-900 dark:text-zinc-50 font-black' : 'text-zinc-850 dark:text-zinc-100 font-semibold'
        }`}
        placeholder="Click to start typing..."
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

export const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({
  canvasData,
  setCanvasData,
  logoUrl
}) => {
  const [activeField, setActiveField] = useState<keyof CanvasData | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const activeListeningFieldRef = useRef<keyof CanvasData | null>(null);
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
          const baseText = (initialTextRef.current || '').trim();
          const formattedTranscript = `- ${cleanSessionTranscript}`;
          const updatedValue = baseText 
            ? `${baseText}\n${formattedTranscript}` 
            : formattedTranscript;
          
          setCanvasDataRef.current(prev => ({
            ...prev,
            [currentActiveField]: updatedValue
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in BMC:', event.error);
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

  const toggleListening = (field: keyof CanvasData) => {
    if (!recognitionRef.current) return;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    initialTextRef.current = (canvasDataRef.current[field] as string) || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in BMC:', error);
      setActiveField(null);
    }
  };

  const updateField = (field: keyof CanvasData, value: any) => {
    setCanvasData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 w-full max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 md:grid-rows-3 min-h-[800px] gap-6 lg:gap-8">
        {/* Row 1 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2"
          icon={<Handshake className="w-4 h-4" />}
          title="Key Partners"
          subtitle="Who helps us?"
          value={canvasData.keyPartners}
          onChange={(val) => updateField('keyPartners', val)}
          isSupported={isSupported}
          isListening={activeField === 'keyPartners'}
          onToggleListening={() => toggleListening('keyPartners')}
          tooltipContent={BMC_GUIDANCE.keyPartners}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Zap className="w-4 h-4" />}
          title="Key Activities"
          subtitle="What do we do?"
          value={canvasData.keyActivities}
          onChange={(val) => updateField('keyActivities', val)}
          isSupported={isSupported}
          isListening={activeField === 'keyActivities'}
          onToggleListening={() => toggleListening('keyActivities')}
          tooltipContent={BMC_GUIDANCE.keyActivities}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2 relative"
          isMain
          icon={<Box className="w-4 h-4" />}
          title="Value Propositions"
          subtitle="What is our offer?"
          value={canvasData.valuePropositions}
          onChange={(val) => updateField('valuePropositions', val)}
          isSupported={isSupported}
          isListening={activeField === 'valuePropositions'}
          onToggleListening={() => toggleListening('valuePropositions')}
          tooltipContent={BMC_GUIDANCE.valuePropositions}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Heart className="w-4 h-4" />}
          title="Customer Relationships"
          subtitle="How do we interact?"
          value={canvasData.customerRelationships}
          onChange={(val) => updateField('customerRelationships', val)}
          isSupported={isSupported}
          isListening={activeField === 'customerRelationships'}
          onToggleListening={() => toggleListening('customerRelationships')}
          tooltipContent={BMC_GUIDANCE.customerRelationships}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 md:row-span-1 lg:row-span-2"
          icon={<Users className="w-4 h-4" />}
          title="Customer Segments"
          subtitle="Who is our target?"
          value={canvasData.customerSegments}
          onChange={(val) => updateField('customerSegments', val)}
          isSupported={isSupported}
          isListening={activeField === 'customerSegments'}
          onToggleListening={() => toggleListening('customerSegments')}
          tooltipContent={BMC_GUIDANCE.customerSegments}
        />

        {/* Row 2 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Wrench className="w-4 h-4" />}
          title="Key Resources"
          subtitle="What do we need?"
          value={canvasData.keyResources}
          onChange={(val) => updateField('keyResources', val)}
          isSupported={isSupported}
          isListening={activeField === 'keyResources'}
          onToggleListening={() => toggleListening('keyResources')}
          tooltipContent={BMC_GUIDANCE.keyResources}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-2"
          icon={<Truck className="w-4 h-4" />}
          title="Channels"
          subtitle="How do we reach them?"
          value={canvasData.channels}
          onChange={(val) => updateField('channels', val)}
          isSupported={isSupported}
          isListening={activeField === 'channels'}
          onToggleListening={() => toggleListening('channels')}
          tooltipContent={BMC_GUIDANCE.channels}
        />

        {/* Row 3 */}
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-5"
          icon={<Banknote className="w-4 h-4" />}
          title="Cost Structure"
          subtitle="Where does money go?"
          value={canvasData.costStructure}
          onChange={(val) => updateField('costStructure', val)}
          isSupported={isSupported}
          isListening={activeField === 'costStructure'}
          onToggleListening={() => toggleListening('costStructure')}
          tooltipContent={BMC_GUIDANCE.costStructure}
        />
        <BmcCell
          className="col-span-1 md:col-span-1 lg:col-span-5"
          icon={<Wallet className="w-4 h-4" />}
          title="Revenue Streams"
          subtitle="How do we earn money?"
          value={canvasData.revenueStreams}
          onChange={(val) => updateField('revenueStreams', val)}
          isSupported={isSupported}
          isListening={activeField === 'revenueStreams'}
          onToggleListening={() => toggleListening('revenueStreams')}
          tooltipContent={BMC_GUIDANCE.revenueStreams}
        />
      </div>

      {logoUrl && (
        <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg border border-zinc-100 p-2 flex items-center justify-center overflow-hidden">
          <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      )}

      <div className="px-8 py-4 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed text-center font-bold">
        The <span className="font-black uppercase tracking-tighter">Business Model Canvas (BMC)</span>, developed by Alexander Osterwalder, is released under a Creative Commons Attribution-Share Alike 3.0 Unported License. 
        Source: <a href="https://strategyzer.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors ml-1">Strategyzer.com</a>.
      </div>
    </div>
  );
};
