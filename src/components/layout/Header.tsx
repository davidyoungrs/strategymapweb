import React from 'react';
import { 
  Sun, 
  Moon, 
  Wrench, 
  Save, 
  Plus, 
  Loader2,
  Cloud,
  Check,
  Lock,
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  setIsLogoModalOpen: (val: boolean) => void;
  handleSaveCanvas: () => void;
  handleNewCanvas: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isPremium: boolean;
  isGuest: boolean;
  onAuthRequired: () => void;
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  setIsLogoModalOpen,
  handleSaveCanvas,
  handleNewCanvas,
  saveStatus,
  isPremium,
  isGuest,
  onAuthRequired,
  onMenuToggle
}) => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'canvas';
  
  const getTitle = () => {
    switch (currentPath) {
      case 'strategy-map': return 'Strategy Map';
      case 'swot': return 'SWOT Analysis';
      case 'admin': return 'Admin Dashboard';
      case 'pestel': return 'PESTEL Analysis';
      case 'porter': return 'Porter\'s Five Forces';
      case 'lean-canvas': return 'Lean Canvas';
      case 'ansoff': return 'Ansoff Matrix';
      case 'bcg': return 'BCG Matrix';
      case 'value-chain': return 'Value Chain';
      case 'customer-journey': return 'Customer Journey';
      case 'market-sizing': return 'Market Sizing';
      case 'risk-register': return 'Risk & Opportunity';
      case 'financials': return 'Financial Projections';
      case 'executive-summary': return 'Executive Summary';
      case 'mission-vision': return 'Mission & Vision';
      default: return 'Business Model';
    }
  };
  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 md:gap-8">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 md:hidden rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg md:text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase truncate max-w-[140px] sm:max-w-none">
          {getTitle()}
        </h2>
        <nav className="hidden md:flex gap-6 font-sans antialiased text-zinc-900 dark:text-zinc-100 tracking-tight font-medium">
          <a className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-blue-700 dark:border-blue-400 pb-1" href="/">Models</a>
          <button 
            onClick={() => alert('Team collaboration coming soon!')}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
          >
            Team
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewCanvas}
          className="px-2.5 sm:px-4 py-2 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </motion.button>
        
        {isPremium && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mr-1 sm:mr-2 transition-all">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 hidden sm:inline">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hidden sm:inline">Saved</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <Cloud className="w-3 h-3 text-zinc-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hidden sm:inline">Unsaved</span>
              </>
            )}
          </div>
        )}

        <motion.button 
          whileHover={isPremium ? { scale: 1.02 } : {}}
          whileTap={isPremium ? { scale: 0.98 } : {}}
          onClick={() => {
            if (isPremium) {
              handleSaveCanvas();
            } else if (isGuest) {
              onAuthRequired();
            } else {
              alert("Cloud saving is a Pro feature. Please upgrade to sync your data.");
            }
          }}
          disabled={saveStatus === 'saving'}
          className={`px-2.5 sm:px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 ${
            !isPremium 
              ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50' 
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          {!isPremium ? <Lock className="w-4 h-4" /> : (saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />)}
          <span className="hidden sm:inline">Save</span>
        </motion.button>
        <motion.button 
          whileHover={isPremium ? { scale: 1.02 } : {}}
          whileTap={isPremium ? { scale: 0.98 } : {}}
          onClick={() => {
            if (isPremium) {
              setIsLogoModalOpen(true);
            } else if (isGuest) {
              onAuthRequired();
            } else {
              alert("Strategic Tools and Reports are Pro features. Please upgrade to access export options.");
            }
          }}
          className={`px-2.5 sm:px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 ${
            !isPremium 
              ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50' 
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          title="Tools"
        >
          {!isPremium ? <Lock className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
          <span className="hidden sm:inline">Tools</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)} 
          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all ml-1 sm:ml-2"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
};
