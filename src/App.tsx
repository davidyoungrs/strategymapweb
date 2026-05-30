/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, FormEvent, ChangeEvent, DragEvent, lazy, Suspense } from 'react';
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
  ChevronUp,
  Grid3X3,
  PieChart,
  Link,
  Route as RouteIcon,
  AlertTriangle
} from 'lucide-react';
import { Kettle } from './components/icons/Kettle';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BusinessModelCanvas } from './components/canvas/BusinessModelCanvas';

// Strategic Views (Lazy Loaded)
const StrategyMap = lazy(() => import('./components/StrategyMap').then(m => ({ default: m.StrategyMap })));
const SwotView = lazy(() => import('./components/SwotView').then(m => ({ default: m.SwotView })));
const PestelView = lazy(() => import('./components/PestelView').then(m => ({ default: m.PestelView })));
const PorterForcesView = lazy(() => import('./components/PorterForcesView').then(m => ({ default: m.PorterForcesView })));
const LeanCanvasView = lazy(() => import('./components/LeanCanvasView').then(m => ({ default: m.LeanCanvasView })));
const AnsoffMatrixView = lazy(() => import('./components/AnsoffMatrixView').then(m => ({ default: m.AnsoffMatrixView })));
const BcgMatrixView = lazy(() => import('./components/BcgMatrixView').then(m => ({ default: m.BcgMatrixView })));
const ValueChainView = lazy(() => import('./components/ValueChainView').then(m => ({ default: m.ValueChainView })));
const CustomerJourneyView = lazy(() => import('./components/CustomerJourneyView').then(m => ({ default: m.CustomerJourneyView })));
const MarketSizingView = lazy(() => import('./components/MarketSizingView').then(m => ({ default: m.MarketSizingView })));
const RiskRegisterView = lazy(() => import('./components/RiskRegisterView').then(m => ({ default: m.RiskRegisterView })));
const FinancialProjectionsView = lazy(() => import('./components/FinancialProjectionsView').then(m => ({ default: m.FinancialProjectionsView })));
const BusinessPlanView = lazy(() => import('./components/BusinessPlanView').then(m => ({ default: m.BusinessPlanView })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Modals & Layouts (Lazy Loaded)
const ToolsModal = lazy(() => import('./components/modals/ToolsModal').then(m => ({ default: m.ToolsModal })));
const TourOverlay = lazy(() => import('./components/modals/TourOverlay').then(m => ({ default: m.TourOverlay })));
const UsagePolicyModal = lazy(() => import('./components/modals/UsagePolicyModal').then(m => ({ default: m.UsagePolicyModal })));
const PrivacyPolicyModal = lazy(() => import('./components/modals/PrivacyPolicyModal').then(m => ({ default: m.PrivacyPolicyModal })));
const LicensesModal = lazy(() => import('./components/modals/LicensesModal').then(m => ({ default: m.LicensesModal })));
const AIConsultant = lazy(() => import('./components/modals/AIConsultant').then(m => ({ default: m.AIConsultant })));
const ReportView = lazy(() => import('./components/layout/ReportView').then(m => ({ default: m.ReportView })));
const AuthModal = lazy(() => import('./components/modals/AuthModal').then(m => ({ default: m.AuthModal })));
const BmcGuidedDrawer = lazy(() => import('./components/modals/BmcGuidedDrawer').then(m => ({ default: m.BmcGuidedDrawer })));

import { useCanvasData } from './hooks/useCanvasData';
import { Routes, Route, Navigate, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Landing Pages (Lazy Loaded)
const LandingHome = lazy(() => import('./landing/pages/Home'));
const LandingBookings = lazy(() => import('./landing/pages/Bookings'));
const LandingPrivacy = lazy(() => import('./landing/pages/PrivacyPolicy'));
const LandingTerms = lazy(() => import('./landing/pages/TermsOfService'));

import LandingHeader from './landing/components/layout/Header';
import LandingFooter from './landing/components/layout/Footer';
import ScrollToTop from './landing/components/utils/ScrollToTop';

export default function App() {
  // --- 1. ALL HOOKS (Must be at the top level) ---
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      return true;
    }
    return true;
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname.substring(1) || 'canvas';

  const [forceStandardMode, setForceStandardMode] = useState(false);
  const isAdmin = profile?.email === 'david.young@reallysimpleapps.com' || profile?.email === 'david.young@celerosft.com';
  const isPremium = (profile?.isPaidTier || isAdmin) && !forceStandardMode;

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
  const [isMoreModelsOpen, setIsMoreModelsOpen] = useState(
    ['porter', 'lean-canvas', 'ansoff', 'bcg', 'value-chain', 'customer-journey', 'market-sizing', 'risk-register'].includes(currentView)
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [canvasToDelete, setCanvasToDelete] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isExportingReport, setIsExportingReport] = useState(false);
  const [isUsagePolicyOpen, setIsUsagePolicyOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isLicensesOpen, setIsLicensesOpen] = useState(false);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBmcGuidedOpen, setIsBmcGuidedOpen] = useState(false);

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
            const isAdmin = currentUser.email === 'david.young@reallysimpleapps.com' || currentUser.email === 'david.young@celerosft.com';
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
          const defaultView = clonedDoc.defaultView || window;
          
          // Setup canvas color converter in cloned document context
          const helperCanvas = clonedDoc.createElement('canvas');
          helperCanvas.width = 1;
          helperCanvas.height = 1;
          const helperCtx = helperCanvas.getContext('2d', { willReadFrequently: true });

          const convertOklToRgb = (colorStr: string): string => {
            if (!helperCtx) return 'transparent';
            helperCtx.clearRect(0, 0, 1, 1);
            helperCtx.fillStyle = colorStr;
            helperCtx.fillRect(0, 0, 1, 1);
            const imgData = helperCtx.getImageData(0, 0, 1, 1).data;
            if (imgData[3] === 0) return 'rgba(0,0,0,0)';
            return `rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, ${(imgData[3] / 255).toFixed(3)})`;
          };

          const replaceOklColors = (val: string): string => {
            const oklRegex = /(oklab|oklch)\([^)]+\)/g;
            return val.replace(oklRegex, (match) => {
              try {
                return convertOklToRgb(match);
              } catch (e) {
                return 'transparent';
              }
            });
          };

          const colorProps = [
            'color', 'backgroundColor', 
            'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor',
            'fill', 'stroke', 'outlineColor', 'boxShadow', 'backgroundImage'
          ];

          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = defaultView.getComputedStyle(el);
            if (!style) continue;
            
            for (const prop of colorProps) {
              const val = (style as any)[prop];
              if (typeof val === 'string' && val.includes('okl')) {
                const cleanedVal = replaceOklColors(val);
                el.style.setProperty(prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), cleanedVal);
              }
            }
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
      const moreModelViews = ['porter', 'lean-canvas', 'ansoff', 'bcg', 'value-chain', 'customer-journey', 'market-sizing', 'risk-register'];
      
      for (let i = 0; i < pages.length; i++) {
        const element = document.getElementById(pages[i]);
        if (!element) continue;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: darkMode ? '#09090b' : '#ffffff',
          onclone: (clonedDoc) => {
            const elements = clonedDoc.getElementsByTagName('*');
            const defaultView = clonedDoc.defaultView || window;
            
            // Setup canvas color converter in cloned document context
            const helperCanvas = clonedDoc.createElement('canvas');
            helperCanvas.width = 1;
            helperCanvas.height = 1;
            const helperCtx = helperCanvas.getContext('2d', { willReadFrequently: true });

            const convertOklToRgb = (colorStr: string): string => {
              if (!helperCtx) return 'transparent';
              helperCtx.clearRect(0, 0, 1, 1);
              helperCtx.fillStyle = colorStr;
              helperCtx.fillRect(0, 0, 1, 1);
              const imgData = helperCtx.getImageData(0, 0, 1, 1).data;
              if (imgData[3] === 0) return 'rgba(0,0,0,0)';
              return `rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, ${(imgData[3] / 255).toFixed(3)})`;
            };

            const replaceOklColors = (val: string): string => {
              const oklRegex = /(oklab|oklch)\([^)]+\)/g;
              return val.replace(oklRegex, (match) => {
                try {
                  return convertOklToRgb(match);
                } catch (e) {
                  return 'transparent';
                }
              });
            };

            const colorProps = [
              'color', 'backgroundColor', 
              'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor',
              'fill', 'stroke', 'outlineColor', 'boxShadow', 'backgroundImage'
            ];

            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              const style = defaultView.getComputedStyle(el);
              if (!style) continue;
              
              for (const prop of colorProps) {
                const val = (style as any)[prop];
                if (typeof val === 'string' && val.includes('okl')) {
                  const cleanedVal = replaceOklColors(val);
                  el.style.setProperty(prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), cleanedVal);
                }
              }
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
    const CHECKOUT_URL = "https://kettlestrat.lemonsqueezy.com/checkout/buy/12e6ba8d-cee5-4c1f-9fdd-4dff3e4ed09d";
    
    // Append the user ID to the checkout URL so we can identify them in the webhook
    const checkoutWithParams = `${CHECKOUT_URL}?checkout[custom][user_id]=${user.uid}`;
    
    // Redirect to Lemon Squeezy
    window.location.href = checkoutWithParams;
  };

  // --- 4. CONDITIONAL RENDERING (Must happen after all hooks) ---
  const isPublicRoute = ['/aboutus', '/bookings', '/privacy', '/terms'].includes(location.pathname);
  
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-hidden flex flex-col">
        <ScrollToTop />
        <LandingHeader />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/aboutus" element={<LandingHome />} />
              <Route path="/bookings" element={<LandingBookings />} />
              <Route path="/privacy" element={<LandingPrivacy />} />
              <Route path="/terms" element={<LandingTerms />} />
            </Routes>
          </Suspense>
        </main>
        <LandingFooter />
      </div>
    );
  }

  if (!isAuthReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin" />
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
        isPremium={isPremium}
        onAuthRequired={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Developer Toggle - Localhost Only */}
        {window.location.hostname === 'localhost' && isAdmin && (
          <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Dev Preview</span>
            <button 
              onClick={() => setForceStandardMode(!forceStandardMode)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
                forceStandardMode ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {forceStandardMode ? 'Standard (Locked)' : 'Admin (Unlocked)'}
              </span>
            </button>
          </div>
        )}
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
          isPremium={isPremium}
          isGuest={!user}
          onAuthRequired={() => setIsAuthModalOpen(true)}
        />

        <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 relative" ref={canvasRef}>
          <div className="min-h-full relative pb-20">
            <AnimatePresence mode="wait">
              <Suspense fallback={
                <div className="flex h-[80vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              }>
                <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-10"
                  >
                    <div className="mb-8 flex justify-between items-end gap-8">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">Project Workspace</span>
                        <input 
                          type="text"
                          value={canvasData.title}
                          onChange={(e) => setCanvasData(prev => ({ ...prev, title: e.target.value }))}
                          className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none focus:ring-0 p-0 w-full uppercase"
                          placeholder="Canvas Title"
                        />
                      </div>
                      <div className="text-right hidden md:block pt-4">
                        <button
                          onClick={() => setIsBmcGuidedOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-md shadow-blue-500/10 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-100" />
                          Guided BMC
                        </button>
                      </div>
                    </div>

                    <BusinessModelCanvas 
                      canvasData={canvasData}
                      setCanvasData={setCanvasData}
                      logoUrl={canvasData.logoUrl}
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
                {isPremium && (
                  <>
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
                    <Route path="/market-sizing" element={
                      <MarketSizingView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/risk-register" element={
                      <RiskRegisterView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/financials" element={
                      <FinancialProjectionsView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/executive-summary" element={
                      <BusinessPlanView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        type="summary"
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/mission-vision" element={
                      <BusinessPlanView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        type="identity"
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/business-details" element={
                      <BusinessPlanView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        type="details"
                        onBack={() => navigate('/')} 
                      />
                    } />
                    <Route path="/strategic-policy" element={
                      <BusinessPlanView 
                        canvasData={canvasData} 
                        setCanvasData={setCanvasData} 
                        type="policy"
                        onBack={() => navigate('/')} 
                      />
                    } />
                  </>
                )}
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
             </Suspense>
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
                <RouterLink 
                  to="/aboutus"
                  className="text-zinc-500 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  About Us
                </RouterLink>
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
        
        <Suspense fallback={null}>
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

          <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          <BmcGuidedDrawer 
            isOpen={isBmcGuidedOpen}
            onClose={() => setIsBmcGuidedOpen(false)}
            onApply={(distilledData) => {
              setCanvasData(prev => ({
                ...prev,
                ...distilledData
              }));
            }}
            currentData={{
              keyPartners: canvasData.keyPartners || '',
              keyActivities: canvasData.keyActivities || '',
              keyResources: canvasData.keyResources || '',
              valuePropositions: canvasData.valuePropositions || '',
              customerRelationships: canvasData.customerRelationships || '',
              channels: canvasData.channels || '',
              customerSegments: canvasData.customerSegments || '',
              costStructure: canvasData.costStructure || '',
              revenueStreams: canvasData.revenueStreams || ''
            }}
          />
        </Suspense>
      </main>
    </div>
  );
}
