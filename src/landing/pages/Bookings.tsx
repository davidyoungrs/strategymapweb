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
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-800 pt-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs text-primary uppercase tracking-widest font-bold">Preparation</h3>
            <p className="text-xs text-zinc-400 opacity-70">
              Please have any relevant system logs or architectural diagrams ready for discussion.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs text-primary uppercase tracking-widest font-bold">Duration</h3>
            <p className="text-xs text-zinc-400 opacity-70">
              Initial consultations typically last 30 minutes to ensure deep technical alignment.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xs text-primary uppercase tracking-widest font-bold">Confidentiality</h3>
            <p className="text-xs text-zinc-400 opacity-70">
              All discussions are covered under our standard industrial non-disclosure agreements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
