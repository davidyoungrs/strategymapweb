import React from 'react';
import { BusinessModelCanvas } from '../canvas/BusinessModelCanvas';
import { StrategyMap } from '../StrategyMap';
import { SwotView } from '../SwotView';
import { CanvasData, UserProfile } from '../../types';
import { Users, Building2, Network, DollarSign } from 'lucide-react';

interface ReportViewProps {
  canvasData: CanvasData;
  userCanvases: CanvasData[];
  profile: UserProfile | null;
}

export const ReportView: React.FC<ReportViewProps> = ({ canvasData, userCanvases }) => {
  return (
    <div id="report-capture-container" className="bg-white dark:bg-zinc-950 p-10 space-y-20 w-[1200px]">
      {/* Title Header */}
      <div className="border-b-4 border-zinc-900 dark:border-zinc-50 pb-8 mb-12">
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-4">{canvasData.title}</h1>
        <div className="flex justify-between items-end">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Strategic Analysis & Business Plan Report</p>
          {canvasData.logoUrl && (
            <img src={canvasData.logoUrl} alt="Logo" className="h-12 object-contain" />
          )}
        </div>
      </div>

      {/* report-page-1: BMC */}
      <div id="report-page-1" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">1. Business Model Canvas</h2>
        <BusinessModelCanvas 
          canvasData={canvasData}
          setCanvasData={() => {}} // Read-only for export
        />
      </div>

      {/* report-page-2: Strategy Map */}
      <div id="report-page-2" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">2. Strategy Map</h2>
        <StrategyMap 
          data={canvasData.strategyMap || { financial: [], customer: [], internal: [], learning: [] }}
          onChange={() => {}}
          projectTitle={canvasData.title}
          onTitleChange={() => {}}
          userCanvases={userCanvases}
          onSelectCanvas={() => {}}
        />
      </div>

      {/* report-page-3: SWOT Analysis */}
      <div id="report-page-3" className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">3. SWOT Analysis</h2>
        <SwotView 
          data={canvasData.swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' }}
          onChange={() => {}}
          projectTitle={canvasData.title}
          onTitleChange={() => {}}
          userCanvases={userCanvases}
          onSelectCanvas={() => {}}
        />
      </div>

      {/* report-page-4: Executive Summary & Strategic Identity */}
      <div id="report-page-4" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">4. Executive Summary & Identity</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Foundational Overview</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Executive Summary</h3>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {canvasData.businessPlan?.executiveSummary || 'No executive summary provided.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Our Mission</h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                "{canvasData.businessPlan?.mission || 'Not provided'}"
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Our Vision</h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                "{canvasData.businessPlan?.vision || 'Not provided'}"
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Core Values</h4>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                "{canvasData.businessPlan?.values || 'Not provided'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* report-page-5: Business Details & Personnel */}
      <div id="report-page-5" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">5. Business Details & Personnel</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Company Profile & Management Structure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details Table */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Legal & Contact Details</h3>
            <table className="w-full text-xs border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
              <tbody>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase w-1/3 text-zinc-500">Business Name</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.businessName || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Address</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.address || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Telephone</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.telephone || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Legal Status</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.legalStatus || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Established Date</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.dateEstablished || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Registration No.</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.registrationNumber || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">VAT Registered</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.isVatRegistered ? 'Yes' : 'No'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Online Presence</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.onlinePresence || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">Advisers</td>
                  <td className="p-3 text-zinc-800 dark:text-zinc-200">{canvasData.businessPlan?.advisers || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Personnel */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Key Personnel & Owners</h3>
            {(!canvasData.businessPlan?.keyPersonnel || canvasData.businessPlan.keyPersonnel.length === 0) ? (
              <p className="text-xs text-zinc-500 italic">No key personnel added.</p>
            ) : (
              <div className="space-y-4">
                {canvasData.businessPlan.keyPersonnel.map((person) => (
                  <div key={person.id} className="p-4 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-xl space-y-1 text-xs">
                    <p className="text-sm font-black text-zinc-800 dark:text-zinc-200">{person.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{person.position}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] mr-1">Experience:</span>{person.experience}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] mr-1">Previous:</span>{person.previousEmployment}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] mr-1">Key Skills:</span>{person.keySkills}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] mr-1">Qualifications:</span>{person.qualifications}</p>
                    <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] mr-1">Cost/Salary:</span>{person.recentSalary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Operational Workforce */}
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Workforce & Operational Staff</h3>
          {(!canvasData.businessPlan?.staffMembers || canvasData.businessPlan.staffMembers.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No operational staff logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3">Role / Position</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Experience</th>
                    <th className="p-3">Specialist Skills & Qualifications</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.staffMembers.map((staff) => (
                    <tr key={staff.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{staff.role}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{staff.totalCost}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{staff.experience}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{staff.skillsQualifications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* report-page-6: Premises, Suppliers & Resources */}
      <div id="report-page-6" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">6. Premises, Suppliers & Resources</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Operations, Logistics & Capital Requirements</p>
        </div>

        {/* Premises Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Startup Premises Costs & Setup</h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {canvasData.businessPlan?.premisesStartupCosts || 'Not detailed.'}
            </p>
          </div>
          <div className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Future Premises Requirements</h3>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {canvasData.businessPlan?.premisesFutureRequirements || 'Not detailed.'}
            </p>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Key Suppliers & Credit Terms</h3>
          {(!canvasData.businessPlan?.suppliers || canvasData.businessPlan.suppliers.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No key suppliers logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3">Supplier Name</th>
                    <th className="p-3">Products / Services Provided</th>
                    <th className="p-3">Credit Terms (Days Credit)</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{supplier.name}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{supplier.productServiceProvided}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{supplier.creditTermsDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Equipment Grid */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Equipment & Operational Resources</h3>
          {(!canvasData.businessPlan?.equipment || canvasData.businessPlan.equipment.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No equipment or resources logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3">Resource / Equipment</th>
                    <th className="p-3">Estimated Cost</th>
                    <th className="p-3">Timing (When Needed)</th>
                    <th className="p-3">Funding Source</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.equipment.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{item.name}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{item.cost}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{item.timing}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{item.fundingSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* report-page-7: Products, Features & Benefits */}
      <div id="report-page-7" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">7. Products & Goals</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Value Proposition Mapping & Features Matrix</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Core Value Offering</h3>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {canvasData.valuePropositions || 'No core value propositions configured.'}
          </p>
        </div>

        {/* Features & Benefits Grid */}
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Features & Customer Benefits Mapping</h3>
          {(!canvasData.businessPlan?.featuresBenefits || canvasData.businessPlan.featuresBenefits.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No features mapped to benefits yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3 w-1/2">Product/Service Feature</th>
                    <th className="p-3 w-1/2">Direct Customer Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.featuresBenefits.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.feature}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{item.benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Business Goals & Milestones */}
        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Business Goals & Milestones</h3>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {canvasData.businessPlan?.businessGoals || 'No strategic goals or milestones configured.'}
          </p>
        </div>
      </div>

      {/* report-page-8: Market Overview & Customer Demands */}
      <div id="report-page-8" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">8. Market & Customers</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Market Sizing, Segmentations & Demands</p>
        </div>

        {/* Market Sizing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">TAM / SAM / SOM Metrics</h3>
            <table className="w-full text-xs border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
              <tbody>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase w-1/3 text-zinc-500">TAM</td>
                  <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{canvasData.marketSizing?.tam || 'N/A'}</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">SAM</td>
                  <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{canvasData.marketSizing?.sam || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-3 bg-zinc-50 dark:bg-zinc-900 font-bold uppercase text-zinc-500">SOM</td>
                  <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{canvasData.marketSizing?.som || 'N/A'}</td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-2 pt-2 text-xs">
              {canvasData.marketSizing?.tamDescription && (
                <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] block">TAM Description</span>{canvasData.marketSizing.tamDescription}</p>
              )}
              {canvasData.marketSizing?.samDescription && (
                <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] block">SAM Description</span>{canvasData.marketSizing.samDescription}</p>
              )}
              {canvasData.marketSizing?.somDescription && (
                <p className="text-zinc-600 dark:text-zinc-400"><span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] block">SOM Description</span>{canvasData.marketSizing.somDescription}</p>
              )}
            </div>
          </div>

          {/* Simple Printable Circles representation */}
          <div className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[300px]">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Market Capture Visualization</span>
            <div className="relative w-60 h-60 flex items-center justify-center rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/40 dark:border-zinc-700/40">
              <div className="absolute w-44 h-44 flex items-center justify-center rounded-full bg-zinc-300/50 dark:bg-zinc-700/50 border border-zinc-400/40 dark:border-zinc-600/40">
                <div className="absolute w-28 h-28 flex items-center justify-center rounded-full bg-blue-500/15 dark:bg-blue-500/25 border-2 border-blue-500/35 text-center">
                  <div className="p-1">
                    <p className="text-[9px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">SOM</p>
                    <p className="text-[10px] font-black text-blue-700 dark:text-blue-300">{canvasData.marketSizing?.som || 'N/A'}</p>
                  </div>
                </div>
                <div className="absolute top-2 text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">SAM</div>
              </div>
              <div className="absolute top-3 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">TAM</div>
            </div>
          </div>
        </div>

        {/* Market Trends and Research */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 text-xs leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-widest text-zinc-400 text-[10px]">Market Trends</h3>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{canvasData.businessPlan?.marketTrends || 'Not detailed.'}</p>
            {canvasData.businessPlan?.marketTrendsResearch && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl mt-2">
                <span className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 block mb-1">Trends Research Source</span>
                <p className="text-zinc-600 dark:text-zinc-400 italic">"{canvasData.businessPlan.marketTrendsResearch}"</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-widest text-zinc-400 text-[10px]">Customer Groups & Demand</h3>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{canvasData.businessPlan?.customerGroups || 'Not detailed.'}</p>
            {canvasData.businessPlan?.customerDemands && (
              <p className="mt-1"><span className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 mr-1">Target demands:</span>{canvasData.businessPlan.customerDemands}</p>
            )}
            {canvasData.businessPlan?.customerResearch && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl mt-2">
                <span className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 block mb-1">Customer Demands Evidence</span>
                <p className="text-zinc-600 dark:text-zinc-400 italic">"{canvasData.businessPlan.customerResearch}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* report-page-9: Competitor Matrix & Pricing Strategy */}
      <div id="report-page-9" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">9. Competitor Analysis & Pricing</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Competitive Landscape & Advantage Formulation</p>
        </div>

        {/* Competitor Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Competitors Matrix</h3>
          {(!canvasData.businessPlan?.competitors || canvasData.businessPlan.competitors.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No competitors logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3 w-1/4">Competitor Name</th>
                    <th className="p-3 w-3/8">Strengths</th>
                    <th className="p-3 w-3/8">Weaknesses</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.competitors.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{item.name}</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{item.strengths}</td>
                      <td className="p-3 text-red-500 dark:text-red-400 whitespace-pre-wrap">{item.weaknesses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pricing Strategy Grid */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Pricing Comparison Analysis</h3>
          {(!canvasData.businessPlan?.competitorPricing || canvasData.businessPlan.competitorPricing.length === 0) ? (
            <p className="text-xs text-zinc-500 italic">No pricing comparisons logged.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider text-[10px] font-black text-zinc-500">
                    <th className="p-3">Product / Service</th>
                    <th className="p-3">Your Price</th>
                    <th className="p-3">Competitor Range</th>
                    <th className="p-3">Reason for Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {canvasData.businessPlan.competitorPricing.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                      <td className="p-3 font-bold text-zinc-800 dark:text-zinc-200">{item.productService}</td>
                      <td className="p-3 text-zinc-800 dark:text-zinc-200 font-bold">{item.yourPrice}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400">{item.competitorPriceRange}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{item.differenceReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Qualitative Competitive Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 text-xs leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-black uppercase tracking-widest text-zinc-400 text-[10px]">Competitor Gathering Strategy</h4>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{canvasData.businessPlan?.gatheredCompetitorInfo || 'Not detailed.'}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-black uppercase tracking-widest text-zinc-400 text-[10px]">How We Plan to Outperform</h4>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{canvasData.businessPlan?.competitorImprovement || 'Not detailed.'}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-black uppercase tracking-widest text-zinc-400 text-[10px]">Our Competitive Advantage</h4>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{canvasData.businessPlan?.competitiveAdvantage || 'Not detailed.'}</p>
          </div>
        </div>
      </div>

      {/* report-page-10: Strategic Policies */}
      <div id="report-page-10" className="bg-white dark:bg-zinc-950 p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8 min-h-[1400px]">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">10. Strategic Policies</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Fair Work, Inclusion & Environmental Sustainability Policies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
          <div className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Fair Work & Inclusion Policy</h3>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {canvasData.businessPlan?.fairWorkPractices || 'No policy configured.'}
            </p>
          </div>
          <div className="p-6 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Sustainability & Environmental Policy</h3>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {canvasData.businessPlan?.sustainabilityPolicy || 'No policy configured.'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-20 text-center border-t border-zinc-100 dark:border-zinc-800 mt-20">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Kettle Strat • Internal Document</p>
      </div>
    </div>
  );
};
