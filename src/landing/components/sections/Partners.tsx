import React from 'react';

const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-zinc-950 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-[10px] font-bold text-zinc-500 text-center mb-8 uppercase tracking-widest">Strategic Partners & Global Impact</p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="text-xl font-black text-zinc-300">Xpert-Solutions (UK)</div>
          <div className="text-xl font-black text-zinc-300">TNT Synergy Solutions (USA)</div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
