import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { CanvasData, UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/firestore-utils';
import { TEMPLATES } from '../data/templates';

export const useCanvasData = (userId: string | undefined, profile: UserProfile | null, viewUserId?: string) => {
  const [userCanvases, setUserCanvases] = useState<CanvasData[]>([]);
  const [canvasData, setCanvasData] = useState<CanvasData>({
    userId: '',
    title: 'New Venture Strategy',
    keyPartners: '',
    keyActivities: '',
    valuePropositions: '',
    customerRelationships: '',
    customerSegments: '',
    keyResources: '',
    channels: '',
    costStructure: '',
    revenueStreams: '',
    strategyMap: {
      financial: [],
      customer: [],
      internal: [],
      learning: [],
    },
    swot: {
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: '',
    },
    pestel: {
      political: '',
      economic: '',
      social: '',
      technological: '',
      environmental: '',
      legal: '',
    },
    businessPlan: {
      executiveSummary: '',
      mission: '',
      vision: '',
      values: '',
    },
    marketSizing: {
      tam: '',
      sam: '',
      som: '',
      tamDescription: '',
      samDescription: '',
      somDescription: '',
    },
    riskRegister: [],
    financials: {
      years: [
        { year: 1, revenue: 0, cogs: 0, operatingExpenses: 0 },
        { year: 2, revenue: 0, cogs: 0, operatingExpenses: 0 },
        { year: 3, revenue: 0, cogs: 0, operatingExpenses: 0 },
      ]
    },
    createdAt: null,
    updatedAt: null,
  });
  const [originalTitle, setOriginalTitle] = useState('New Venture Strategy');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedData, setLastSavedData] = useState<string>('');

  const targetUserId = viewUserId || userId;

  useEffect(() => {
    if (!targetUserId) {
      setUserCanvases([]);
      return;
    }

    const canvasesRef = collection(db, 'canvases');
    const q = query(
      canvasesRef, 
      where('userId', '==', targetUserId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const canvases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CanvasData));
      setUserCanvases(canvases);
      
      // Auto-load most recent if none selected OR if we switched users
      if (!snapshot.empty && (!canvasData.id || canvasData.userId !== targetUserId)) {
        const firstDoc = snapshot.docs[0];
        const data = { id: firstDoc.id, ...firstDoc.data() } as CanvasData;
        setCanvasData(data);
        setOriginalTitle(firstDoc.data().title);
        setLastSavedData(JSON.stringify(data));
      } else if (snapshot.empty) {
        setCanvasData(prev => ({ ...prev, userId: targetUserId, id: undefined }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'canvases');
    });

    return () => unsubscribe();
  }, [targetUserId, canvasData.id]);

  const handleNewCanvas = () => {
    setCanvasData({
      userId: targetUserId || '',
      title: 'Untitled Canvas',
      keyPartners: '',
      keyActivities: '',
      valuePropositions: '',
      customerRelationships: '',
      customerSegments: '',
      keyResources: '',
      channels: '',
      costStructure: '',
      revenueStreams: '',
      strategyMap: {
        financial: [],
        customer: [],
        internal: [],
        learning: []
      },
      swot: {
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
      },
      pestel: {
        political: '',
        economic: '',
        social: '',
        technological: '',
        environmental: '',
        legal: '',
      },
      businessPlan: {
        executiveSummary: '',
        mission: '',
        vision: '',
        values: '',
      },
      marketSizing: {
        tam: '',
        sam: '',
        som: '',
        tamDescription: '',
        samDescription: '',
      },
      riskRegister: [],
      financials: {
        years: [
          { year: 1, revenue: 0, cogs: 0, operatingExpenses: 0 },
          { year: 2, revenue: 0, cogs: 0, operatingExpenses: 0 },
          { year: 3, revenue: 0, cogs: 0, operatingExpenses: 0 },
        ]
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setOriginalTitle('Untitled Canvas');
  };

  const handleSelectCanvas = (canvas: CanvasData) => {
    setCanvasData(canvas);
    setOriginalTitle(canvas.title);
    setLastSavedData(JSON.stringify(canvas));
    setSaveStatus('saved');
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCanvasData(prev => ({
        ...prev,
        ...template.data
      }));
    }
  };

  const handleSaveCanvas = async (silent = false) => {
    if (!targetUserId || !profile) return;
    
    const isAdmin = profile.email === 'david.young@reallysimpleapps.com';
    if (!profile.isPaidTier && !isAdmin) {
      if (!silent) alert("Saving is a Pro feature. Please upgrade to save your canvas.");
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const isTitleChanged = canvasData.id && canvasData.title !== originalTitle;
      const canvasesRef = collection(db, 'canvases');
      const canvasId = isTitleChanged ? doc(canvasesRef).id : (canvasData.id || doc(canvasesRef).id);
      const canvasRef = doc(db, 'canvases', canvasId);
      
      const dataToSave = {
        ...canvasData,
        id: canvasId,
        userId: targetUserId,
        updatedAt: serverTimestamp(),
        createdAt: isTitleChanged ? serverTimestamp() : (canvasData.createdAt || serverTimestamp()),
        swot: canvasData.swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' },
        strategyMap: canvasData.strategyMap || { financial: [], customer: [], internal: [], learning: [] },
        pestel: canvasData.pestel || { political: '', economic: '', social: '', technological: '', environmental: '', legal: '' },
        businessPlan: canvasData.businessPlan || { executiveSummary: '', mission: '', vision: '', values: '' },
        marketSizing: canvasData.marketSizing || { tam: '', sam: '', som: '', tamDescription: '', samDescription: '', somDescription: '' },
        riskRegister: canvasData.riskRegister || [],
        financials: canvasData.financials || { years: [
          { year: 1, revenue: 0, cogs: 0, operatingExpenses: 0 },
          { year: 2, revenue: 0, cogs: 0, operatingExpenses: 0 },
          { year: 3, revenue: 0, cogs: 0, operatingExpenses: 0 },
        ]}
      };
      
      await setDoc(canvasRef, dataToSave, { merge: true });
      
      if (!canvasData.id || isTitleChanged) {
        setCanvasData(prev => ({ ...prev, id: canvasId }));
      }
      
      const savedString = JSON.stringify({ ...dataToSave, updatedAt: null, createdAt: null });
      setLastSavedData(savedString);
      setOriginalTitle(canvasData.title);
      setSaveStatus('saved');
      if (!silent) alert(isTitleChanged ? "Saved as new canvas!" : "Canvas saved successfully!");
    } catch (error) {
      setSaveStatus('unsaved');
      handleFirestoreError(error, OperationType.WRITE, 'canvases');
    } finally {
      setIsSaving(false);
    }
  };

  // Autosave Logic
  useEffect(() => {
    if (!canvasData.id || !targetUserId) return;

    const currentDataString = JSON.stringify({ ...canvasData, updatedAt: null, createdAt: null });
    
    if (lastSavedData && currentDataString !== lastSavedData) {
      setSaveStatus('unsaved');
      const timer = setTimeout(() => {
        handleSaveCanvas(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [canvasData, targetUserId, lastSavedData]);

  return {
    userCanvases,
    canvasData,
    setCanvasData,
    saveStatus,
    handleNewCanvas,
    handleSelectCanvas,
    handleSaveCanvas,
    handleLoadTemplate
  };
};
