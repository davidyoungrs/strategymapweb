import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Target, 
  Eye, 
  Heart,
  ArrowLeft,
  Mic,
  MicOff,
  Plus,
  Trash2,
  Users,
  Building2,
  Shield,
  Sparkles,
  Globe,
  Network,
  Globe2,
  Flag,
  DollarSign
} from 'lucide-react';
import { CanvasData, KeyPerson, BusinessPlanData, FeatureBenefit, CompetitorItem, CompetitorPrice, StaffMember, SupplierItem, EquipmentItem } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { BUSINESS_PLAN_GUIDANCE, MARKET_SIZING_GUIDANCE, TooltipContent } from '../utils/guidance';

interface BusinessPlanViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
  type: 'summary' | 'identity' | 'details' | 'policy' | 'products' | 'market' | 'competitors';
}

interface EditorSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  minHeight?: string;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const EditorSection: React.FC<EditorSectionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  onChange, 
  placeholder,
  minHeight = "400px",
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className={`relative p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col group transition-all duration-300 rounded-3xl bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl ${
      isFocused 
        ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5' 
        : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-400/5 hover:border-blue-500/30 dark:hover:border-blue-400/30'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-110' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}>{title}</h3>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>

        {isSupported && (
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
              isListening
                ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title={isListening ? `Stop recording ${title.toLowerCase()}` : `Start voice-to-text for ${title.toLowerCase()}`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent resize-none outline-none text-base leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent transition-colors"
        style={{ minHeight }}
        placeholder={placeholder}
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

interface SizingCellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  description: string;
  onValueChange: (val: string) => void;
  onDescChange: (val: string) => void;
  color: string;
  isSupported: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  tooltipContent?: TooltipContent;
}

const SizingCell: React.FC<SizingCellProps> = ({ 
  icon, 
  title, 
  subtitle, 
  value, 
  description, 
  onValueChange, 
  onDescChange,
  color,
  isSupported,
  isListening,
  onToggleListening,
  tooltipContent
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const colorVariants: Record<string, any> = {
    blue: { bg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/50 dark:border-blue-400/40 ring-2 ring-blue-500/20 dark:ring-blue-400/10 shadow-lg shadow-blue-500/5', hoverShadow: 'hover:shadow-blue-500/5', hoverRing: 'hover:border-blue-500/30 dark:hover:border-blue-400/30', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-600' },
    indigo: { bg: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 dark:border-indigo-400/40 ring-2 ring-indigo-500/20 dark:ring-indigo-400/10 shadow-lg shadow-indigo-500/5', hoverShadow: 'hover:shadow-indigo-500/5', hoverRing: 'hover:border-indigo-500/30 dark:hover:border-indigo-400/30', text: 'text-indigo-600 dark:text-indigo-400', icon: 'bg-indigo-600' },
    violet: { bg: 'bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/50 dark:border-violet-400/40 ring-2 ring-violet-500/20 dark:ring-violet-400/10 shadow-lg shadow-violet-500/5', hoverShadow: 'hover:shadow-violet-500/5', hoverRing: 'hover:border-violet-500/30 dark:hover:border-violet-400/30', text: 'text-violet-600 dark:text-violet-400', icon: 'bg-violet-600' },
  };

  const cv = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`relative p-6 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl transition-all duration-300 ${
      isFocused 
        ? `${cv.bg}` 
        : `hover:-translate-y-1.5 hover:shadow-2xl ${cv.hoverShadow} ${cv.hoverRing}`
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isFocused ? `${cv.icon} text-white shadow-lg scale-110` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] leading-none transition-colors ${isFocused ? cv.text : 'text-zinc-900 dark:text-zinc-100'}`}>{title}</h3>
            </div>
            <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mt-1.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={onToggleListening}
              className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isListening
                  ? 'bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse ring-2 ring-red-500/40'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
              }`}
              title={isListening ? `Stop recording ${title.toLowerCase()}` : `Start voice-to-text for ${title.toLowerCase()}`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500 dark:text-red-400" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}

          <div className={`flex items-center gap-1 px-4 py-2 rounded-xl border ${isFocused ? 'border-zinc-300 dark:border-zinc-700' : 'border-zinc-100 dark:border-zinc-800'} bg-white dark:bg-zinc-900 transition-colors`}>
            <DollarSign className="w-3 h-3 text-zinc-400 dark:text-zinc-600 font-bold" />
            <input
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="0.00"
              className="w-24 bg-transparent outline-none text-sm font-black text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Describe your ${title.toLowerCase()}...`}
        className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-semibold h-24 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent transition-colors"
      />
      {tooltipContent && <Tooltip content={tooltipContent} />}
    </div>
  );
};

export const BusinessPlanView: React.FC<BusinessPlanViewProps> = ({
  canvasData,
  setCanvasData,
  onBack,
  type
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  interface ListeningTarget {
    type: 'plan' | 'person' | 'feature_benefit' | 'competitor_item' | 'competitor_price' | 'market_sizing' | 'staff_member' | 'supplier_item' | 'equipment_item';
    field: string;
    personId?: string;
    rowId?: string;
  }
  
  const activeTargetRef = useRef<ListeningTarget | null>(null);
  const pendingTargetRef = useRef<ListeningTarget | null>(null);
  const initialTextRef = useRef('');
  const canvasDataRef = useRef(canvasData);
  const setCanvasDataRef = useRef(setCanvasData);

  useEffect(() => {
    canvasDataRef.current = canvasData;
    setCanvasDataRef.current = setCanvasData;
  }, [canvasData, setCanvasData]);

  const startSpeech = (field: string, targetType: 'plan' | 'person' | 'feature_benefit' | 'competitor_item' | 'competitor_price' | 'market_sizing' | 'staff_member' | 'supplier_item' | 'equipment_item', personId?: string, rowId?: string) => {
    if (!recognitionRef.current) return;

    const identifier = targetType === 'plan' 
      ? field 
      : targetType === 'person' 
      ? `${personId}_${field}` 
      : targetType === 'market_sizing'
      ? `marketSizing_${field}`
      : `${rowId}_${field}`;

    const currentPlan = canvasDataRef.current.businessPlan || { 
      executiveSummary: '', 
      mission: '', 
      vision: '', 
      values: '',
      fairWorkPractices: '',
      sustainabilityPolicy: ''
    };
    
    let baseVal = '';
    if (targetType === 'plan') {
      const val = currentPlan[field as keyof BusinessPlanData];
      baseVal = typeof val === 'string' ? val : '';
    } else if (targetType === 'person' && personId) {
      const person = (currentPlan.keyPersonnel || []).find(p => p.id === personId);
      if (person) {
        baseVal = person[field as keyof KeyPerson] || '';
      }
    } else if (targetType === 'feature_benefit' && rowId) {
      const row = (currentPlan.featuresBenefits || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof FeatureBenefit] || '';
      }
    } else if (targetType === 'competitor_item' && rowId) {
      const row = (currentPlan.competitors || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof CompetitorItem] || '';
      }
    } else if (targetType === 'competitor_price' && rowId) {
      const row = (currentPlan.competitorPricing || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof CompetitorPrice] || '';
      }
    } else if (targetType === 'staff_member' && rowId) {
      const row = (currentPlan.staffMembers || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof StaffMember] || '';
      }
    } else if (targetType === 'supplier_item' && rowId) {
      const row = (currentPlan.suppliers || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof SupplierItem] || '';
      }
    } else if (targetType === 'equipment_item' && rowId) {
      const row = (currentPlan.equipment || []).find(r => r.id === rowId);
      if (row) {
        baseVal = row[field as keyof EquipmentItem] || '';
      }
    } else if (targetType === 'market_sizing') {
      const currentSizing = canvasDataRef.current.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' };
      baseVal = currentSizing[field as keyof NonNullable<CanvasData['marketSizing']>] || '';
    }

    initialTextRef.current = baseVal;
    activeTargetRef.current = { type: targetType, field, personId, rowId };
    setActiveField(identifier);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Business Plan:', error);
      setActiveField(null);
      activeTargetRef.current = null;
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let sessionFinal = '';
        let sessionInterim = '';
        for (let i = 0; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            sessionFinal += transcript + ' ';
          } else {
            sessionInterim += transcript;
          }
        }
        
        const cleanSessionTranscript = (sessionFinal + sessionInterim).trim();
        const target = activeTargetRef.current;
        if (cleanSessionTranscript && target) {
          const defaultPlan: BusinessPlanData = { executiveSummary: '', mission: '', vision: '', values: '', fairWorkPractices: '', sustainabilityPolicy: '' };
          if (target.type === 'plan') {
            const baseText = initialTextRef.current.trim();
            const isLongForm = [
              'executiveSummary', 'mission', 'vision', 'values', 'fairWorkPractices', 'sustainabilityPolicy',
              'marketTrends', 'marketTrendsResearch', 'customerGroups', 'customerDemands', 'customerResearch',
              'gatheredCompetitorInfo', 'competitorImprovement', 'competitiveAdvantage',
              'premisesStartupCosts', 'premisesFutureRequirements', 'businessGoals'
            ].includes(target.field);
            const updatedValue = isLongForm
              ? (baseText ? `${baseText}\n- ${cleanSessionTranscript}` : `- ${cleanSessionTranscript}`)
              : (initialTextRef.current ? `${initialTextRef.current} ${cleanSessionTranscript}` : cleanSessionTranscript);

            setCanvasDataRef.current(prev => ({
              ...prev,
              businessPlan: {
                ...(prev.businessPlan || defaultPlan),
                [target.field]: updatedValue
              }
            }));
          } else if (target.type === 'person' && target.personId) {
            setCanvasDataRef.current(prev => {
              const currentPersonnel = prev.businessPlan?.keyPersonnel || [];
              const updated = currentPersonnel.map(p => {
                if (p.id === target.personId) {
                  const baseVal = p[target.field as keyof KeyPerson] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...p, [target.field]: updatedValue };
                }
                return p;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  keyPersonnel: updated
                }
              };
            });
          } else if (target.type === 'staff_member' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.staffMembers || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof StaffMember] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  staffMembers: updated
                }
              };
            });
          } else if (target.type === 'supplier_item' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.suppliers || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof SupplierItem] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  suppliers: updated
                }
              };
            });
          } else if (target.type === 'equipment_item' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.equipment || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof EquipmentItem] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  equipment: updated
                }
              };
            });
          } else if (target.type === 'feature_benefit' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.featuresBenefits || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof FeatureBenefit] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  featuresBenefits: updated
                }
              };
            });
          } else if (target.type === 'competitor_item' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.competitors || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof CompetitorItem] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  competitors: updated
                }
              };
            });
          } else if (target.type === 'competitor_price' && target.rowId) {
            setCanvasDataRef.current(prev => {
              const rows = prev.businessPlan?.competitorPricing || [];
              const updated = rows.map(r => {
                if (r.id === target.rowId) {
                  const baseVal = r[target.field as keyof CompetitorPrice] || '';
                  const updatedValue = baseVal.trim() ? `${baseVal} ${cleanSessionTranscript}` : cleanSessionTranscript;
                  return { ...r, [target.field]: updatedValue };
                }
                return r;
              });
              return {
                ...prev,
                businessPlan: {
                  ...(prev.businessPlan || defaultPlan),
                  competitorPricing: updated
                }
              };
            });
          } else if (target.type === 'market_sizing') {
            const baseText = initialTextRef.current.trim();
            const isLongForm = ['tamDescription', 'samDescription', 'somDescription'].includes(target.field);
            const updatedValue = isLongForm
              ? (baseText ? `${baseText}\n- ${cleanSessionTranscript}` : `- ${cleanSessionTranscript}`)
              : (initialTextRef.current ? `${initialTextRef.current} ${cleanSessionTranscript}` : cleanSessionTranscript);

            setCanvasDataRef.current(prev => ({
              ...prev,
              marketSizing: {
                ...(prev.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' }),
                [target.field]: updatedValue
              }
            }));
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Business Plan:', event.error);
        }
        setActiveField(null);
        activeTargetRef.current = null;
        pendingTargetRef.current = null;
      };

      recognition.onend = () => {
        setActiveField(null);
        activeTargetRef.current = null;
        
        if (pendingTargetRef.current) {
          const next = pendingTargetRef.current;
          pendingTargetRef.current = null;
          startSpeech(next.field, next.type, next.personId, next.rowId);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = (field: string, targetType: 'plan' | 'person' | 'feature_benefit' | 'competitor_item' | 'competitor_price' | 'market_sizing' | 'staff_member' | 'supplier_item' | 'equipment_item' = 'plan', personId?: string, rowId?: string) => {
    if (!recognitionRef.current) return;

    const identifier = targetType === 'plan' 
      ? field 
      : targetType === 'person' 
      ? `${personId}_${field}` 
      : targetType === 'market_sizing'
      ? `marketSizing_${field}`
      : `${rowId}_${field}`;

    if (activeField) {
      if (activeField === identifier) {
        recognitionRef.current.stop();
        return;
      }
      
      pendingTargetRef.current = { type: targetType, field, personId, rowId };
      recognitionRef.current.stop();
      return;
    }

    startSpeech(field, targetType, personId, rowId);
  };

  const updatePlan = (field: keyof NonNullable<CanvasData['businessPlan']>, value: any) => {
    setCanvasData(prev => {
      const defaultPlan: BusinessPlanData = { 
        executiveSummary: '', 
        mission: '', 
        vision: '', 
        values: '',
        fairWorkPractices: 'We are committed to fostering a fair, flexible, and inclusive workplace. This includes supporting modern hybrid working arrangements, maintaining clear diversity and equal opportunity policies, ensuring transparent career progression, and offering competitive, fair remuneration. We regularly review employee satisfaction and wellness initiatives to support work-life balance.',
        sustainabilityPolicy: 'Our sustainability strategy is focused on reducing our carbon footprint and encouraging circular economy practices. We prioritize local sourcing, utilize energy-efficient technologies across our operations, actively minimize single-use waste, and partner with suppliers who align with our environmental and ethical standards.'
      };
      return {
        ...prev,
        businessPlan: {
          ...(prev.businessPlan || defaultPlan),
          [field]: value
        }
      };
    });
  };

  const updateMarket = (field: keyof NonNullable<CanvasData['marketSizing']>, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      marketSizing: {
        ...(prev.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' }),
        [field]: value
      }
    }));
  };

  const plan = {
    executiveSummary: canvasData.businessPlan?.executiveSummary || '',
    mission: canvasData.businessPlan?.mission || '',
    vision: canvasData.businessPlan?.vision || '',
    values: canvasData.businessPlan?.values || '',
    businessName: canvasData.businessPlan?.businessName || '',
    address: canvasData.businessPlan?.address || '',
    telephone: canvasData.businessPlan?.telephone || '',
    legalStatus: canvasData.businessPlan?.legalStatus || '',
    dateEstablished: canvasData.businessPlan?.dateEstablished || '',
    registrationNumber: canvasData.businessPlan?.registrationNumber || '',
    onlinePresence: canvasData.businessPlan?.onlinePresence || '',
    advisers: canvasData.businessPlan?.advisers || '',
    isVatRegistered: canvasData.businessPlan?.isVatRegistered || false,
    keyPersonnel: canvasData.businessPlan?.keyPersonnel || [],
    fairWorkPractices: canvasData.businessPlan?.fairWorkPractices ?? 'We are committed to fostering a fair, flexible, and inclusive workplace. This includes supporting modern hybrid working arrangements, maintaining clear diversity and equal opportunity policies, ensuring transparent career progression, and offering competitive, fair remuneration. We regularly review employee satisfaction and wellness initiatives to support work-life balance.',
    sustainabilityPolicy: canvasData.businessPlan?.sustainabilityPolicy ?? 'Our sustainability strategy is focused on reducing our carbon footprint and encouraging circular economy practices. We prioritize local sourcing, utilize energy-efficient technologies across our operations, actively minimize single-use waste, and partner with suppliers who align with our environmental and ethical standards.',
    featuresBenefits: canvasData.businessPlan?.featuresBenefits || [],
    marketTrends: canvasData.businessPlan?.marketTrends || '',
    marketTrendsResearch: canvasData.businessPlan?.marketTrendsResearch || '',
    customerGroups: canvasData.businessPlan?.customerGroups || '',
    customerDemands: canvasData.businessPlan?.customerDemands || '',
    customerResearch: canvasData.businessPlan?.customerResearch || '',
    competitors: canvasData.businessPlan?.competitors || [],
    competitorPricing: canvasData.businessPlan?.competitorPricing || [],
    gatheredCompetitorInfo: canvasData.businessPlan?.gatheredCompetitorInfo || '',
    competitorImprovement: canvasData.businessPlan?.competitorImprovement || '',
    competitiveAdvantage: canvasData.businessPlan?.competitiveAdvantage || '',
    staffMembers: canvasData.businessPlan?.staffMembers || [],
    premisesStartupCosts: canvasData.businessPlan?.premisesStartupCosts || '',
    premisesFutureRequirements: canvasData.businessPlan?.premisesFutureRequirements || '',
    suppliers: canvasData.businessPlan?.suppliers || [],
    equipment: canvasData.businessPlan?.equipment || [],
    businessGoals: canvasData.businessPlan?.businessGoals || ''
  };

  const addPerson = () => {
    const newPerson: KeyPerson = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      position: '',
      experience: '',
      previousEmployment: '',
      keySkills: '',
      qualifications: '',
      recentSalary: ''
    };
    const currentPersonnel = plan.keyPersonnel || [];
    updatePlan('keyPersonnel', [...currentPersonnel, newPerson]);
  };

  const updatePerson = (id: string, field: keyof KeyPerson, value: string) => {
    const currentPersonnel = plan.keyPersonnel || [];
    const updated = currentPersonnel.map(p => p.id === id ? { ...p, [field]: value } : p);
    updatePlan('keyPersonnel', updated);
  };

  const removePerson = (id: string) => {
    const currentPersonnel = plan.keyPersonnel || [];
    const filtered = currentPersonnel.filter(p => p.id !== id);
    updatePlan('keyPersonnel', filtered);
  };

  const addStaffMember = () => {
    const newItem: StaffMember = {
      id: Math.random().toString(36).substring(2, 9),
      role: '',
      totalCost: '',
      experience: '',
      skillsQualifications: ''
    };
    updatePlan('staffMembers', [...plan.staffMembers, newItem]);
  };

  const updateStaffMember = (id: string, field: keyof StaffMember, value: string) => {
    const updated = plan.staffMembers.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('staffMembers', updated);
  };

  const removeStaffMember = (id: string) => {
    const filtered = plan.staffMembers.filter(item => item.id !== id);
    updatePlan('staffMembers', filtered);
  };

  const addSupplier = () => {
    const newItem: SupplierItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      productServiceProvided: '',
      creditTermsDays: ''
    };
    updatePlan('suppliers', [...plan.suppliers, newItem]);
  };

  const updateSupplier = (id: string, field: keyof SupplierItem, value: string) => {
    const updated = plan.suppliers.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('suppliers', updated);
  };

  const removeSupplier = (id: string) => {
    const filtered = plan.suppliers.filter(item => item.id !== id);
    updatePlan('suppliers', filtered);
  };

  const addEquipmentItem = () => {
    const newItem: EquipmentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      cost: '',
      timing: '',
      fundingSource: ''
    };
    updatePlan('equipment', [...plan.equipment, newItem]);
  };

  const updateEquipmentItem = (id: string, field: keyof EquipmentItem, value: string) => {
    const updated = plan.equipment.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('equipment', updated);
  };

  const removeEquipmentItem = (id: string) => {
    const filtered = plan.equipment.filter(item => item.id !== id);
    updatePlan('equipment', filtered);
  };

  const addFeatureBenefit = () => {
    const newItem: FeatureBenefit = {
      id: Math.random().toString(36).substring(2, 9),
      feature: '',
      benefit: ''
    };
    updatePlan('featuresBenefits', [...plan.featuresBenefits, newItem]);
  };

  const updateFeatureBenefit = (id: string, field: keyof FeatureBenefit, value: string) => {
    const updated = plan.featuresBenefits.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('featuresBenefits', updated);
  };

  const removeFeatureBenefit = (id: string) => {
    const filtered = plan.featuresBenefits.filter(item => item.id !== id);
    updatePlan('featuresBenefits', filtered);
  };

  const addCompetitor = () => {
    const newItem: CompetitorItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      strengths: '',
      weaknesses: ''
    };
    updatePlan('competitors', [...plan.competitors, newItem]);
  };

  const updateCompetitor = (id: string, field: keyof CompetitorItem, value: string) => {
    const updated = plan.competitors.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('competitors', updated);
  };

  const removeCompetitor = (id: string) => {
    const filtered = plan.competitors.filter(item => item.id !== id);
    updatePlan('competitors', filtered);
  };

  const addCompetitorPrice = () => {
    const newItem: CompetitorPrice = {
      id: Math.random().toString(36).substring(2, 9),
      productService: '',
      yourPrice: '',
      competitorPriceRange: '',
      differenceReason: ''
    };
    updatePlan('competitorPricing', [...plan.competitorPricing, newItem]);
  };

  const updateCompetitorPrice = (id: string, field: keyof CompetitorPrice, value: string) => {
    const updated = plan.competitorPricing.map(item => item.id === id ? { ...item, [field]: value } : item);
    updatePlan('competitorPricing', updated);
  };

  const removeCompetitorPrice = (id: string) => {
    const filtered = plan.competitorPricing.filter(item => item.id !== id);
    updatePlan('competitorPricing', filtered);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300"
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
            {type === 'summary' 
              ? 'Executive Summary' 
              : type === 'identity' 
              ? 'Mission, Vision & Values' 
              : type === 'policy'
              ? 'Strategic Policies'
              : type === 'products'
              ? 'Products & Goals'
              : type === 'market'
              ? 'Market and Customers'
              : type === 'competitors'
              ? 'Competitor Analysis'
              : 'Business Details & Personnel'}
          </h2>
          {type !== 'market' && (
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {type === 'products'
                ? 'Features & Benefits'
                : type === 'competitors'
                ? 'Competitive Landscape'
                : 'Your Business Foundation'}
            </p>
          )}
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
            isSupported={isSupported}
            isListening={activeField === 'executiveSummary'}
            onToggleListening={() => toggleListening('executiveSummary')}
            tooltipContent={BUSINESS_PLAN_GUIDANCE.executiveSummary}
          />
        ) : type === 'identity' ? (
          <div className="grid grid-cols-1 gap-6">
            <EditorSection
              icon={<Target className="w-6 h-6" />}
              title="Mission Statement"
              subtitle="What do we do today?"
              value={plan.mission}
              onChange={(val) => updatePlan('mission', val)}
              placeholder="Our mission is to..."
              minHeight="150px"
              isSupported={isSupported}
              isListening={activeField === 'mission'}
              onToggleListening={() => toggleListening('mission')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.mission}
            />
            <EditorSection
              icon={<Eye className="w-6 h-6" />}
              title="Vision Statement"
              subtitle="Where are we going?"
              value={plan.vision}
              onChange={(val) => updatePlan('vision', val)}
              placeholder="Our vision is to become..."
              minHeight="150px"
              isSupported={isSupported}
              isListening={activeField === 'vision'}
              onToggleListening={() => toggleListening('vision')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.vision}
            />
            <EditorSection
              icon={<Heart className="w-6 h-6" />}
              title="Core Values"
              subtitle="What do we stand for?"
              value={plan.values}
              onChange={(val) => updatePlan('values', val)}
              placeholder="List the guiding principles that define your culture and decision-making..."
              minHeight="200px"
              isSupported={isSupported}
              isListening={activeField === 'values'}
              onToggleListening={() => toggleListening('values')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.values}
            />
          </div>
        ) : type === 'policy' ? (
          <div className="grid grid-cols-1 gap-6">
            <EditorSection
              icon={<Shield className="w-6 h-6" />}
              title="Fair Work Practices"
              subtitle="Flexible, remote, and diverse workforce practices"
              value={plan.fairWorkPractices}
              onChange={(val) => updatePlan('fairWorkPractices', val)}
              placeholder="Detail your fair work, flexible hybrid patterns, equal opportunity, and workforce strategies..."
              minHeight="200px"
              isSupported={isSupported}
              isListening={activeField === 'fairWorkPractices'}
              onToggleListening={() => toggleListening('fairWorkPractices')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.fairWorkPractices}
            />
            <EditorSection
              icon={<Shield className="w-6 h-6" />}
              title="Sustainability Policy"
              subtitle="Carbon reduction, local sourcing, and circular economy"
              value={plan.sustainabilityPolicy}
              onChange={(val) => updatePlan('sustainabilityPolicy', val)}
              placeholder="Detail your sustainability practices, carbon offsetting, and green hosting policies..."
              minHeight="200px"
              isSupported={isSupported}
              isListening={activeField === 'sustainabilityPolicy'}
              onToggleListening={() => toggleListening('sustainabilityPolicy')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.sustainabilityPolicy}
            />
          </div>
        ) : type === 'details' ? (
          <div className="space-y-8">
            {/* Part 1: Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl">
              <div className="md:col-span-2 flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Business Information</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Address, legal status, and registration details</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Business Name</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('businessName')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'businessName'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.businessName || ''}
                  onChange={(e) => updatePlan('businessName', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. Kettle Strat LLC"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Telephone Number</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('telephone')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'telephone'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.telephone || ''}
                  onChange={(e) => updatePlan('telephone', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. +44 20 7946 0192"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Physical Address</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('address')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'address'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <textarea 
                  value={plan.address || ''}
                  onChange={(e) => updatePlan('address', e.target.value)}
                  className="w-full h-24 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none"
                  placeholder="e.g. 100 Innovation Boulevard, London, EC1A 1BB"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Legal Status / Structure</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('legalStatus')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'legalStatus'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.legalStatus || ''}
                  onChange={(e) => updatePlan('legalStatus', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. Private Limited Company"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Date Established</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('dateEstablished')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'dateEstablished'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.dateEstablished || ''}
                  onChange={(e) => updatePlan('dateEstablished', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. May 30, 2026"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Business Registration Number</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('registrationNumber')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'registrationNumber'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.registrationNumber || ''}
                  onChange={(e) => updatePlan('registrationNumber', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. 12345678"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Online Presence (URL)</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('onlinePresence')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'onlinePresence'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.onlinePresence || ''}
                  onChange={(e) => updatePlan('onlinePresence', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. https://kettlestrat.com"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Advisers (Accountant, Legal, etc.)</label>
                  {isSupported && (
                    <button
                      type="button"
                      onClick={() => toggleListening('advisers')}
                      className={`p-1 rounded-lg transition-colors ${
                        activeField === 'advisers'
                          ? 'bg-red-500/20 text-red-500 animate-pulse'
                          : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                      }`}
                      title="Speech to Text"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input 
                  type="text"
                  value={plan.advisers || ''}
                  onChange={(e) => updatePlan('advisers', e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  placeholder="e.g. Legal: Smith & Partners, Finance: Jane Doe CPA"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="isVatRegistered"
                  checked={plan.isVatRegistered || false}
                  onChange={(e) => updatePlan('isVatRegistered', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-zinc-300 dark:border-zinc-700 bg-transparent rounded focus:ring-blue-550 dark:focus:ring-offset-zinc-900 cursor-pointer"
                />
                <label htmlFor="isVatRegistered" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer select-none">VAT Registered</label>
              </div>
            </div>

            {/* Part 2: Key Personnel */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Key Personnel & Owners</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Add details about owners, directors, and critical hires</p>
                  </div>
                </div>
                <button
                  onClick={addPerson}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Person
                </button>
              </div>

              {(!plan.keyPersonnel || plan.keyPersonnel.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Users className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No key personnel added yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plan.keyPersonnel.map((person, idx) => (
                     <div key={person.id} className="p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-4 relative group">
                       <button
                         onClick={() => removePerson(person.id)}
                         className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                         title="Remove Person"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>

                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                           {idx + 1}
                         </div>
                         <h4 className="text-xs font-black uppercase tracking-wider text-zinc-850 dark:text-zinc-200">Personnel Profile</h4>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Name</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('name', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_name`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.name}
                             onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="Full Name"
                           />
                         </div>

                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Position / Responsibilities</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('position', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_position`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.position}
                             onChange={(e) => updatePerson(person.id, 'position', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="e.g. Founder & Chief Operations Officer"
                           />
                         </div>

                         <div className="space-y-1 md:col-span-2">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Industry Experience & Knowledge</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('experience', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_experience`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                           <textarea 
                             value={person.experience}
                             onChange={(e) => updatePerson(person.id, 'experience', e.target.value)}
                             className="w-full h-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                             placeholder="Describe industry expertise or domains they excel in..."
                           />
                         </div>

                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Previous Employment</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('previousEmployment', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_previousEmployment`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.previousEmployment}
                             onChange={(e) => updatePerson(person.id, 'previousEmployment', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="e.g. Senior VP at Google Corp"
                           />
                         </div>

                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Recent Salary (£ / $)</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('recentSalary', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_recentSalary`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3 h-3" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.recentSalary}
                             onChange={(e) => updatePerson(person.id, 'recentSalary', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="e.g. £85,000"
                           />
                         </div>

                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Key Skills Brought to Business</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('keySkills', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_keySkills`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3.5 h-3.5" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.keySkills}
                             onChange={(e) => updatePerson(person.id, 'keySkills', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="e.g. Product design, full-stack scaling, financial planning"
                           />
                         </div>

                         <div className="space-y-1">
                           <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Academic & Professional Qualifications</label>
                             {isSupported && (
                               <button
                                 type="button"
                                 onClick={() => toggleListening('qualifications', 'person', person.id)}
                                 className={`p-1 rounded-lg transition-colors ${
                                   activeField === `${person.id}_qualifications`
                                     ? 'bg-red-500/20 text-red-500 animate-pulse'
                                     : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                                 }`}
                                 title="Speech to Text"
                               >
                                 <Mic className="w-3.5 h-3.5" />
                               </button>
                             )}
                           </div>
                           <input 
                             type="text"
                             value={person.qualifications}
                             onChange={(e) => updatePerson(person.id, 'qualifications', e.target.value)}
                             className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                             placeholder="e.g. MBA from Harvard, BSc Computer Science"
                           />
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>

            {/* Part 3: Workforce & Staffing (Operational Staff) */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Workforce & Staffing</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Add details about your operational staff and their associated costs</p>
                  </div>
                </div>
                <button
                  onClick={addStaffMember}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff Member
                </button>
              </div>

              {(!plan.staffMembers || plan.staffMembers.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Users className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No operational staff members added yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plan.staffMembers.map((item, idx) => (
                    <div key={item.id} className="p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-4 relative group">
                      <button
                        onClick={() => removeStaffMember(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove Staff Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Role / Position</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('role', 'staff_member', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_role` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                }`}
                              >
                                <Mic className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.role}
                            onChange={(e) => updateStaffMember(item.id, 'role', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Lead Developer, Sales Associate"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total Cost (Salary/Cost per Year)</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('totalCost', 'staff_member', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_totalCost` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                }`}
                              >
                                <Mic className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.totalCost}
                            onChange={(e) => updateStaffMember(item.id, 'totalCost', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. £45,000 / year"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Experience Required</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('experience', 'staff_member', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_experience` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                }`}
                              >
                                <Mic className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.experience}
                            onChange={(e) => updateStaffMember(item.id, 'experience', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. 3+ years in retail, senior DevOps background"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Specialist Skills & Qualifications</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('skillsQualifications', 'staff_member', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_skillsQualifications` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                }`}
                              >
                                <Mic className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.skillsQualifications}
                            onChange={(e) => updateStaffMember(item.id, 'skillsQualifications', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. AWS Certification, Certified Accountant"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Part 4: Business Premises & Facilities */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Business Premises & Facilities</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Define your current physical premises needs and future requirements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Startup Premises Costs & Setup</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('premisesStartupCosts')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeField === 'premisesStartupCosts'
                            ? 'bg-red-500/20 text-red-500 animate-pulse'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                        title="Speech to Text"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={plan.premisesStartupCosts}
                    onChange={(e) => updatePlan('premisesStartupCosts', e.target.value)}
                    className="w-full h-32 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none"
                    placeholder="Describe rent deposits, fit-out costs, utility connection charges, and other premises setup expenses..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Future Premises Requirements</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('premisesFutureRequirements')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          activeField === 'premisesFutureRequirements'
                            ? 'bg-red-500/20 text-red-500 animate-pulse'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                        title="Speech to Text"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={plan.premisesFutureRequirements}
                    onChange={(e) => updatePlan('premisesFutureRequirements', e.target.value)}
                    className="w-full h-32 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-none"
                    placeholder="Detail future location strategy, expansion plans, lease renewal options, and space scaling requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Part 5: Key Suppliers & Procurement */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Key Suppliers & Procurement</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Track critical suppliers, products provided, and credit payment terms</p>
                  </div>
                </div>
                <button
                  onClick={addSupplier}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Supplier
                </button>
              </div>

              {(!plan.suppliers || plan.suppliers.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Network className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No suppliers added yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plan.suppliers.map((item, idx) => (
                    <div key={item.id} className="p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-4 relative group">
                      <button
                        onClick={() => removeSupplier(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove Supplier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Supplier Name</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('name', 'supplier_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_name` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.name}
                            onChange={(e) => updateSupplier(item.id, 'name', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-855 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Acme Corp"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Products / Services Provided</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('productServiceProvided', 'supplier_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_productServiceProvided` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.productServiceProvided}
                            onChange={(e) => updateSupplier(item.id, 'productServiceProvided', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-855 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Raw materials, Hosting services"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Credit Terms (Days Credit)</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('creditTermsDays', 'supplier_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_creditTermsDays` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.creditTermsDays}
                            onChange={(e) => updateSupplier(item.id, 'creditTermsDays', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-855 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. 30 days, Cash on delivery"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Part 6: Equipment & Operational Resources */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Equipment & Operational Resources</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Log operational assets, costs, purchase timing, and funding sources</p>
                  </div>
                </div>
                <button
                  onClick={addEquipmentItem}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Resource
                </button>
              </div>

              {(!plan.equipment || plan.equipment.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No equipment or resources logged yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {plan.equipment.map((item, idx) => (
                    <div key={item.id} className="p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-4 relative group">
                      <button
                        onClick={() => removeEquipmentItem(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Resource Name</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('name', 'equipment_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_name` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.name}
                            onChange={(e) => updateEquipmentItem(item.id, 'name', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Delivery Van, High-end Laptops"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Estimated Cost</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('cost', 'equipment_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_cost` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.cost}
                            onChange={(e) => updateEquipmentItem(item.id, 'cost', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. £15,000"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Timing (When needed)</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('timing', 'equipment_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_timing` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.timing}
                            onChange={(e) => updateEquipmentItem(item.id, 'timing', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Month 1, Q3 Year 1"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Funding Source</label>
                            {isSupported && (
                              <button
                                type="button"
                                onClick={() => toggleListening('fundingSource', 'equipment_item', undefined, item.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  activeField === `${item.id}_fundingSource` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-650'
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={item.fundingSource}
                            onChange={(e) => updateEquipmentItem(item.id, 'fundingSource', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                            placeholder="e.g. Startup loan, Founder cash"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : type === 'products' ? (
          <div className="grid grid-cols-1 gap-6">
            <EditorSection
              icon={<Target className="w-6 h-6" />}
              title="Business Goals & Milestones"
              subtitle="What are your short-term and long-term strategic objectives?"
              value={plan.businessGoals}
              onChange={(val) => updatePlan('businessGoals', val)}
              placeholder="Detail your key milestones, goals, and metrics for success..."
              minHeight="200px"
              isSupported={isSupported}
              isListening={activeField === 'businessGoals'}
              onToggleListening={() => toggleListening('businessGoals')}
              tooltipContent={BUSINESS_PLAN_GUIDANCE.goals}
            />

            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Features & Benefits</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Map product features directly to customer value benefits</p>
                  </div>
                </div>
                <button
                  onClick={addFeatureBenefit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              {(!plan.featuresBenefits || plan.featuresBenefits.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No features mapped yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {plan.featuresBenefits.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl relative group">
                      <button
                        onClick={() => removeFeatureBenefit(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Feature {idx + 1}</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('feature', 'feature_benefit', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_feature` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.feature}
                          onChange={(e) => updateFeatureBenefit(item.id, 'feature', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Offline Local AI Processing"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Benefit</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('benefit', 'feature_benefit', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_benefit` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.benefit}
                          onChange={(e) => updateFeatureBenefit(item.id, 'benefit', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Absolute user privacy and zero execution latency"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : type === 'market' ? (
          <div className="space-y-8">
            {/* Part 1: Market Sizing */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Market Sizing (TAM • SAM • SOM)</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Define your global opportunity, reachable segment, and realistic capture target</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visualization Side */}
                <div className="lg:col-span-5 flex justify-center py-6">
                  <div className="relative w-72 h-72">
                    {/* TAM Circle */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 rounded-full bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 flex items-start justify-center pt-6"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-450 dark:text-blue-500">TAM</span>
                    </motion.div>
                    {/* SAM Circle */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute inset-[15%] rounded-full bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 flex items-start justify-center pt-6 shadow-inner"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-450 dark:text-indigo-500">SAM</span>
                    </motion.div>
                    {/* SOM Circle */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute inset-[30%] rounded-full bg-violet-600 shadow-xl flex items-center justify-center text-white"
                    >
                      <div className="text-center">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Your Market</span>
                        <p className="text-base font-black tracking-tighter mt-0.5 italic">SOM</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Inputs Side */}
                <div className="lg:col-span-7 space-y-6">
                  <SizingCell
                    icon={<Globe2 className="w-6 h-6" />}
                    title="Total Addressable Market"
                    subtitle="TAM • The global opportunity"
                    value={canvasData.marketSizing?.tam || ''}
                    description={canvasData.marketSizing?.tamDescription || ''}
                    onValueChange={(v) => updateMarket('tam', v)}
                    onDescChange={(v) => updateMarket('tamDescription', v)}
                    color="blue"
                    isSupported={isSupported}
                    isListening={activeField === 'marketSizing_tamDescription'}
                    onToggleListening={() => toggleListening('tamDescription', 'market_sizing')}
                    tooltipContent={MARKET_SIZING_GUIDANCE.tamDescription}
                  />
                  <SizingCell
                    icon={<Target className="w-6 h-6" />}
                    title="Serviceable Addressable Market"
                    subtitle="SAM • Market segment you can reach"
                    value={canvasData.marketSizing?.sam || ''}
                    description={canvasData.marketSizing?.samDescription || ''}
                    onValueChange={(v) => updateMarket('sam', v)}
                    onDescChange={(v) => updateMarket('samDescription', v)}
                    color="indigo"
                    isSupported={isSupported}
                    isListening={activeField === 'marketSizing_samDescription'}
                    onToggleListening={() => toggleListening('samDescription', 'market_sizing')}
                    tooltipContent={MARKET_SIZING_GUIDANCE.samDescription}
                  />
                  <SizingCell
                    icon={<Flag className="w-6 h-6" />}
                    title="Serviceable Obtainable Market"
                    subtitle="SOM • Target you will realistically capture"
                    value={canvasData.marketSizing?.som || ''}
                    description={canvasData.marketSizing?.somDescription || ''}
                    onValueChange={(v) => updateMarket('som', v)}
                    onDescChange={(v) => updateMarket('somDescription', v)}
                    color="violet"
                    isSupported={isSupported}
                    isListening={activeField === 'marketSizing_somDescription'}
                    onToggleListening={() => toggleListening('somDescription', 'market_sizing')}
                    tooltipContent={MARKET_SIZING_GUIDANCE.somDescription}
                  />
                </div>
              </div>
            </div>

            {/* Part 2: Trends Section */}
            <div className="p-8 bg-white/80 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Market Trends & Primary Research</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Validate industry shifts and secondary research sources</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Chosen Market Trends</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('marketTrends')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'marketTrends' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.marketTrends}
                    onChange={(e) => updatePlan('marketTrends', e.target.value)}
                    className="w-full h-44 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Describe key trends, growth trajectory, or industry movements..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">How You Know This (Market Sources)</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('marketTrendsResearch')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'marketTrendsResearch' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.marketTrendsResearch}
                    onChange={(e) => updatePlan('marketTrendsResearch', e.target.value)}
                    className="w-full h-44 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Detail primary or secondary research evidence, industry statistics, and reports..."
                  />
                </div>
              </div>
            </div>

            {/* Part 3: Customers Section */}
            <div className="p-8 bg-white/80 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Customer Research Details</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Define target client groups and their feedback requirements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Customer Groups</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('customerGroups')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'customerGroups' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.customerGroups}
                    onChange={(e) => updatePlan('customerGroups', e.target.value)}
                    className="w-full h-40 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="e.g. Freelance Marketers, startup founders, consulting managers..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">What Customers Want</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('customerDemands')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'customerDemands' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.customerDemands}
                    onChange={(e) => updatePlan('customerDemands', e.target.value)}
                    className="w-full h-40 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Pain points, desired capabilities, pricing sensitivities..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-widest">How You Know This (Validation)</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('customerResearch')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'customerResearch' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.customerResearch}
                    onChange={(e) => updatePlan('customerResearch', e.target.value)}
                    className="w-full h-40 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Summarize surveys, client interviews, focus group details, secondary sources..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : type === 'competitors' ? (
          <div className="space-y-8">
            {/* Part 1: Competitors Matrix */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Competitor Evaluation Matrix</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Map competitor names, strengths, and vulnerabilities</p>
                  </div>
                </div>
                <button
                  onClick={addCompetitor}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Competitor
                </button>
              </div>

              {(!plan.competitors || plan.competitors.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Network className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No competitors listed yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {plan.competitors.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl relative group">
                      <button
                        onClick={() => removeCompetitor(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Competitor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Competitor Name</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('name', 'competitor_item', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_name` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.name}
                          onChange={(e) => updateCompetitor(item.id, 'name', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. StratCo Corp"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Key Strengths</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('strengths', 'competitor_item', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_strengths` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.strengths}
                          onChange={(e) => updateCompetitor(item.id, 'strengths', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Broad distribution, established brand"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Key Weaknesses</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('weaknesses', 'competitor_item', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_weaknesses` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.weaknesses}
                          onChange={(e) => updateCompetitor(item.id, 'weaknesses', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Expensive pricing, slow AI innovation"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Part 2: Competitor Pricing */}
            <div className="bg-white/80 dark:bg-zinc-950/70 p-8 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Price Point Comparisons</h3>
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Track your pricing vs. competitor ranges and difference reasons</p>
                  </div>
                </div>
                <button
                  onClick={addCompetitorPrice}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="w-4 h-4" />
                  Add Price Point
                </button>
              </div>

              {(!plan.competitorPricing || plan.competitorPricing.length === 0) ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Building2 className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">No price points compared yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {plan.competitorPricing.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl relative group">
                      <button
                        onClick={() => removeCompetitorPrice(item.id)}
                        className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Product / Service</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('productService', 'competitor_price', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_productService` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.productService}
                          onChange={(e) => updateCompetitorPrice(item.id, 'productService', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Standard SaaS plan"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Your Price (£ / $)</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('yourPrice', 'competitor_price', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_yourPrice` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.yourPrice}
                          onChange={(e) => updateCompetitorPrice(item.id, 'yourPrice', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. £29/mo"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Competitor Range</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('competitorPriceRange', 'competitor_price', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_competitorPriceRange` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.competitorPriceRange}
                          onChange={(e) => updateCompetitorPrice(item.id, 'competitorPriceRange', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. £49 - £99/mo"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Difference Justification</label>
                          {isSupported && (
                            <button
                              type="button"
                              onClick={() => toggleListening('differenceReason', 'competitor_price', undefined, item.id)}
                              className={`p-1 rounded-lg transition-colors ${
                                activeField === `${item.id}_differenceReason` ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400'
                              }`}
                            >
                              <Mic className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text"
                          value={item.differenceReason}
                          onChange={(e) => updateCompetitorPrice(item.id, 'differenceReason', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. Cost efficiency of secure local browser processing"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Part 3: Qualitative evaluation */}
            <div className="p-8 bg-white/80 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 leading-none">Competitive Strategy</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">Formulate strategies to improve on competition offerings</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Gathered Competitor Info</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('gatheredCompetitorInfo')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'gatheredCompetitorInfo' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.gatheredCompetitorInfo}
                    onChange={(e) => updatePlan('gatheredCompetitorInfo', e.target.value)}
                    className="w-full h-36 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Detail gathered specifications, client feedback on them, marketing focus..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">How You Can Improve Offer / Prices</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('competitorImprovement')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'competitorImprovement' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.competitorImprovement}
                    onChange={(e) => updatePlan('competitorImprovement', e.target.value)}
                    className="w-full h-36 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Strategies to deliver higher quality, faster response, or lower cost..."
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Your Competitive Advantage</label>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggleListening('competitiveAdvantage')}
                        className={`p-1 rounded-lg transition-colors ${
                          activeField === 'competitiveAdvantage' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-400 hover:text-zinc-655'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea 
                    value={plan.competitiveAdvantage}
                    onChange={(e) => updatePlan('competitiveAdvantage', e.target.value)}
                    className="w-full h-36 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    placeholder="Detail unique IP, execution speed, cost structure, exclusive partnerships..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Part 1: Details */}
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
              Open the AI Strategist in the sidebar to have Gemma review your {type === 'summary' ? 'summary' : type === 'identity' ? 'mission and values' : type === 'policy' ? 'strategic policies' : type === 'products' ? 'features and benefits' : type === 'market' ? 'market and customer research' : type === 'competitors' ? 'competitive landscape' : 'business details and personnel configurations'}. It will provide feedback on completeness, structure, and strategic gaps.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
