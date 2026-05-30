import React, { useState, useEffect, useRef } from 'react';
import type { LlmInference } from '@mediapipe/tasks-genai';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Bot, ArrowRight, MessageSquare, Send, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CanvasData } from '../../types';

interface AIConsultantProps {
  canvasData: CanvasData;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ canvasData, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I am Kettle AI, your strategic consultant. I've analyzed your project context. Ask me anything about your strategy, potential blindspots, or market opportunities!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const llmInferenceRef = useRef<LlmInference | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

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
        if (cleanSessionTranscript) {
          setInputValue(prev => prev ? `${prev} ${cleanSessionTranscript}` : cleanSessionTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in AI Consultant:', event.error);
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
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in AI Consultant:', error);
      setIsListening(false);
    }
  };

  const initModel = async () => {
    if (llmInferenceRef.current) return;
    
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

      console.log(`🤖 Loading model from: ${MODEL_URL}`);

      const genai = await LlmInference.createFromOptions(genaiFileset, {
        baseOptions: {
          modelAssetPath: MODEL_URL
        },
        maxTokens: 512,
        temperature: 0.7,
        topK: 40,
      });
      llmInferenceRef.current = genai;
    } catch (err: any) {
      console.error('Detailed Model Load Error:', err);
      if (err.message?.includes('Fetch')) {
        setError('Model file not found. Did you place "gemma-2b-it-gpu.bin" in public/models/?');
      } else if (err.message?.includes('format')) {
        setError('Incorrect model format. Please ensure you downloaded the "TFLite" version of Gemma 2B from Kaggle.');
      } else {
        setError(`Failed to wake up Gemma: ${err.message || 'Unknown hardware error'}`);
      }
    } finally {
      setModelLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const textToSend = inputValue.trim();
    if (!textToSend || loading || modelLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      if (!llmInferenceRef.current) {
        await initModel();
      }

      if (!llmInferenceRef.current) {
        setLoading(false);
        return;
      }

      const prompt = `
        You are Kettle AI, a Strategic Consultant for Kettle Strat.
        Below is the context of the user's strategic plan:
        PLAN TITLE: ${canvasData.title || 'Untitled Strategic Plan'}
        Executive Summary: ${canvasData.businessPlan?.executiveSummary || 'Not provided'}
        Mission: ${canvasData.businessPlan?.mission || 'Not provided'}
        Vision: ${canvasData.businessPlan?.vision || 'Not provided'}
        TAM/SAM/SOM: ${canvasData.marketSizing?.tam || 'N/A'} / ${canvasData.marketSizing?.sam || 'N/A'} / ${canvasData.marketSizing?.som || 'N/A'}
        Value Props: ${canvasData.valuePropositions || 'N/A'}
        Segments: ${canvasData.customerSegments || 'N/A'}
        
        Chat History:
        ${newMessages.map(m => `${m.role === 'user' ? 'User' : 'Consultant'}: ${m.content}`).join('\n')}
        
        Provide your next response to the user. Keep it strategic, concise, actionable, and formatted in clean Markdown. Do not repeat the prompt.
      `;

      const result = await llmInferenceRef.current.generateResponse(prompt);
      setMessages([...newMessages, { role: 'assistant', content: result }]);
    } catch (err: any) {
      console.error('Inference Error:', err);
      setError('AI Inference failed. Your device might not support WebGL/WebGPU local models.');
    } finally {
      setLoading(false);
    }
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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[70] flex flex-col border-l border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-55 uppercase">Kettle AI</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Local Strategic Consultant</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content / Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-zinc-105 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                      {m.role === 'user' ? (
                        <span className="text-[9px] font-black uppercase tracking-widest">You</span>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Kettle AI</span>
                        </>
                      )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-sm break-words">
                      <ReactMarkdown>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {modelLoading && (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Waking up Gemma...</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 italic">Loading model weights locally</p>
                </div>
              )}

              {loading && !modelLoading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Thinking...</span>
                    </div>
                    <div className="h-4 bg-zinc-250 dark:bg-zinc-700 rounded w-24"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-xs text-red-650 dark:text-red-400 font-medium">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box with Voice Integration */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask Kettle AI a question..."
                  className="flex-1 min-h-[44px] max-h-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ring-blue-500/20 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-650 resize-none font-semibold"
                  rows={1}
                />
                
                {isSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 ${
                      isListening
                        ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40 border-transparent'
                        : 'bg-white dark:bg-zinc-950 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                    title={isListening ? 'Stop dictating' : 'Voice search / dictate'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                )}

                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading || modelLoading}
                  className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md shadow-blue-500/10`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-450 dark:text-zinc-550 justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">100% Local Model</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Kettle Strat v1.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mock Shield icon
const Shield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
