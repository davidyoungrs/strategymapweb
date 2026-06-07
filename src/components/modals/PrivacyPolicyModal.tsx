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
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">1. What Information We Collect</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We may collect and process the following personal data:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>Your name</li>
                    <li>Contact details (phone number, email address)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">2. How We Use Your Information</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We use your data to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>Contact you regarding the services and solutions we offer.</li>
                    <li>Maintain internal records.</li>
                    <li>Comply with legal or regulatory obligations.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">3. Legal Basis for Processing</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We process your personal data under the following lawful bases:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>Contract (to provide services you have requested)</li>
                    <li>Legitimate interests (to manage our business effectively)</li>
                    <li>Legal obligations (where applicable)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">4. Data Sharing</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We do not sell or rent your personal data. We may share your data with:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>Service providers (e.g., booking systems) who process data on our behalf.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">5. Data Retention</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We retain your data only as long as necessary to fulfil the purposes we collected it for, including legal, accounting, or reporting requirements.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">6. Data Security</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We take appropriate technical and organisational measures to protect your personal data from unauthorised access, loss, or misuse.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">7. Your Rights</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Under UK GDPR, you have the right to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-zinc-600 dark:text-zinc-400 space-y-1">
                    <li>Access your personal data.</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to or restrict processing.</li>
                    <li>Withdraw consent at any time (where applicable)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">8. Contact Us</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    If you have any questions about this privacy notice or your data, please contact: <br/>
                    <a href="mailto:info@reallysimpleapps.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">info@reallysimpleapps.com</a>
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">9. Complaints</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    You have the right to lodge a complaint with the Information Commissioner’s Office (ICO) if you believe your data has been handled improperly.
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
