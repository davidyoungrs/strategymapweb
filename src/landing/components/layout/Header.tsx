import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-700 w-full top-0 z-50 sticky">
      <nav className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
            <path d="M5 19C5 17 6 15 8 14H16C18 15 19 17 19 19H5Z" fill="currentColor" fillOpacity="0.2"></path>
            <path d="M5 19C5 17 6 15 8 14H16C18 15 19 17 19 19"></path>
            <path d="M19 19H5"></path>
            <path d="M12 7C8.5 7 6 9.5 6 13V14H18V13C18 9.5 15.5 7 12 7Z"></path>
            <path d="M8 7V5C8 4 9 3 12 3C15 3 16 4 16 5V7"></path>
            <path d="M18 10L21 8V12L18 11"></path>
            <circle cx="12" cy="7" r="1" fill="currentColor"></circle>
          </svg>
          <div className="text-xl font-black tracking-tighter text-zinc-100 uppercase">Kettle Strat</div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <a href="https://kettlestrat.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Kettle Strat Tools</a>
            <Link to="#" className="hover:text-blue-500 transition-colors">Blog</Link>
          </div>
          <Link to="/bookings" className="bg-primary text-primary-content px-6 py-2 font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-wide text-sm">
            Consultation
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
