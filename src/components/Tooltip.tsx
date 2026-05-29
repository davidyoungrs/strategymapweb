import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: {
    definition: string;
    questions: string[];
    example?: string;
  };
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  return (
    <div className="relative group shrink-0 inline-block">
      <HelpCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-help" />
      <div className="absolute z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 w-72 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl text-left right-0 lg:left-1/2 lg:-translate-x-1/2 top-6 text-xs text-zinc-650 dark:text-zinc-400 pointer-events-none">
        <p className="font-bold text-zinc-800 dark:text-zinc-250 mb-1.5 leading-snug">{content.definition}</p>
        
        {content.questions && content.questions.length > 0 && (
          <div className="mb-2.5">
            <p className="font-black text-zinc-400 dark:text-zinc-500 uppercase text-[9px] tracking-widest mb-1">Guiding Questions</p>
            <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400">
              {content.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        
        {content.example && (
          <div>
            <p className="font-black text-zinc-400 dark:text-zinc-500 uppercase text-[9px] tracking-widest mb-1">Example</p>
            <p className="italic text-zinc-700 dark:text-zinc-300">"{content.example}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
