/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, FormEvent, ChangeEvent, DragEvent } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  appleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from './firebase';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError } from './lib/firestore-utils';
import { OperationType, UserProfile, CanvasData } from './types';
import { 
  Users, 
  Sparkles,
  Search, 
  Plus, 
  Settings, 
  LogOut, 
  FileText, 
  Layout, 
  Target, 
  BarChart2, 
  Trash2, 
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Shield,
  Download,
  Share2,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Kettle } from './components/icons/Kettle';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { StrategyMap } from './components/StrategyMap';
import { SwotView } from './components/SwotView';
import { PestelView } from './components/PestelView';
import { PorterForcesView } from './components/PorterForcesView';
import { LeanCanvasView } from './components/LeanCanvasView';
import { AnsoffMatrixView } from './components/AnsoffMatrixView';
import { BcgMatrixView } from './components/BcgMatrixView';
import { ValueChainView } from './components/ValueChainView';
import { CustomerJourneyView } from './components/CustomerJourneyView';
import { BusinessPlanView } from './components/BusinessPlanView';
import { AdminDashboard } from './components/AdminDashboard';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BusinessModelCanvas } from './components/canvas/BusinessModelCanvas';
import { ToolsModal } from './components/modals/ToolsModal';
import { TourOverlay } from './components/modals/TourOverlay';
import { UsagePolicyModal } from './components/modals/UsagePolicyModal';
import { PrivacyPolicyModal } from './components/modals/PrivacyPolicyModal';
import { LicensesModal } from './components/modals/LicensesModal';
import { AIConsultant } from './components/modals/AIConsultant';
import { ReportView } from './components/layout/ReportView';
import { useCanvasData } from './hooks/useCanvasData';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // --- 1. ALL HOOKS (Must be at the top level) ---
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'canvas';

  const [viewUserId, setViewUserId] = useState<string | undefined>(undefined);
  const [impersonatedUserEmail, setImpersonatedUserEmail] = useState<string | null>(null);

  const {
    userCanvases,
    canvasData,
    setCanvasData,
    saveStatus,
    handleNewCanvas,
    handleSelectCanvas,
    handleSaveCanvas,
    handleLoadTemplate
  } = useCanvasData(user?.uid, profile, viewUserId);

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [canvasToDelete, setCanvasToDelete] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'oauth'>('oauth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [isUsagePolicyOpen, setIsUsagePolicyOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isLicensesOpen, setIsLicensesOpen] = useState(false);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);

  useEffect(() => {
    (window as any).toggleAIConsultant = () => setIsAIConsultantOpen(prev => !prev);
    return () => { delete (window as any).toggleAIConsultant; };
  }, []);

  // --- 2. EFFECTS ---
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (user && !hasCompletedTour) {
      const timer = setTimeout(() => setIsTourOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const isAdmin = currentUser.email === 'david.young@reallysimpleapps.com';
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              isPaidTier: isAdmin
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          } else {
            setProfile(userSnap.data() as UserProfile);
          }
          setIsAuthReady(true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsAuthReady(true);
        }
      } else {
        setProfile(null);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // --- 3. EVENT HANDLERS ---
  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    }
  };

  const handleAppleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (error: any) {
      console.error("Apple Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName });
        // Profile creation is handled by onAuthStateChanged
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      setAuthError(`${error.code}: ${error.message}`);
    }
  };

  const handleLogout = () => signOut(auth);

  const confirmDelete = async () => {
    if (!canvasToDelete) return;
    try {
      await deleteDoc(doc(db, 'canvases', canvasToDelete));
      if (canvasData.id === canvasToDelete) {
        handleNewCanvas();
      }
      setIsDeleteModalOpen(false);
      setCanvasToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `canvases/${canvasToDelete}`);
    }
  };

  const handleLogoUrlSubmit = () => {
    if (logoUrlInput) {
      setCanvasData(prev => ({ ...prev, logoUrl: logoUrlInput }));
      setLogoUrlInput('');
      setIsLogoModalOpen(false);
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCanvasData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
        setIsLogoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const onLogoDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCanvasData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
        setIsLogoModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = async () => {
    const isAdmin = profile?.email === 'david.young@reallysimpleapps.com';
    if (!profile?.isPaidTier && !isAdmin) {
      alert("Exporting to PDF is a Pro feature. Please upgrade.");
      return;
    }
    
    if (!canvasRef.current) return;
    
    try {
      const element = canvasRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: darkMode ? '#09090b' : '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            if (style.color.includes('oklch')) el.style.color = 'currentColor';
            if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'transparent';
            if (style.borderColor.includes('oklch')) el.style.borderColor = 'currentColor';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${canvasData.title || 'strategy-plan'}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const handleExportReport = async () => {
    const isAdmin = profile?.email === 'david.young@reallysimpleapps.com';
    if (!profile?.isPaidTier && !isAdmin) {
      alert("Full Report Export is a Pro feature. Please upgrade.");
      return;
    }

    setIsExportingReport(true);
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pages = ['report-page-1', 'report-page-2', 'report-page-3'];
      
      for (let i = 0; i < pages.length; i++) {
        const element = document.getElementById(pages[i]);
        if (!element) continue;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: darkMode ? '#09090b' : '#ffffff',
          onclone: (clonedDoc) => {
            const elements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              const style = window.getComputedStyle(el);
              if (style.color.includes('oklch')) el.style.color = 'currentColor';
              if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'transparent';
              if (style.borderColor.includes('oklch')) el.style.borderColor = 'currentColor';
            }
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`${canvasData.title || 'strategy-report'}-full.pdf`);
    } catch (error) {
      console.error("Report Export failed:", error);
      alert("Failed to export report. Please try again.");
    } finally {
      setIsExportingReport(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user || !profile) return;
    
    // Replace this URL with your actual Lemon Squeezy Checkout URL
    const CHECKOUT_URL = "https://reallysimple.lemonsqueezy.com/checkout/buy/63494c15-306e-437f-86e1-c07e367b37da";
    
    // Append the user ID to the checkout URL so we can identify them in the webhook
    const checkoutWithParams = `${CHECKOUT_URL}?checkout[custom][user_id]=${user.uid}`;
    
    // Redirect to Lemon Squeezy
    window.location.href = checkoutWithParams;
  };

  // --- 4. CONDITIONAL RENDERING (Must happen after all hooks) ---
  if (!isAuthReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4">
        <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Kettle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">Kettle Strat</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-bold uppercase tracking-widest text-[10px]">Architect your business strategy</p>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-tight">
              {authError}
            </div>
          )}

          {authMode === 'oauth' ? (
            <div className="space-y-3">
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm"
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
                className="w-full py-3.5 px-4 bg-black hover:bg-zinc-900 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.53-.67-2.87-.67-1.36 0-1.85.65-2.87.67-1.17.02-2.15-.73-3.27-1.61-2.25-1.79-3.82-5.12-3.82-7.87 0-4.33 2.72-6.64 5.3-6.64 1.31 0 2.45.82 3.25.82.73 0 2.1-.82 3.57-.82 1.5 0 2.82.71 3.66 1.83-3.11 1.83-2.61 6.18.52 7.46-.76 1.88-1.74 3.73-3.07 5.23zM12.03 7.25c-.02-2.13 1.74-3.95 3.74-4.25.26 2.41-2.04 4.41-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400">Or</span>
                </div>
              </div>

              <button 
                onClick={() => setAuthMode('signin')}
                className="w-full py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
              >
                Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Password</label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 mt-2"
              >
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              <div className="pt-4 text-center">
                <button 
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
                <div className="mt-4">
                  <button 
                    type="button"
                    onClick={() => setAuthMode('oauth')}
                    className="text-xs text-zinc-500 font-bold uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Back to social login
                  </button>
                </div>
              </div>
            </form>
          )}
          
          <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-xs mx-auto">
              The Business Model Canvas (BMC) is developed by Alexander Osterwalder and licensed under CC BY-SA 3.0. Source: Strategyzer.com.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. MAIN APP RETURN ---
  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans">
      <Sidebar 
        userProfile={profile}
        userCanvases={userCanvases}
        canvasData={canvasData}
        onSelectCanvas={handleSelectCanvas}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setCanvasToDelete={setCanvasToDelete}
        handleUpgrade={handleUpgrade}
        onLogout={handleLogout}
        handleLoadTemplate={handleLoadTemplate}
        onShowTour={() => setIsTourOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {viewUserId && (
          <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between z-50 shadow-md">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Users className="w-3 h-3" />
              Viewing User Project: {viewUserId}
            </div>
            <button 
              onClick={() => {
                setViewUserId(undefined);
                setImpersonatedUserEmail(null);
              }}
              className="text-[10px] font-black uppercase bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors border border-white/30"
            >
              Stop Viewing
            </button>
          </div>
        )}
        <Header 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setIsLogoModalOpen={setIsLogoModalOpen}
          handleSaveCanvas={handleSaveCanvas}
          handleNewCanvas={handleNewCanvas}
          saveStatus={saveStatus}
        />

        <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 relative" ref={canvasRef}>
          <div className="min-h-full relative pb-20">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-10"
                  >
                    <div className="mb-8 flex justify-between items-end">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">Project Workspace</span>
                        <input 
                          type="text"
                          value={canvasData.title}
                          onChange={(e) => setCanvasData(prev => ({ ...prev, title: e.target.value }))}
                          className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                          placeholder="Canvas Title"
                        />
                      </div>
                    </div>

                    <BusinessModelCanvas 
                      canvasData={canvasData}
                      setCanvasData={setCanvasData}
                      logoUrl={canvasData.logoUrl}
                    />
                  </motion.div>
                } />
                <Route path="/strategy-map" element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StrategyMap 
                      data={canvasData.strategyMap || { financial: [], customer: [], internal: [], learning: [] }} 
                      onChange={(mapData) => setCanvasData(prev => ({ ...prev, strategyMap: mapData }))}
                      projectTitle={canvasData.title}
                      onTitleChange={(title) => setCanvasData(prev => ({ ...prev, title }))}
                      userCanvases={userCanvases}
                      onSelectCanvas={handleSelectCanvas}
                    />
                  </motion.div>
                } />
                <Route path="/pestel" element={
                  <PestelView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/porter" element={
                  <PorterForcesView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/lean-canvas" element={
                  <LeanCanvasView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/ansoff" element={
                  <AnsoffMatrixView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/bcg" element={
                  <BcgMatrixView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/value-chain" element={
                  <ValueChainView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/customer-journey" element={
                  <CustomerJourneyView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                  />
                } />
                <Route path="/executive-summary" element={
                  <BusinessPlanView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                    type="summary"
                  />
                } />
                <Route path="/mission-vision" element={
                  <BusinessPlanView 
                    canvasData={canvasData} 
                    setCanvasData={setCanvasData} 
                    onBack={() => navigate('/')} 
                    type="identity"
                  />
                } />
                <Route path="/swot" element={
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SwotView 
                      data={canvasData.swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' }}
                      onChange={(swotData) => setCanvasData(prev => ({ ...prev, swot: swotData }))}
                      projectTitle={canvasData.title}
                      onTitleChange={(title) => setCanvasData(prev => ({ ...prev, title }))}
                      userCanvases={userCanvases}
                      onSelectCanvas={handleSelectCanvas}
                    />
                  </motion.div>
                } />
                <Route path="/admin" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminDashboard 
                      profile={profile}
                      onBack={() => {
                        window.history.pushState({}, '', '/');
                      }} 
                      onOpenCanvas={(canvas) => {
                        setViewUserId(canvas.userId);
                        // We'll find the user email later or just use ID
                        setCanvasData(canvas);
                        window.history.pushState({}, '', '/');
                      }}
                    />
                  </motion.div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>

            <div className="absolute bottom-6 right-10 flex items-center gap-2 opacity-20 pointer-events-none select-none">
              <Kettle className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
              <span className="text-[10px] font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-50">Kettle Strat</span>
            </div>
          </div>
        </div>

        <footer className="px-10 py-3 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-zinc-400 dark:text-zinc-600 font-bold uppercase tracking-widest whitespace-nowrap">
                © 2026 Really Simple Apps LLC
              </span>
              <span className="hidden md:block text-zinc-300 dark:text-zinc-800">•</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsUsagePolicyOpen(true)}
                  className="text-zinc-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  Usage Policy
                </button>
                <span className="text-zinc-300 dark:text-zinc-800">•</span>
                <button 
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="text-zinc-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  Privacy Policy
                </button>
                <span className="text-zinc-300 dark:text-zinc-800">•</span>
                <button 
                  onClick={() => setIsLicensesOpen(true)}
                  className="text-zinc-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  Licenses
                </button>
              </div>
            </div>
          </div>
        </footer>

        <ToolsModal 
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          handleExportPDF={handleExportPDF}
          handleExportReport={handleExportReport}
          canvasData={canvasData}
          setCanvasData={setCanvasData}
          logoUrlInput={logoUrlInput}
          setLogoUrlInput={setLogoUrlInput}
          handleLogoUrlSubmit={handleLogoUrlSubmit}
          handleLogoUpload={handleLogoUpload}
          fileInputRef={fileInputRef}
          onLogoDrop={onLogoDrop}
        />

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase mb-2">Delete Plan?</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  This action cannot be undone. Are you sure you want to delete this strategic plan?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setCanvasToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all uppercase tracking-tight"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all uppercase tracking-tight"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isTourOpen && (
          <TourOverlay onClose={() => setIsTourOpen(false)} />
        )}

        {isExportingReport && (
          <div className="fixed inset-0 z-[-1] opacity-0 pointer-events-none overflow-hidden bg-white">
            <ReportView 
              canvasData={canvasData}
              userCanvases={userCanvases}
              profile={profile}
            />
          </div>
        )}

        <UsagePolicyModal 
          isOpen={isUsagePolicyOpen}
          onClose={() => setIsUsagePolicyOpen(false)}
        />

        <PrivacyPolicyModal 
          isOpen={isPrivacyPolicyOpen}
          onClose={() => setIsPrivacyPolicyOpen(false)}
        />

        <LicensesModal 
          isOpen={isLicensesOpen}
          onClose={() => setIsLicensesOpen(false)}
        />

        <AIConsultant 
          canvasData={canvasData}
          isOpen={isAIConsultantOpen}
          onClose={() => setIsAIConsultantOpen(false)}
        />
      </main>
    </div>
  );
}
