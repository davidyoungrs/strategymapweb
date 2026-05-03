import React, { useState, useEffect, useRef } from 'react';
import { LlmInference, FilesetResolver } from '@mediapipe/tasks-genai';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Bot, ArrowRight, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CanvasData } from '../types';

interface AIConsultantProps {
  canvasData: CanvasData;
  isOpen: boolean;
  onClose: () => void;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ canvasData, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const llmInferenceRef = useRef<LlmInference | null>(null);

  // Initialize MediaPipe Gemma Model
  const initModel = async () => {
    if (llmInferenceRef.current) return;
    
    setModelLoading(true);
    setError(null);
    try {
      const genaiFileset = await FilesetResolver.forGenAiTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
      );

      // Use local model on localhost for speed, Cloudflare R2 on production
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

  const getInsights = async () => {
    setError(null);
    if (!llmInferenceRef.current) {
      await initModel();
    }

    if (!llmInferenceRef.current) return;

    setLoading(true);
    setSuggestion('');
    try {
      const prompt = `
        You are a Strategic Consultant for Kettle Strat. 
        Review this plan and suggest 3 high-impact additions.
        
        PLAN: ${canvasData.title}
        Executive Summary: ${canvasData.businessPlan?.executiveSummary || 'Not provided'}
        Mission: ${canvasData.businessPlan?.mission || 'Not provided'}
        Vision: ${canvasData.businessPlan?.vision || 'Not provided'}
        TAM: ${canvasData.marketSizing?.tam || 'Not provided'}
        SAM: ${canvasData.marketSizing?.sam || 'Not provided'}
        SOM: ${canvasData.marketSizing?.som || 'Not provided'}
        Financials: ${canvasData.financials?.years.map(y => `Y${y.year}: Rev $${y.revenue}, Profit $${y.revenue - y.cogs - y.operatingExpenses}`).join('; ') || 'Not provided'}
        Risks: ${canvasData.riskRegister?.map(r => `${r.risk} (Prob: ${r.probability}, Impact: ${r.impact})`).join(', ') || 'None'}
        Value Props: ${canvasData.valuePropositions}
        Segments: ${canvasData.customerSegments}
        Revenue: ${canvasData.revenueStreams}
        
        Provide feedback on how well the business plan aligns with the core strategy. Provide suggestions in Markdown format. Be brief.
      `;

      // MediaPipe Gemma 2B Inference
      const result = await llmInferenceRef.current!.generateResponse(prompt);
      setSuggestion(result);
    } catch (err: any) {
      console.error('Inference Error:', err);
      setError('AI Inference failed. Your device might not support WebGL/WebGPU local models.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !llmInferenceRef.current && !modelLoading) {
      // We don't auto-load because it's 1.5GB. We let the user trigger it.
    }
  }, [isOpen]);

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
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Kettle AI</h2>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!suggestion && !loading && !modelLoading && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-400">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-2 uppercase">Ready for Analysis?</h3>
                  <p className="text-sm text-zinc-500 mb-8 max-w-[240px] mx-auto leading-relaxed">
                    I'll use **Gemma 2B** running locally on your device to analyze your strategic plan. No data leaves your machine.
                  </p>
                  <button
                    onClick={getInsights}
                    className="w-full py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-black"
                  >
                    Generate Insights
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="mt-4 text-[10px] text-zinc-400 uppercase font-bold tracking-widest">First run downloads ~1.5GB model</p>
                </div>
              )}

              {modelLoading && (
                <div className="text-center py-20">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-6" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Waking up Gemma...</h3>
                  <p className="text-xs text-zinc-500 mt-2 italic">Loading local AI weights into memory</p>
                </div>
              )}

              {loading && (
                <div className="space-y-6">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] animate-pulse">Analyzing Strategic Blindspots...</p>
                </div>
              )}

              {suggestion && (
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Gemma Insights</span>
                    </div>
                    <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <ReactMarkdown>
                        {suggestion}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <button 
                    onClick={getInsights}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Regenerate Insights
                  </button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <Shield className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">100% On-Device • Private • Secure</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mock Shield icon since I didn't import it
const Shield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
