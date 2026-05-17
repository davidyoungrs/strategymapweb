import React, { useEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

const Bookings: React.FC = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        "theme": "dark",
        "styles": { "branding": { "brandColor": "#7EF473" } },
        "hideEventTypeDetails": false,
        // @ts-ignore: hideBranding is not typed but works
        "hideBranding": true,
        "layout": "month_view"
      });
    })();
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen flex flex-col items-center bg-zinc-950">
      <div className="w-full max-w-6xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-zinc-100 uppercase tracking-tight font-black">Schedule a Consultation</h1>
          <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 max-w-2xl mx-auto opacity-80">
            Select a time slot below to discuss your industrial strategy requirements with our team of specialists.
          </p>
        </div>
        
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl w-full min-h-[700px] flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-full h-[700px] relative z-10">
            <Cal
              calLink="kettlestrat/30min"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              // @ts-ignore: hideBranding is not typed but works
              config={{ layout: 'month_view', theme: 'dark', hideBranding: true }}
            />
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800">
          {/* Step 1 */}
          <div className="p-10 border-b md:border-b-0 md:border-r border-zinc-800 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 01</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Preparation</h3>
            <p className="text-base text-zinc-400 mb-6">Please have any relevant system logs or architectural diagrams ready for discussion.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
          {/* Step 2 */}
          <div className="p-10 border-b md:border-b-0 md:border-r border-zinc-800 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 02</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Duration</h3>
            <p className="text-base text-zinc-400 mb-6">Initial consultations typically last 30 minutes to ensure deep technical alignment.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
          {/* Step 3 */}
          <div className="p-10 hover:bg-zinc-900 transition-colors group">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">STEP // 03</div>
            <h3 className="text-xl font-black text-zinc-100 mb-4 uppercase">Confidentiality</h3>
            <p className="text-base text-zinc-400 mb-6">All discussions are covered under our standard industrial non-disclosure agreements.</p>
            <div className="w-12 h-px bg-zinc-700 group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
