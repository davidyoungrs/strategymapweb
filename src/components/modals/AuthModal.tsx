import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Kettle } from '../icons/Kettle';
import { 
  auth, 
  googleProvider, 
  appleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from '../../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, title }) => {
  const [authMode, setAuthMode] = useState<'oauth' | 'signin' | 'signup'>('oauth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, appleProvider);
      onClose();
    } catch (error: any) {
      console.error("Apple Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      if (authMode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[80] overflow-y-auto flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800 my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Logo & Text */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <Kettle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
                {title || 'Unlock Pro Features'}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[9px] mt-1">
                Save plans, export PDFs & unlock AI analysis
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-tight">
                {authError}
              </div>
            )}

            {/* Main Form/Buttons Area */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Authenticating...</p>
              </div>
            ) : authMode === 'oauth' ? (
              <div className="space-y-3">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
                <button 
                  onClick={handleAppleLogin}
                  className="w-full py-3.5 px-4 bg-black hover:bg-zinc-900 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.53-.67-2.87-.67-1.36 0-1.85.65-2.87.67-1.17.02-2.15-.73-3.27-1.61-2.25-1.79-3.82-5.12-3.82-7.87 0-4.33 2.72-6.64 5.3-6.64 1.31 0 2.45.82 3.25.82.73 0 2.1-.82 3.57-.82 1.5 0 2.82.71 3.66 1.83-3.11 1.83-2.61 6.18.52 7.46-.76 1.88-1.74 3.73-3.07 5.23zM12.03 7.25c-.02-2.13 1.74-3.95 3.74-4.25.26 2.41-2.04 4.41-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold">
                    <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400">Or</span>
                  </div>
                </div>

                <button 
                  onClick={() => setAuthMode('signin')}
                  className="w-full py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  Continue with Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-50"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-50"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-zinc-900 dark:text-zinc-50"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 mt-2 cursor-pointer text-sm"
                >
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>

                <div className="pt-2 text-center">
                  <button 
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                  <div className="mt-3">
                    <button 
                      type="button"
                      onClick={() => setAuthMode('oauth')}
                      className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      Back to social login
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-xs mx-auto">
                Secure authentication powered by Firebase. By signing in, you agree to our Terms of Service & Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
