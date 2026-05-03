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
  AlertCircle
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
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  setIsLogoModalOpen,
  handleSaveCanvas,
  handleNewCanvas,
  saveStatus
}) => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'canvas';
  
  const getTitle = () => {
    switch (currentPath) {
      case 'strategy-map': return 'Strategy Map';
      case 'swot': return 'SWOT Analysis';
      case 'admin': return 'Admin Dashboard';
      default: return 'Business Model';
    }
  };
  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
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
      <div className="flex items-center gap-2">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewCanvas}
          className="px-4 py-2 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New
        </motion.button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mr-2 transition-all">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Saved</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <Cloud className="w-3 h-3 text-zinc-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Unsaved</span>
            </>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSaveCanvas()}
          disabled={saveStatus === 'saving'}
          className="px-4 py-2 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
        >
          {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsLogoModalOpen(true)}
          className="px-4 py-2 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
          title="Tools"
        >
          <Wrench className="w-4 h-4" />
          <span className="hidden lg:block">Tools</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)} 
          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all ml-2"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
};
