import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const STEPS: TourStep[] = [
  {
    title: "Welcome to Kettle Strat",
    content: "Design, visualize, and export your strategic frameworks in one unified workspace. Let's take a 30-second tour.",
    position: 'center'
  },
  {
    title: "Project Management",
    content: "All your strategic plans are stored here. You can create new ones, switch between them, or delete old versions.",
    target: "aside",
    position: 'right'
  },
  {
    title: "Dynamic Frameworks",
    content: "Switch between the Business Model Canvas, Strategy Map, and SWOT Analysis. They all share the same project data.",
    target: "nav",
    position: 'right'
  },
  {
    title: "Autosave Enabled",
    content: "Don't worry about losing work. Every edit you make is automatically synced to the cloud every few seconds.",
    target: "header",
    position: 'bottom'
  },
  {
    title: "Professional Exports",
    content: "Use the Tools menu to add your company logo and export your strategy as a premium PDF document.",
    target: "button[title='Tools']",
    position: 'bottom'
  }
];

interface TourOverlayProps {
  onClose: () => void;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasCompletedTour', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleComplete}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <button 
                  onClick={handleComplete}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-8">
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.content}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-4 bg-blue-600' : 'w-1 bg-zinc-200 dark:bg-zinc-800'}`} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button 
                      onClick={handleBack}
                      className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-1 bg-zinc-100 dark:bg-zinc-900">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                className="h-full bg-blue-600"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
