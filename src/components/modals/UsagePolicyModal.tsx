import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';

interface UsagePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsagePolicyModal: React.FC<UsagePolicyModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Usage Policy</h2>
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
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">1. Acceptance of Terms</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    By accessing or using Kettlestrat.com (the "Service"), you agree to be bound by this Usage Policy. If you do not agree to these terms, please do not use the Service.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">2. User Responsibilities & AI Content</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    Kettlestrat provides tools for developing AI-generated websites and applications.
                  </p>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 shrink-0">•</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">Human-in-the-Loop:</strong> You acknowledge that while the Service utilizes AI to generate code, layouts, and content, you are solely responsible for reviewing, debugging, and validating all outputs.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 shrink-0">•</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">Accuracy:</strong> Kettlestrat does not guarantee the accuracy, functionality, or security of AI-generated code. Use of such code is at your own risk.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 shrink-0">•</span>
                      <span><strong className="text-zinc-900 dark:text-zinc-100">Account Security:</strong> You are responsible for safeguarding your credentials and for all activities that occur under your account.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">3. Prohibited Conduct</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">You agree not to use the Service to:</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Illegal Acts", desc: "Create, host, or distribute content that violates local, state, national, or international laws." },
                      { title: "Harmful Content", desc: "Generate or share material that is adult in nature (sexually explicit), promotes hatred, discrimination, harassment, or violence." },
                      { title: "Malicious Code", desc: "Upload or distribute viruses, worms, malware, or any scripts intended to disrupt systems." },
                      { title: "Spam & Deception", desc: "Use the Service for 'link farming,' phishing, or creating deceptive content intended to mislead users." }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <p className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">{item.title}</p>
                        <p className="text-[11px] text-zinc-500 leading-normal">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">4. Intellectual Property</h3>
                  <div className="space-y-4">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-900 dark:text-zinc-100">Your Content:</strong> You retain rights to the original content you provide. By using the Service, you grant Kettlestrat a license to host and process this content to provide the Service to you.
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <strong className="text-zinc-900 dark:text-zinc-100">AI Outputs:</strong> You are responsible for ensuring you have the legal right to use and distribute the code and assets generated by the AI.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">5. Service Availability & "As-Is" Provision</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 py-1">
                    The Service and all AI-generated outputs are provided on an "as-is" and "as-available" basis. Kettlestrat disclaims all warranties, express or implied.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">7. Contact Information</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    For questions regarding this policy, please contact us at: <br/>
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
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
