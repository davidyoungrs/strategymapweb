import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-3xl max-h-[80vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Privacy Policy</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kettlestrat.com • Last Updated May 2026</p>
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
            <div className="flex-1 overflow-y-auto p-8 prose prose-zinc dark:prose-invert max-w-none prose-sm">
              <div className="space-y-8">
                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">1. Introduction</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Kettlestrat ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-generated website and application development services.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">2. Information We Collect</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Personal Data", desc: "Name, email address, and billing information collected during registration." },
                      { title: "Project Data", desc: "Files, configurations, and assets you upload or generate using our AI tools." },
                      { title: "Usage Logs", desc: "IP address, browser type, device identifiers, and interaction data." },
                      { title: "Cookies", desc: "Session maintenance, preferences, and site traffic analysis." }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <p className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">{item.title}</p>
                        <p className="text-[11px] text-zinc-500 leading-normal">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">4. AI Data Handling & Privacy</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl">
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <strong className="text-zinc-900 dark:text-zinc-100 italic block mb-1">No Public Training:</strong> 
                        We do not use your proprietary project data or private code to train our public AI models without your explicit, written consent.
                      </p>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-900 dark:text-zinc-100">Private by Design:</strong> We treat your prompts and the resulting AI-generated code as your private data.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">6. Data Security</h3>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0">✓</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">256-bit SSL Encryption:</strong> For all data transfers.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0">✓</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">Redundant Backups:</strong> To prevent data loss.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0">✓</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">Access Controls:</strong> Restricted access limited to essential support staff only.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">9. Contact Us</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at: <br/>
                    <a href="mailto:info@reallysimpleapps.com" className="text-blue-600 font-bold hover:underline">info@reallysimpleapps.com</a>
                  </p>
                </section>
              </div>
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
