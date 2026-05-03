import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ExternalLink } from 'lucide-react';

interface LicensesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicensesModal: React.FC<LicensesModalProps> = ({ isOpen, onClose }) => {
  const licenses = [
    {
      name: "Google Gemma AI Model",
      type: "Google Gemma Terms of Use",
      desc: "Gemma is a family of lightweight, state-of-the-art open models built from the same technology used to create the Gemini models. Use of Gemma is subject to Google's Additional Terms of Service.",
      link: "https://www.kaggle.com/models/google/gemma/license/consent"
    },
    {
      name: "Business Model Canvas",
      type: "CC BY-SA 3.0",
      desc: "Developed by Alexander Osterwalder. The Business Model Canvas is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.",
      link: "https://strategyzer.com"
    },
    {
      name: "MediaPipe GenAI",
      type: "Apache License 2.0",
      desc: "On-device machine learning platform for mobile, web, and edge devices.",
      link: "https://github.com/google/mediapipe"
    },
    {
      name: "React & React DOM",
      type: "MIT License",
      desc: "A JavaScript library for building user interfaces.",
      link: "https://reactjs.org"
    },
    {
      name: "Tailwind CSS",
      type: "MIT License",
      desc: "A utility-first CSS framework for rapid UI development.",
      link: "https://tailwindcss.com"
    },
    {
      name: "Lucide Icons",
      type: "ISC License",
      desc: "Beautiful & consistent icons made by the community.",
      link: "https://lucide.dev"
    },
    {
      name: "jsPDF & html2canvas",
      type: "MIT / Blueoak",
      desc: "Libraries used for generating PDF strategic reports.",
      link: "https://github.com/parallax/jsPDF"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Open Source Licenses</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kettle Strat Dependencies & Frameworks</p>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {licenses.map((lib, i) => (
                <div key={i} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group hover:border-blue-500/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">{lib.name}</h3>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{lib.type}</span>
                    </div>
                    <a 
                      href={lib.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {lib.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-bold transition-all text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
