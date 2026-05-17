import React from 'react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg mb-12 uppercase">Core Engineering Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Large Service Card */}
          <div className="md:col-span-8 group relative overflow-hidden bg-background border border-outline-variant p-10 flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-4 right-4 font-label-technical text-on-tertiary-container opacity-20">SVC_ID: HP_MGMT</div>
            <div>
              <div className="mb-8">
                <span className="material-symbols-outlined text-primary-container text-4xl">settings_input_component</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-4 uppercase">High-energy pipework management</h3>
              <p className="text-on-surface-variant font-body-lg max-w-lg">Advanced structural integrity analysis and flow optimization for high-pressure systems in thermal and nuclear applications.</p>
            </div>
            <div className="mt-8 flex justify-between items-end">
              <button className="text-primary-container font-label-technical uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                Technical Specs <span className="material-symbols-outlined">north_east</span>
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-5 pointer-events-none">
              <svg className="w-full h-full stroke-current text-primary" viewBox="0 0 100 100">
                <path d="M0,50 Q25,0 50,50 T100,50" fill="none" strokeWidth="0.5"></path>
                <path d="M0,60 Q25,10 50,60 T100,60" fill="none" strokeWidth="0.5"></path>
              </svg>
            </div>
          </div>

          {/* Smaller Service Card 1 */}
          <div className="md:col-span-4 group bg-surface-container border border-outline-variant p-8 flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-primary-container text-3xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase">AI-driven maintenance</h3>
              <p className="text-on-surface-variant font-body-md">Predictive failure modeling using machine learning to minimize unscheduled downtime.</p>
            </div>
            <div className="font-label-technical text-label-technical text-on-tertiary-container mt-8">STATUS: ACTIVE_DEPLOYMENT</div>
          </div>

          {/* Smaller Service Card 2 */}
          <div className="md:col-span-4 group bg-surface-container border border-outline-variant p-8 flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-primary-container text-3xl mb-6">fact_check</span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase">Technical auditing</h3>
              <p className="text-on-surface-variant font-body-md">Rigorous compliance and efficiency audits for regulated industrial environments.</p>
            </div>
            <div className="font-label-technical text-label-technical text-on-tertiary-container mt-8">REF: ISO_STANDARDS_2024</div>
          </div>

          {/* CTA Card (Asymmetric Filler) */}
          <div className="md:col-span-8 bg-primary-container p-12 flex flex-col md:flex-row items-center justify-between gap-gutter">
            <div className="text-on-primary">
              <h3 className="font-headline-lg text-headline-lg mb-2 uppercase">Ready for Audit?</h3>
              <p className="font-body-md font-semibold">Secure your technical consultation and optimize your infrastructure.</p>
            </div>
            <Link to="/bookings" className="bg-on-primary text-primary px-8 py-4 font-bold uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap inline-block text-center">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
