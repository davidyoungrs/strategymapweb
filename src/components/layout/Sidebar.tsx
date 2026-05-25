import React, { useState } from 'react';
import { 
  Building2, 
  Network, 
  Box, 
  HelpCircle, 
  LogOut, 
  Star, 
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Trash2,
  Sparkles,
  Globe,
  Shield,
  LayoutGrid,
  Lock,
  Grid3X3,
  PieChart,
  Link,
  Route,
  FileText,
  Target,
  AlertTriangle,
  Calculator
} from 'lucide-react';
import { Kettle } from '../icons/Kettle';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, CanvasData } from '../../types';
import { TEMPLATES } from '../../data/templates';

interface SidebarProps {
  userProfile: UserProfile | null;
  userCanvases: CanvasData[];
  canvasData: CanvasData;
  onSelectCanvas: (canvas: CanvasData) => void;
  setIsDeleteModalOpen: (val: boolean) => void;
  setCanvasToDelete: (id: string | null) => void;
  handleUpgrade: () => void;
  onLogout: () => void;
  handleLoadTemplate: (templateId: string) => void;
  onShowTour: () => void;
  isPremium: boolean;
  onAuthRequired: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userProfile,
  userCanvases,
  canvasData,
  onSelectCanvas,
  setIsDeleteModalOpen,
  setCanvasToDelete,
  handleUpgrade,
  onLogout,
  handleLoadTemplate,
  onShowTour,
  isPremium,
  onAuthRequired
}) => {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'canvas';

  const isAdmin = userProfile?.email === 'david.young@reallysimpleapps.com' || userProfile?.email === 'david.young@celerosft.com';

  const [isMoreModelsOpen, setIsMoreModelsOpen] = useState(
    ['porter', 'lean-canvas', 'ansoff', 'bcg', 'value-chain', 'customer-journey', 'market-sizing', 'risk-register'].includes(currentView)
  );
  const [isBusinessPlanOpen, setIsBusinessPlanOpen] = useState(
    ['executive-summary', 'mission-vision', 'financials'].includes(currentView)
  );
  return (
    <aside className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Kettle className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">KETTLE</h1>
              <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-50 tracking-[0.3em] mt-1">STRAT</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
        <div className="p-8 pb-4">
          <nav className="space-y-1">
            <motion.button 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                currentView === 'canvas' || currentView === ''
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Box className="w-5 h-5" />
              Business Model
            </motion.button>
            <motion.button 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/strategy-map')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                currentView === 'strategy-map' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Network className="w-5 h-5" />
              Strategy Map
            </motion.button>
            <motion.button 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/swot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                currentView === 'swot' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Star className="w-5 h-5" />
              SWOT Analysis
            </motion.button>

            <motion.button 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/pestel')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                currentView === 'pestel' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Globe className="w-5 h-5" />
              PESTEL Analysis
            </motion.button>

            {/* More Models Dropdown */}
            {(() => {
              const moreModelViews = ['porter', 'lean-canvas', 'ansoff', 'bcg', 'value-chain', 'customer-journey', 'market-sizing', 'risk-register'];
              const isMoreModelActive = moreModelViews.includes(currentView);
              return (
                <div className="mt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isPremium) {
                        setIsMoreModelsOpen(!isMoreModelsOpen);
                      } else if (!userProfile) {
                        onAuthRequired();
                      } else {
                        alert("More Models is a Pro feature. Please upgrade to access these strategic frameworks.");
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                      isMoreModelActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                    } ${!isPremium ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutGrid className="w-5 h-5" />
                      <span className="flex items-center gap-2">
                        More Models
                        {!isPremium && <Lock className="w-3 h-3 text-zinc-400" />}
                      </span>
                    </span>
                    {isPremium ? (
                      isMoreModelsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md">Pro</span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isMoreModelsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/porter')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'porter' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          Porter's Five Forces
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/lean-canvas')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'lean-canvas' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          Lean Canvas
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/ansoff')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'ansoff' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                          Ansoff Matrix
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/bcg')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'bcg' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <PieChart className="w-4 h-4" />
                          BCG Matrix
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/value-chain')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'value-chain' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Link className="w-4 h-4" />
                          Value Chain
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/customer-journey')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'customer-journey' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Route className="w-4 h-4" />
                          Customer Journey
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/market-sizing')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'market-sizing' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <PieChart className="w-4 h-4" />
                          Market Sizing
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/risk-register')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'risk-register' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Risk & Opportunity
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {/* Business Plan Dropdown */}
            {(() => {
              const planViews = ['executive-summary', 'mission-vision', 'financials'];
              const isPlanActive = planViews.includes(currentView);
              return (
                <div className="mt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isPremium) {
                        setIsBusinessPlanOpen(!isBusinessPlanOpen);
                      } else if (!userProfile) {
                        onAuthRequired();
                      } else {
                        alert("The Business Planning Suite is a Pro feature. Please upgrade to access financials and executive summaries.");
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm ${
                      isPlanActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                    } ${!isPremium ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <span className="flex items-center gap-2">
                        Your Business Plan
                        {!isPremium && <Lock className="w-3 h-3 text-zinc-400" />}
                      </span>
                    </span>
                    {isPremium ? (
                      isBusinessPlanOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md">Pro</span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isBusinessPlanOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/executive-summary')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'executive-summary' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          Executive Summary
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/mission-vision')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'mission-vision' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Target className="w-4 h-4" />
                          Mission & Values
                        </motion.button>

                        <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/financials')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold tracking-tight text-sm ${
                            currentView === 'financials' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                          }`}
                        >
                          <Calculator className="w-4 h-4" />
                          Financial Projections
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}

            {(userProfile?.isPaidTier || userProfile?.email === 'david.young@reallysimpleapps.com') && (
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <motion.button 
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window as any).toggleAIConsultant?.()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                >
                  <Sparkles className="w-5 h-5" />
                  AI Strategist
                </motion.button>
              </div>
            )}

            <div className="pt-2">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => setTemplatesOpen(!templatesOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-tight text-sm text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <LayoutTemplate className="w-5 h-5" />
                <span className="flex-1">Examples</span>
                <motion.div
                  animate={{ rotate: templatesOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {templatesOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 ml-4 space-y-1 overflow-hidden"
                  >
                    {TEMPLATES.map(t => (
                      <motion.button 
                        key={t.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleLoadTemplate(t.id)}
                        className="w-full text-left px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all uppercase tracking-tighter"
                      >
                        {t.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="px-4 py-2">
          <div className="mb-4 px-4">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">My Projects</p>
          </div>
          <div className="space-y-1">
            {userCanvases.map((canvas) => (
              <div key={canvas.id} className="group relative">
                <button
                  onClick={() => {
                    onSelectCanvas(canvas);
                    navigate('/');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    canvasData.id === canvas.id
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                      : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <FolderOpen className={`w-4 h-4 ${canvasData.id === canvas.id ? 'text-blue-400 dark:text-blue-600' : 'text-zinc-400 group-hover:text-blue-500'}`} />
                  <span className="text-xs font-bold truncate pr-6 tracking-tight uppercase">
                    {canvas.title || 'Untitled Plan'}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCanvasToDelete(canvas.id!);
                    setIsDeleteModalOpen(true);
                  }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                    canvasData.id === canvas.id
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {userCanvases.length === 0 && (
              <div className="px-4 py-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">No saved plans yet</p>
              </div>
            )}
        </div>
      </div>
    </div>

    <div className="p-6 mt-auto space-y-4">
        {(!userProfile || !userProfile.isPaidTier) && (
          <motion.button 
            whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!userProfile) {
                onAuthRequired();
              } else {
                handleUpgrade();
              }
            }}
            className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-blue-500 transition-all text-left cursor-pointer"
          >
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Upgrade</p>
            <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight uppercase">Get Pro Access</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 leading-tight">
              AI Strategist • Cloud Save • Export PDFs
            </p>
          </motion.button>
        )}

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-zinc-400 uppercase">
                  {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div className="hidden xl:block">
              <p className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 truncate w-24 uppercase tracking-tighter">
                {userProfile ? (userProfile.displayName || 'User') : 'Guest User'}
              </p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1">
                {userProfile ? (
                  userProfile.isPaidTier ? (
                    <>
                      <span className="text-emerald-500">Premium</span>
                      <span className="text-zinc-300">•</span>
                      <a 
                        href={userProfile.customerPortalUrl || "https://app.lemonsqueezy.com/my-orders"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 dark:text-blue-400 hover:underline transition-all"
                      >
                        Manage
                      </a>
                    </>
                  ) : 'Free Tier'
                ) : (
                  <button 
                    onClick={onAuthRequired} 
                    className="text-blue-600 dark:text-blue-400 hover:underline transition-all text-[9px] font-black uppercase tracking-tight cursor-pointer"
                  >
                    Log In / Sign Up
                  </button>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onShowTour}
              className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" 
              title="Quick Start Tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
