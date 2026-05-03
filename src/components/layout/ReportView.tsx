import React from 'react';
import { BusinessModelCanvas } from '../canvas/BusinessModelCanvas';
import { StrategyMap } from '../StrategyMap';
import { SwotView } from '../SwotView';
import { CanvasData, UserProfile } from '../../types';

interface ReportViewProps {
  canvasData: CanvasData;
  userCanvases: CanvasData[];
  profile: UserProfile | null;
}

export const ReportView: React.FC<ReportViewProps> = ({ canvasData, userCanvases, profile }) => {
  return (
    <div id="report-capture-container" className="bg-white dark:bg-zinc-950 p-10 space-y-20 w-[1200px]">
      <div className="border-b-4 border-zinc-900 dark:border-zinc-50 pb-8 mb-12">
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">{canvasData.title}</h1>
        <div className="flex justify-between items-end">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Strategic Analysis Report</p>
          {canvasData.logoUrl && (
            <img src={canvasData.logoUrl} alt="Logo" className="h-12 object-contain" />
          )}
        </div>
      </div>

      <div id="report-page-1" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">1. Business Model Canvas</h2>
        <BusinessModelCanvas 
          canvasData={canvasData}
          setCanvasData={() => {}} // Read-only for export
        />
      </div>

      <div id="report-page-2" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">2. Strategy Map</h2>
        <StrategyMap 
          data={canvasData.strategyMap || { financial: [], customer: [], internal: [], learning: [] }}
          onChange={() => {}}
          projectTitle={canvasData.title}
          onTitleChange={() => {}}
          userCanvases={userCanvases}
          onSelectCanvas={() => {}}
        />
      </div>

      <div id="report-page-3" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">3. SWOT Analysis</h2>
        <SwotView 
          data={canvasData.swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' }}
          onChange={() => {}}
          projectTitle={canvasData.title}
          onTitleChange={() => {}}
          userCanvases={userCanvases}
          onSelectCanvas={() => {}}
        />
      </div>

      <div className="pt-20 text-center border-t border-zinc-100 dark:border-zinc-800 mt-20">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Kettle Strat • Internal Document</p>
      </div>
    </div>
  );
};
