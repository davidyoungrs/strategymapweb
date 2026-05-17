import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[550px] flex items-center overflow-hidden border-b border-zinc-700 bg-zinc-950">
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          className="w-full h-full object-cover" 
          alt="A cinematic, high-contrast wide shot of a modern industrial facility at night." 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzVDNCdoHYi2K0R5ofXZk7OZ87UEtSC4_5coSqr1LCXUoxjBYkdNfWIXdJTTOcepDDG6Sx3tjpDqBE29QLfqZuf-xC0xT3yw_8WnYDdRo7t7lTukscU3IRFS-9dS3fT-FIJ8XoW5AiK4v87hmj2fu6dFK1NyIx4ezNZVKZWBx_v2AdfKhLjK2nDZRPA1xyT8jsqr1T4cQ7Y3E2BPcI_MGzfs_EuJMdXgQz4CrsLAESZugY0emGzSrCMs8Hl6EHI9eQMt9mIbXGeWdC"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10"></div>
      <div className="relative z-20 px-4 md:px-8 max-w-7xl mx-auto w-full py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">SYS: OP_READY</span>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-tighter text-zinc-100">Boiling Down Complexity.</h1>
          <p className="text-lg font-medium text-zinc-400 mb-8 max-w-xl">
            Precision industrial consultancy for high-stakes environments. We simplify complex problems into actionable outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bookings" className="bg-primary text-primary-content px-8 py-4 font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 text-sm">
              Request a Technical Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#methodology" className="border border-zinc-700 text-zinc-100 px-8 py-4 font-bold uppercase tracking-wide rounded-xl hover:bg-zinc-800 transition-all inline-block text-center flex items-center justify-center text-sm">
              View Methodology
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden lg:block text-right z-20">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          COORD: 42.0 // SYS: PWR_STRAT<br/>
          AUTH: L7_CONSULTANT
        </div>
      </div>
    </section>
  );
};

export default Hero;
