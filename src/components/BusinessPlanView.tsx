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
  Check,
  Building2,
  Shield
} from 'lucide-react';
import { CanvasData, KeyPerson, BusinessPlanData } from '../types';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { BUSINESS_PLAN_GUIDANCE, TooltipContent } from '../utils/guidance';

interface BusinessPlanViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
  type: 'summary' | 'identity' | 'details' | 'policy';
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
    type: 'plan' | 'person';
    field: string;
    personId?: string;
  }
  
  const activeTargetRef = useRef<ListeningTarget | null>(null);
  const initialTextRef = useRef('');
  const canvasDataRef = useRef(canvasData);
  const setCanvasDataRef = useRef(setCanvasData);

  useEffect(() => {
    canvasDataRef.current = canvasData;
    setCanvasDataRef.current = setCanvasData;
  }, [canvasData, setCanvasData]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let sessionTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            sessionTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        const cleanSessionTranscript = sessionTranscript.trim();
        const target = activeTargetRef.current;
        if (cleanSessionTranscript && target) {
          const defaultPlan: BusinessPlanData = { executiveSummary: '', mission: '', vision: '', values: '', fairWorkPractices: '', sustainabilityPolicy: '' };
          if (target.type === 'plan') {
            const baseText = initialTextRef.current.trim();
            const isLongForm = ['executiveSummary', 'mission', 'vision', 'values', 'fairWorkPractices', 'sustainabilityPolicy'].includes(target.field);
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
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          console.error('Speech recognition error in Business Plan:', event.error);
        }
        setActiveField(null);
        activeTargetRef.current = null;
      };

      recognition.onend = () => {
        setActiveField(null);
        activeTargetRef.current = null;
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = (field: string, targetType: 'plan' | 'person' = 'plan', personId?: string) => {
    if (!recognitionRef.current) return;

    const identifier = targetType === 'plan' ? field : `${personId}_${field}`;

    if (activeField) {
      recognitionRef.current.stop();
      setActiveField(null);
      activeTargetRef.current = null;
      if (activeField === identifier) return; // Toggle off if clicked active button
    }

    const currentPlan = canvasDataRef.current.businessPlan || { 
      executiveSummary: '', 
      mission: '', 
      vision: '', 
      values: '',
      fairWorkPractices: 'We are committed to fostering a fair, flexible, and inclusive workplace. This includes supporting modern hybrid working arrangements, maintaining clear diversity and equal opportunity policies, ensuring transparent career progression, and offering competitive, fair remuneration. We regularly review employee satisfaction and wellness initiatives to support work-life balance.',
      sustainabilityPolicy: 'Our sustainability strategy is focused on reducing our carbon footprint and encouraging circular economy practices. We prioritize local sourcing, utilize energy-efficient technologies across our operations, actively minimize single-use waste, and partner with suppliers who align with our environmental and ethical standards.'
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
    }

    initialTextRef.current = baseVal;
    activeTargetRef.current = { type: targetType, field, personId };
    setActiveField(identifier);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition in Business Plan:', error);
      setActiveField(null);
      activeTargetRef.current = null;
    }
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
    sustainabilityPolicy: canvasData.businessPlan?.sustainabilityPolicy ?? 'Our sustainability strategy is focused on reducing our carbon footprint and encouraging circular economy practices. We prioritize local sourcing, utilize energy-efficient technologies across our operations, actively minimize single-use waste, and partner with suppliers who align with our environmental and ethical standards.'
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
              : 'Business Details & Personnel'}
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
        ) : (
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
              Open the AI Strategist in the sidebar to have Gemma review your {type === 'summary' ? 'summary' : type === 'identity' ? 'mission and values' : type === 'policy' ? 'strategic policies' : 'business details and personnel configurations'}. It will provide feedback on completeness, structure, and strategic gaps.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
