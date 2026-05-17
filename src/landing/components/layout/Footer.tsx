import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-4 md:px-8 py-12 max-w-7xl mx-auto gap-8">
        <div className="max-w-xs">
          <div className="text-xl font-black text-zinc-100 uppercase mb-4">Kettle Strat</div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
            Industrial Consultancy for High-Stakes Systems. Precise. Authoritative. Reliable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-[10px] font-bold text-blue-500 mb-4 uppercase tracking-widest">Tools</h4>
            <ul className="space-y-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <li><a href="https://kettlestrat.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Kettle Strat Tools</a></li>
              <li><Link className="hover:text-blue-500 transition-colors" to="#">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-blue-500 mb-4 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <li><Link className="hover:text-blue-500 transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-blue-500 transition-colors" to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-blue-500 mb-4 uppercase tracking-widest">Contact</h4>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              HQ: Aberdeen UK<br/>
              <a href="mailto:info@kettlestrat.com" className="hover:text-blue-500 transition-colors">info@kettlestrat.com</a>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full px-4 md:px-8 py-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/50">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-50">© 2026 Kettle Strat Limited All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-blue-500">●</span>
          <span className="text-zinc-500">SYSTEM_OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
