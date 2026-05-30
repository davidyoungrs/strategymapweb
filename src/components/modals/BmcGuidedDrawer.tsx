import React, { useState, useEffect, useRef } from 'react';
import type { LlmInference } from '@mediapipe/tasks-genai';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Loader2, Sparkles, ArrowRight, ArrowLeft, Mic, MicOff, Check, CheckCircle2 } from 'lucide-react';

interface BmcData {
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

interface BmcGuidedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: BmcData) => void;
  currentData: BmcData;
}

const STEPS = [
  {
    key: 'valuePropositions' as keyof BmcData,
    title: 'Value Propositions',
    question: 'What value do we deliver to the customer? Which customer problems or needs are we solving?',
    placeholder: 'e.g. High-performance cloud hosting with zero downtime, automated strategy canvas templates...',
    colorClass: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
  },
  {
    key: 'customerSegments' as keyof BmcData,
    title: 'Customer Segments',
    question: 'For whom are we creating value? Who are our most important customers or audiences?',
    placeholder: 'e.g. Enterprise SaaS companies, tech consultants, small-to-medium business owners...',
    colorClass: 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5',
  },
  {
    key: 'channels' as keyof BmcData,
    title: 'Channels',
    question: 'Through which channels do our customer segments want to be reached and how do we deliver our offer?',
    placeholder: 'e.g. Direct sales, organic search (SEO), professional developer conferences, online marketplace...',
    colorClass: 'text-violet-600 dark:text-violet-400 border-violet-500/20 bg-violet-500/5',
  },
  {
    key: 'customerRelationships' as keyof BmcData,
    title: 'Customer Relationships',
    question: 'What type of relationship does each customer segment expect us to establish and maintain with them?',
    placeholder: 'e.g. Automated self-service platform, dedicated personal assistance for enterprise clients...',
    colorClass: 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/5',
  },
  {
    key: 'revenueStreams' as keyof BmcData,
    title: 'Revenue Streams',
    question: 'For what value are our customers willing to pay? What are our pricing mechanisms and revenue models?',
    placeholder: 'e.g. Monthly subscription plans, transactional API usage fees, premium professional service add-ons...',
    colorClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  },
  {
    key: 'keyResources' as keyof BmcData,
    title: 'Key Resources',
    question: 'What key resources (physical, intellectual, human, or financial) do our value propositions require?',
    placeholder: 'e.g. Proprietary analytics software, engineering team, global cloud infrastructure...',
    colorClass: 'text-teal-600 dark:text-teal-400 border-teal-500/20 bg-teal-500/5',
  },
  {
    key: 'keyActivities' as keyof BmcData,
    title: 'Key Activities',
    question: 'What key actions must our company perform to execute our value propositions and business model?',
    placeholder: 'e.g. Platform engineering and maintenance, customer success onboarding, product design...',
    colorClass: 'text-orange-600 dark:text-orange-400 border-orange-500/20 bg-orange-500/5',
  },
  {
    key: 'keyPartners' as keyof BmcData,
    title: 'Key Partners',
    question: 'Who are our key partners and suppliers? What resources or activities do we acquire from them?',
    placeholder: 'e.g. Cloud infrastructure providers (AWS), reseller networks, freelance software agencies...',
    colorClass: 'text-pink-600 dark:text-pink-400 border-pink-500/20 bg-pink-500/5',
  },
  {
    key: 'costStructure' as keyof BmcData,
    title: 'Cost Structure',
    question: 'What are the most important costs inherent in our business model? Which activities and resources are most expensive?',
    placeholder: 'e.g. Server hosting bills, salaries for engineering staff, marketing advertising spend...',
    colorClass: 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/5',
  }
];

export const BmcGuidedDrawer: React.FC<BmcGuidedDrawerProps> = ({ isOpen, onClose, onApply, currentData }) => {
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: Intro, 0-8: Steps, 9: Summary

  // Raw inputs from user
  const [answers, setAnswers] = useState<{ [key in keyof BmcData]: string }>({
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: ''
  });

  // Distilled outputs from Gemma
  const [distilledData, setDistilledData] = useState<BmcData>({
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: ''
  });

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const initialSpeechTextRef = useRef('');

  // AI Suggestion states
  const [suggesting, setSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const llmInferenceRef = useRef<LlmInference | null>(null);
  const initModelPromise = useRef<Promise<void> | null>(null);

  // Sync current data to inputs on open
  useEffect(() => {
    if (isOpen) {
      setAnswers({
        keyPartners: currentData.keyPartners || '',
        keyActivities: currentData.keyActivities || '',
        keyResources: currentData.keyResources || '',
        valuePropositions: currentData.valuePropositions || '',
        customerRelationships: currentData.customerRelationships || '',
        channels: currentData.channels || '',
        customerSegments: currentData.customerSegments || '',
        costStructure: currentData.costStructure || '',
        revenueStreams: currentData.revenueStreams || ''
      });
      setAiSuggestion(null);
    }
  }, [isOpen, currentData]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
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
        if (cleanSessionTranscript && currentStep >= 0 && currentStep < 9) {
          const key = STEPS[currentStep].key;
          const baseText = initialSpeechTextRef.current.trim();
          const updatedValue = baseText 
            ? `${baseText}\n- ${cleanSessionTranscript}` 
            : `- ${cleanSessionTranscript}`;
          
          setAnswers(prev => ({
            ...prev,
            [key]: updatedValue
          }));
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in BMC Guided Drawer:', event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentStep]);

  // Toggle Voice Input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (currentStep >= 0 && currentStep < 9) {
        const key = STEPS[currentStep].key;
        initialSpeechTextRef.current = answers[key] || '';
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error('Failed to start recognition in BMC Guided Drawer:', err);
        }
      }
    }
  };

  // Initialize Local Gemma Model
  const initModel = async () => {
    if (llmInferenceRef.current) return;
    if (initModelPromise.current) return initModelPromise.current;

    const promise = (async () => {
      setModelLoading(true);
      setError(null);
      try {
        const { FilesetResolver, LlmInference } = await import('@mediapipe/tasks-genai');
        const genaiFileset = await FilesetResolver.forGenAiTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
        );

        const isLocal = window.location.hostname === 'localhost';
        const MODEL_URL = isLocal 
          ? '/models/gemma-2b-it-gpu.bin'
          : 'https://pub-84256253504148068c680038cecbc585.r2.dev/gemma-2b-it-gpu.bin';

        const genai = await LlmInference.createFromOptions(genaiFileset, {
          baseOptions: {
            modelAssetPath: MODEL_URL
          },
          maxTokens: 384,
          temperature: 0.5,
          topK: 30,
        });
        llmInferenceRef.current = genai;
      } catch (err: any) {
        console.error('Failed to load Gemma:', err);
        setError(`Failed to wake up Gemma: ${err.message || 'Unknown loading error'}`);
      } finally {
        setModelLoading(false);
      }
    })();

    initModelPromise.current = promise;
    return promise;
  };

  // Generate Suggestion from Gemma Agent
  const generateAiSuggestion = async () => {
    setSuggesting(true);
    setError(null);
    setAiSuggestion(null);
    try {
      if (!llmInferenceRef.current) {
        await initModel();
      }
      if (!llmInferenceRef.current) {
        throw new Error("Local AI model could not be initialized.");
      }

      const stepInfo = STEPS[currentStep];
      const contextParts: string[] = [];

      // Gather existing grid values
      Object.entries(currentData).forEach(([key, val]) => {
        if (val && val.trim()) {
          contextParts.push(`Current BMC ${key.toUpperCase()}: ${val}`);
        }
      });

      // Gather current drawer answers
      Object.entries(answers).forEach(([key, val]) => {
        if (val.trim() && key !== stepInfo.key) {
          contextParts.push(`Known ${key.toUpperCase()} for this session: ${val}`);
        }
      });

      const contextText = contextParts.length > 0
        ? `Here is the current business model context:\n${contextParts.join('\n')}`
        : `No prior context has been entered. Generate standard Business Model Canvas strategic ideas.`;

      const prompt = `
        You are a highly capable strategic startup consultant acting as an AI agent.
        Suggest 2 to 3 logical points for the "${stepInfo.title}" building block of the Business Model Canvas.
        
        ${contextText}

        Formatting Rules:
        - Output EXACTLY 2 to 3 bullet points.
        - Prefix each bullet point with "*** - " (three asterisks, space, hyphen, space).
        - Do not output introductory text, greetings, headers, or explanations.
      `;

      const response = await llmInferenceRef.current.generateResponse(prompt);

      let processed = response.trim();
      processed = processed
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          if (trimmed.startsWith('***')) {
            return trimmed;
          }
          if (trimmed.startsWith('-')) {
            return `*** ${trimmed}`;
          }
          return `*** - ${trimmed}`;
        })
        .filter(Boolean)
        .join('\n');

      setAiSuggestion(processed);
    } catch (err: any) {
      console.error("AI Suggestion failed:", err);
      setError(`AI Suggestion failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSuggesting(false);
    }
  };

  const handleInsertSuggestion = () => {
    if (!aiSuggestion) return;
    setAnswers(prev => {
      const prevVal = prev[STEPS[currentStep].key] || '';
      const newVal = prevVal.trim()
        ? `${prevVal}\n${aiSuggestion}`
        : aiSuggestion;
      return { ...prev, [STEPS[currentStep].key]: newVal };
    });
    setAiSuggestion(null);
  };

  // Distill all inputs using Gemma at the end of the guided flow
  const generateAllDistillations = async () => {
    setLoadingInsights(true);
    setError(null);
    try {
      if (!llmInferenceRef.current) {
        await initModel();
      }

      if (!llmInferenceRef.current) {
        throw new Error("Local AI model could not be initialized.");
      }

      const updatedDistilled = { ...distilledData };
      for (let i = 0; i < STEPS.length; ++i) {
        const stepInfo = STEPS[i];
        const rawAnswer = answers[stepInfo.key];
        if (rawAnswer.trim()) {
          const prompt = `
            You are an expert Business Model Canvas strategist. Distill the user's raw feedback into a highly professional, clear, bullet-pointed list of ${stepInfo.title}.
            Use professional terminology. 
            Formatting rule:
            - Output EXACTLY 2 to 4 bullet points.
            - Start each bullet point with "- ".
            - Do not output introductory text, greetings, or side notes. Just the bullet points.

            USER RESPONSE: "${rawAnswer}"
          `;
          const result = await llmInferenceRef.current.generateResponse(prompt);
          updatedDistilled[stepInfo.key] = result.trim();
        } else {
          updatedDistilled[stepInfo.key] = '';
        }
      }
      setDistilledData(updatedDistilled);
      setCurrentStep(9);
    } catch (err: any) {
      console.error('Inference Error:', err);
      setError('AI Inference failed or timed out. Falling back to formatting your raw answers.');
      
      const updatedDistilled = { ...distilledData };
      for (let i = 0; i < STEPS.length; ++i) {
        const stepInfo = STEPS[i];
        const rawAnswer = answers[stepInfo.key];
        updatedDistilled[stepInfo.key] = rawAnswer
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
          .map(l => l.startsWith('-') ? l : `- ${l}`)
          .join('\n');
      }
      setDistilledData(updatedDistilled);
      setCurrentStep(9);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleNext = async () => {
    if (isListening) {
      recognitionRef.current.stop();
    }

    if (currentStep >= 0 && currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 8) {
      await generateAllDistillations();
    } else if (currentStep === -1) {
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (isListening) {
      recognitionRef.current.stop();
    }
    setCurrentStep(prev => prev - 1);
  };

  const handleApply = () => {
    onApply(distilledData);
    onClose();
  };

  const handleStart = async () => {
    setCurrentStep(0);
    initModel().catch(err => console.warn('Preloading Gemma failed:', err));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-zinc-900 shadow-2xl z-[70] flex flex-col border-l border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Guided BMC</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Interactive Business Model Canvas Strategist</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              <div>
                {/* Error Banner */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold">
                    {error}
                  </div>
                )}

                {/* Direct Navigation Tabs (horizontal scrollable badges for 9 blocks) */}
                {currentStep >= 0 && (
                  <div className="mb-6">
                    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none snap-x bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                      {STEPS.map((s, idx) => (
                        <button
                          key={s.key}
                          onClick={() => {
                            if (isListening) recognitionRef.current?.stop();
                            setCurrentStep(idx);
                          }}
                          className={`flex-none py-1.5 px-3 text-xs font-black uppercase tracking-tight rounded-lg transition-all snap-start ${
                            currentStep === idx
                              ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-850'
                              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                          }`}
                        >
                          {s.title}
                        </button>
                      ))}
                      <button
                        onClick={async () => {
                          if (isListening) recognitionRef.current?.stop();
                          await generateAllDistillations();
                        }}
                        className={`flex-none py-1.5 px-3 text-xs font-black uppercase tracking-tight rounded-lg transition-all snap-start ${
                          currentStep === 9
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                        }`}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP -1: Welcome Intro */}
                {currentStep === -1 && (
                  <div className="space-y-6 py-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-3 uppercase tracking-tight">Guided Canvas completion</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto mb-8">
                        Our interactive strategist will walk you through the 9 building blocks of the Business Model Canvas.
                        Describe each element in your own words, and we'll use local Gemma AI to distill it into professional bullet points.
                      </p>
                      
                      <button
                        onClick={handleStart}
                        disabled={modelLoading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                      >
                        {modelLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Waking up Gemma...
                          </>
                        ) : (
                          <>
                            Begin Guided BMC
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider">
                        Runs locally on your CPU/GPU • Private
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 0 to 8: Active Questions */}
                {currentStep >= 0 && currentStep < 9 && (
                  <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-zinc-400">
                      <span>Block {currentStep + 1} of 9</span>
                      <span className="text-blue-500">{Math.round((currentStep + 1) * 11.1)}% Complete</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(currentStep + 1) * 11.1}%` }}
                      />
                    </div>

                    <div className={`p-5 rounded-2xl border ${STEPS[currentStep].colorClass}`}>
                      <h4 className="text-sm font-black uppercase tracking-wider mb-2">
                        {STEPS[currentStep].title}
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                        {STEPS[currentStep].question}
                      </p>
                    </div>

                    <div className="space-y-2 relative">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                          Your Input
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={generateAiSuggestion}
                            disabled={suggesting}
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                          >
                            {suggesting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Suggest
                              </>
                            )}
                          </button>
                          {isSpeechSupported && (
                            <button
                              type="button"
                              onClick={toggleVoiceInput}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                isListening 
                                  ? 'bg-red-500/20 text-red-500 animate-pulse ring-1 ring-red-500/30'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                              }`}
                            >
                              {isListening ? (
                                <>
                                  <MicOff className="w-3.5 h-3.5" />
                                  Stop Voice
                                </>
                              ) : (
                                <>
                                  <Mic className="w-3.5 h-3.5" />
                                  Use Microphone
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea
                        value={answers[STEPS[currentStep].key]}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [STEPS[currentStep].key]: e.target.value }))}
                        className="w-full h-40 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-xl p-4 text-sm text-zinc-905 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
                        placeholder={STEPS[currentStep].placeholder}
                      />

                      {/* AI Suggestion Preview Box */}
                      {aiSuggestion && (
                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl mt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Bot className="w-3.5 h-3.5" />
                              AI Agent Suggestion
                            </span>
                            <button
                              type="button"
                              onClick={handleInsertSuggestion}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Insert Suggestion
                            </button>
                          </div>
                          <div className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold whitespace-pre-wrap leading-relaxed">
                            {aiSuggestion}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
 
                {/* STEP 9: Summary & Apply */}
                {currentStep === 9 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">Review Generated Canvas</h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Review the distilled bullet points generated by Gemma before applying them.
                      </p>
                    </div>
 
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {STEPS.map((step) => (
                        <div key={step.key} className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                            {step.title}
                          </h4>
                          <div className="text-xs text-zinc-850 dark:text-zinc-100 font-semibold whitespace-pre-wrap leading-relaxed">
                            {distilledData[step.key] ? distilledData[step.key] : <em className="text-zinc-400">Empty response</em>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {currentStep >= 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-4">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold text-sm uppercase tracking-tight flex items-center gap-2 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}

                  {currentStep < 9 ? (
                    <button
                      onClick={handleNext}
                      disabled={loadingInsights}
                      className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:scale-100 text-white rounded-xl font-bold text-sm uppercase tracking-tight flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
                    >
                      {loadingInsights ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Distilling Response...
                        </>
                      ) : (
                        <>
                          {answers[STEPS[currentStep].key].trim() ? (
                            currentStep === 8 ? 'Generate Canvas' : 'Next Question'
                          ) : (
                            currentStep === 8 ? 'Generate Canvas (Skip empty)' : 'Skip / Next Question'
                          )}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm uppercase tracking-tight flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" />
                      Apply to BMC Grid
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
