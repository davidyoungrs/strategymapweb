import React from 'react';
import { 
  FileText, 
  Target, 
  Eye, 
  Heart,
  ArrowLeft
} from 'lucide-react';
import { CanvasData } from '../types';
import { motion } from 'framer-motion';

interface BusinessPlanViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
  type: 'summary' | 'identity';
}

interface EditorSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  minHeight?: string;
}

const EditorSection: React.FC<EditorSectionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  placeholder,
  minHeight = "400px"
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 rounded-3xl ${
      isFocused 
        ? 'bg-blue-50/30 dark:bg-blue-900/5 border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-100/50 dark:ring-blue-900/20' 
        : 'bg-white dark:bg-zinc-950 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30'
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isFocused 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
            isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
          }`}>{title}</h3>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent resize-none outline-none text-base leading-relaxed text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 font-medium transition-colors`}
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
};

export const BusinessPlanView: React.FC<BusinessPlanViewProps> = ({
  canvasData,
  setCanvasData,
  onBack,
  type
}) => {
  const updatePlan = (field: keyof NonNullable<CanvasData['businessPlan']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      businessPlan: {
        ...(prev.businessPlan || { executiveSummary: '', mission: '', vision: '', values: '' }),
        [field]: value
      }
    }));
  };

  const plan = canvasData.businessPlan || { 
    executiveSummary: '', 
    mission: '', 
    vision: '', 
    values: '' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">
            {type === 'summary' ? 'Executive Summary' : 'Mission, Vision & Values'}
          </h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Your Business Foundation</p>
        </div>
      </div>

      <div className="space-y-6">
        {type === 'summary' ? (
          <EditorSection
            icon={<FileText className="w-6 h-6" />}
            title="Executive Summary"
            subtitle="The high-level pitch of your business"
            value={plan.executiveSummary}
            onChange={(val) => updatePlan('executiveSummary', val)}
            placeholder="Write a compelling overview of your business strategy, goals, and market opportunity..."
            minHeight="600px"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <EditorSection
              icon={<Target className="w-6 h-6" />}
              title="Mission Statement"
              subtitle="What do we do today?"
              value={plan.mission}
              onChange={(val) => updatePlan('mission', val)}
              placeholder="Our mission is to..."
              minHeight="150px"
            />
            <EditorSection
              icon={<Eye className="w-6 h-6" />}
              title="Vision Statement"
              subtitle="Where are we going?"
              value={plan.vision}
              onChange={(val) => updatePlan('vision', val)}
              placeholder="Our vision is to become..."
              minHeight="150px"
            />
            <EditorSection
              icon={<Heart className="w-6 h-6" />}
              title="Core Values"
              subtitle="What do we stand for?"
              value={plan.values}
              onChange={(val) => updatePlan('values', val)}
              placeholder="List the guiding principles that define your culture and decision-making..."
              minHeight="200px"
            />
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 uppercase tracking-tight">AI Strategist Ready</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
              Open the AI Strategist in the sidebar to have Gemma review your {type === 'summary' ? 'summary' : 'mission and values'}. It will provide feedback on clarity, alignment, and strategic impact.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
