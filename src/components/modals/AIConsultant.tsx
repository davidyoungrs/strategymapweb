import React, { useState, useEffect, useRef } from 'react';
import type { LlmInference } from '@mediapipe/tasks-genai';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Bot, Send, Mic, MicOff } from 'lucide-react';
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

const generateFallbackConsultantResponse = (
  text: string, 
  canvasData: CanvasData, 
  history: Message[]
): string => {
  const query = text.toLowerCase();
  const title = canvasData.title || 'your strategy project';
  const valProps = canvasData.valuePropositions || '';
  const segments = canvasData.customerSegments || '';
  const execSummary = canvasData.businessPlan?.executiveSummary || '';
  const mission = canvasData.businessPlan?.mission || '';
  
  let response = `### Strategic Analysis: ${title}\n\n`;
  
  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || history.length <= 1) {
    response += `Hello! I am your strategic consultant. Although local hardware acceleration (WebGL/WebGPU) is currently unavailable, I can still analyze your plan.\n\n`;
    if (execSummary) {
      response += `I see you have drafted an **Executive Summary** for **${title}**. What would you like me to review? (e.g., SWOT, target market, value propositions, or staff structures).`;
    } else {
      response += `To get started, tell me about your business model or type **"review"** and I will perform a completeness audit on your current canvas inputs.`;
    }
    return response;
  }
  
  if (query.includes('review') || query.includes('audit') || query.includes('complete') || query.includes('gap')) {
    response += `Here is a completeness audit of your strategy maps and plan details for **${title}**:\n\n`;
    
    if (execSummary.trim()) {
      response += `*   **Executive Summary**: *Complete.* Good coverage of your core proposal.\n`;
    } else {
      response += `*   **Executive Summary**: *Missing.* I recommend drafting a summary of your strategy map and goals first.\n`;
    }
    
    if (valProps.trim()) {
      response += `*   **Value Propositions**: *Complete.* ("${valProps.substring(0, 80)}...")\n`;
    } else {
      response += `*   **Value Propositions**: *Missing.* Fill out the Value Propositions card in the main Business Model Canvas.\n`;
    }

    if (segments.trim()) {
      response += `*   **Customer Segments**: *Complete.* Mapped to target group: "${segments.substring(0, 80)}..."\n`;
    } else {
      response += `*   **Customer Segments**: *Missing.* Define your target customer cohorts on the main canvas.\n`;
    }
    
    const personnel = canvasData.businessPlan?.keyPersonnel || [];
    if (personnel.length > 0) {
      response += `*   **Key Personnel**: *Complete.* (${personnel.length} owner/director profiles configured).\n`;
    } else {
      response += `*   **Key Personnel**: *No profiles.* Add details of your founders and directors in the Business Details & Personnel page.\n`;
    }

    const staff = canvasData.businessPlan?.staffMembers || [];
    if (staff.length > 0) {
      response += `*   **Workforce & Staffing**: *Complete.* (${staff.length} staff member roles defined).\n`;
    } else {
      response += `*   **Workforce & Staffing**: *No operational staff.* Consider logging your required operational workforce in Business Details & Personnel.\n`;
    }
    
    response += `\n**Next Steps Recommendation:**\n`;
    if (!execSummary) {
      response += `1. Draft your **Executive Summary** to unify your vision.\n`;
    }
    if (!valProps || !segments) {
      response += `2. Link your **Value Propositions** to your **Customer Segments** for product-market fit.\n`;
    } else {
      response += `Your strategic foundation is looking solid! Let me know if you would like me to review specific pricing or competitor parameters.`;
    }
    return response;
  }
  
  if (query.includes('market') || query.includes('tam') || query.includes('sam') || query.includes('som')) {
    const tam = canvasData.marketSizing?.tam || '';
    const sam = canvasData.marketSizing?.sam || '';
    const som = canvasData.marketSizing?.som || '';
    response += `**Market Sizing & Customer Segment Audit:**\n\n`;
    if (tam || sam || som) {
      response += `You have configured the following metrics:\n`;
      if (tam) response += `*   **TAM (Total Addressable Market)**: ${tam}\n`;
      if (sam) response += `*   **SAM (Serviceable Addressable Market)**: ${sam}\n`;
      if (som) response += `*   **SOM (Serviceable Obtainable Market)**: ${som}\n`;
      response += `\nEnsure your SAM represents the segment you can realistically target with your current channels, and SOM reflects your immediate capture capacity within 1-2 years.`;
    } else {
      response += `You haven't entered market sizing metrics yet. Head over to the **Market & Customers** tab and input values for TAM, SAM, and SOM to calculate your addressable audience.`;
    }
    return response;
  }

  if (query.includes('staff') || query.includes('personnel') || query.includes('hire') || query.includes('workforce') || query.includes('salary')) {
    const staff = canvasData.businessPlan?.staffMembers || [];
    const personnel = canvasData.businessPlan?.keyPersonnel || [];
    response += `**Human Resources & Staffing Analysis:**\n\n`;
    if (staff.length > 0 || personnel.length > 0) {
      response += `Current workforce footprint:\n`;
      if (personnel.length > 0) {
        response += `*   **Key Personnel / Management**: ${personnel.map(p => `${p.name} (${p.position})`).join(', ')}\n`;
      }
      if (staff.length > 0) {
        response += `*   **Operational Staff**: ${staff.map(s => `${s.role} (Cost: ${s.totalCost})`).join(', ')}\n`;
      }
    } else {
      response += `No personnel or operational staff details have been logged yet. Please head to **Business Details & Personnel** to populate your leadership team and operational workforce.`;
    }
    return response;
  }

  response += `Thank you for your message. Since local WebGPU/WebGL model inference is inactive on your browser/device, I have generated feedback based on your plan:\n\n`;
  response += `*   **Project Title**: ${title}\n`;
  if (mission) response += `*   **Mission**: "${mission}"\n`;
  if (valProps) response += `*   **Core Value Proposition**: "${valProps}"\n\n`;
  response += `I can help you audit your business plan elements. Type **\"review\"** to check for missing items, **\"market\"** to audit market sizes, or **\"staff\"** to review staffing models.`;
  
  return response;
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
        const fallbackResult = generateFallbackConsultantResponse(textToSend, canvasData, newMessages);
        setMessages([...newMessages, { role: 'assistant', content: fallbackResult }]);
        setError('Note: Running in compatibility fallback mode due to local model loading error.');
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
      const fallbackResult = generateFallbackConsultantResponse(textToSend, canvasData, newMessages);
      setMessages([...newMessages, { role: 'assistant', content: fallbackResult }]);
      setError('Note: Running in compatibility fallback mode due to model execution failure.');
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
