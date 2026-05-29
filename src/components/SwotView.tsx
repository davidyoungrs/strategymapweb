import React, { useState, useEffect, useRef } from 'react';
import { SwotData, CanvasData } from '../types';
import { Zap, AlertTriangle, TrendingUp, ShieldAlert, ChevronDown, Mic, MicOff, Sparkles } from 'lucide-react';
import { SwotGuidedDrawer } from './modals/SwotGuidedDrawer';

interface SwotViewProps {
  data: SwotData;
  onChange: (data: SwotData) => void;
  projectTitle: string;
  onTitleChange: (title: string) => void;
  userCanvases: CanvasData[];
  onSelectCanvas: (canvas: CanvasData) => void;
}

export function SwotView({ 
  data, 
  onChange, 
  projectTitle, 
  onTitleChange,
  userCanvases,
  onSelectCanvas
}: SwotViewProps) {
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [activeField, setActiveField] = useState<keyof SwotData | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const dataRef = useRef(data);
  const onChangeRef = useRef(onChange);
  const initialTextRef = useRef('');
  const activeListeningFieldRef = useRef<keyof SwotData | null>(null);

  useEffect(() => {
    dataRef.current = data;
    onChangeRef.current = onChange;
  }, [data, onChange]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        console.log('Speech recognition onresult triggered', event);
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            sessionTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        const cleanSessionTranscript = sessionTranscript.trim();
        const currentActiveField = activeListeningFieldRef.current;
        console.log('Session transcript:', cleanSessionTranscript, 'Active field:', currentActiveField);
        if (cleanSessionTranscript && currentActiveField) {
          const baseText = initialTextRef.current.trim();
          const formattedTranscript = `- ${cleanSessionTranscript}`;
          const updatedValue = baseText 
            ? `${baseText}\n${formattedTranscript}` 
            : formattedTranscript;
          console.log('Updating field with value:', updatedValue);
          onChangeRef.current({
            ...dataRef.current,
            [currentActiveField]: updatedValue
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition onerror triggered:', event.error);
        if (event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error);
        }
        setActiveField(null);
        activeListeningFieldRef.current = null;
      };

      recognition.onend = () => {
        console.log('Speech recognition onend triggered');
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

  const toggleListening = (field: keyof SwotData) => {
    console.log('toggleListening clicked for field:', field, 'current activeField:', activeField);
    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported or not initialized.');
      return;
    }

    if (activeField) {
      console.log('Stopping active speech recognition');
      recognitionRef.current.stop();
      setActiveField(null);
      return;
    }

    initialTextRef.current = dataRef.current[field] || '';
    activeListeningFieldRef.current = field;
    setActiveField(field);
    try {
      console.log('Starting speech recognition for:', field, 'initial text:', initialTextRef.current);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setActiveField(null);
    }
  };

  const updateField = (field: keyof SwotData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start gap-8">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">Strategic Analysis</span>
          <div className="relative group max-w-xl">
            <input 
              type="text"
              value={projectTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none focus:ring-0 p-0 w-full uppercase"
              placeholder="Project Title"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <select 
                className="absolute right-0 top-0 opacity-0 cursor-pointer w-8 h-8"
                onChange={(e) => {
                  const selected = userCanvases.find(c => c.id === e.target.value);
                  if (selected) onSelectCanvas(selected);
                }}
                value=""
              >
                <option value="" disabled>Select Plan</option>
                {userCanvases.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          <input 
            type="text"
            value={data.title || 'SWOT Analysis'}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-transparent border-none outline-none focus:ring-0 p-0 w-full mt-2"
            placeholder="SWOT Subtitle"
          />
        </div>
        <div className="text-right hidden md:block pt-4">
          <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase mb-2">Internal vs External Factors</p>
          <button
            onClick={() => setIsGuidedOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md shadow-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-100" />
            Guided SWOT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 flex flex-col group min-h-[320px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-400/5 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50 dark:focus-within:ring-emerald-400/10 dark:focus-within:border-emerald-400/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-black tracking-tight uppercase">Strengths</h3>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => toggleListening('strengths')}
                  className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    activeField === 'strengths'
                      ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                  title={activeField === 'strengths' ? 'Stop recording strengths' : 'Start voice-to-text strengths'}
                >
                  {activeField === 'strengths' ? (
                    <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Internal / Positive</span>
          </div>
          <textarea
            value={data.strengths}
            onChange={(e) => updateField('strengths', e.target.value)}
            className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            placeholder="What do we do well? What unique resources can we draw on? What do others see as our strengths?"
          />
        </div>

        {/* Weaknesses */}
        <div className="bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 flex flex-col group min-h-[320px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/5 dark:hover:shadow-amber-400/5 hover:border-amber-500/30 dark:hover:border-amber-400/30 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500/50 dark:focus-within:ring-amber-400/10 dark:focus-within:border-amber-400/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-black tracking-tight uppercase">Weaknesses</h3>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => toggleListening('weaknesses')}
                  className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    activeField === 'weaknesses'
                      ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                  title={activeField === 'weaknesses' ? 'Stop recording weaknesses' : 'Start voice-to-text weaknesses'}
                >
                  {activeField === 'weaknesses' ? (
                    <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Internal / Negative</span>
          </div>
          <textarea
            value={data.weaknesses}
            onChange={(e) => updateField('weaknesses', e.target.value)}
            className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            placeholder="What could we improve? Where do we have fewer resources than others? What are others likely to see as weaknesses?"
          />
        </div>

        {/* Opportunities */}
        <div className="bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 flex flex-col group min-h-[320px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 dark:focus-within:ring-blue-400/10 dark:focus-within:border-blue-400/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-black tracking-tight uppercase">Opportunities</h3>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => toggleListening('opportunities')}
                  className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    activeField === 'opportunities'
                      ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                  title={activeField === 'opportunities' ? 'Stop recording opportunities' : 'Start voice-to-text opportunities'}
                >
                  {activeField === 'opportunities' ? (
                    <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">External / Positive</span>
          </div>
          <textarea
            value={data.opportunities}
            onChange={(e) => updateField('opportunities', e.target.value)}
            className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            placeholder="What good opportunities are open to us? What trends can we take advantage of? How can we turn strengths into opportunities?"
          />
        </div>

        {/* Threats */}
        <div className="bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 flex flex-col group min-h-[320px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-500/5 dark:hover:shadow-red-400/5 hover:border-red-500/30 dark:hover:border-red-400/30 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500/50 dark:focus-within:ring-red-400/10 dark:focus-within:border-red-400/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-black tracking-tight uppercase">Threats</h3>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => toggleListening('threats')}
                  className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    activeField === 'threats'
                      ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                  title={activeField === 'threats' ? 'Stop recording threats' : 'Start voice-to-text threats'}
                >
                  {activeField === 'threats' ? (
                    <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">External / Negative</span>
          </div>
          <textarea
            value={data.threats}
            onChange={(e) => updateField('threats', e.target.value)}
            className="flex-1 w-full bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            placeholder="What threats could harm us? What is our competition doing? What threats do our weaknesses expose us to?"
          />
        </div>
      </div>
      <SwotGuidedDrawer
        isOpen={isGuidedOpen}
        onClose={() => setIsGuidedOpen(false)}
        onApply={(distilledData) => onChange(distilledData)}
        currentData={data}
      />
    </div>
  );
}
