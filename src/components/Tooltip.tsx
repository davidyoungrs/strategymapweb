import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: {
    definition: string;
    questions: string[];
    example?: string;
  };
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="absolute bottom-4 right-4 z-30 inline-block" ref={tooltipRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Avoid triggering any focus/click events on parent
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
        title="Toggle help guidance"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-72 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl text-left right-0 bottom-8 text-xs text-zinc-650 dark:text-zinc-400">
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
      )}
    </div>
  );
};
