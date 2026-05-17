import React from 'react';

const Methodology: React.FC = () => {
  return (
    <section id="methodology" className="py-24 bg-zinc-950 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-100 mb-4 uppercase">The Boil and Brewing Process</h2>
            <p className="text-base text-zinc-400">Our methodology is designed to strip away operational noise and expose the core efficiencies hidden within the complexity.</p>
          </div>
          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">MET_ID: BDP-001</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800">
          {/* Step 1 */}
          <div className="p-10 border-b md:border-b-0 md:border-r border-zinc-800 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 01</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Ingest & Audit</h3>
            <p className="text-base text-zinc-400 mb-6">Comprehensive data gathering from your people, process and systems to map the current operational landscape.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
          {/* Step 2 */}
          <div className="p-10 border-b md:border-b-0 md:border-r border-zinc-800 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 02</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Distill & Brew</h3>
            <p className="text-base text-zinc-400 mb-6">Filtering operational noise through subject matter expertise support with advanced AI models to identify critical failure points and performance issues.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
          {/* Step 3 */}
          <div className="p-10 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 03</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Execute & Optimize</h3>
            <p className="text-base text-zinc-400 mb-6">Implementation of actionable outcomes with continuous technical oversight to ensure long-term stability.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
