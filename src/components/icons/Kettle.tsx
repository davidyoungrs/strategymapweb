import React from 'react';

export const Kettle: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Kettle Body */}
    <path d="M5 19C5 17 6 15 8 14H16C18 15 19 17 19 19H5Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M5 19C5 17 6 15 8 14H16C18 15 19 17 19 19" />
    <path d="M19 19H5" />
    
    {/* Main Pot Structure */}
    <path d="M12 7C8.5 7 6 9.5 6 13V14H18V13C18 9.5 15.5 7 12 7Z" />
    
    {/* Handle */}
    <path d="M8 7V5C8 4 9 3 12 3C15 3 16 4 16 5V7" />
    
    {/* Spout */}
    <path d="M18 10L21 8V12L18 11" />
    
    {/* Lid Knob */}
    <circle cx="12" cy="7" r="1" fill="currentColor" />
  </svg>
);
