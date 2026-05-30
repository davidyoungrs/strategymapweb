import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart,
  ArrowLeft,
  Calculator,
  ArrowUpRight,
  Shield,
  Layers,
  PiggyBank,
  Briefcase,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { CanvasData, FinancialYear, StartupCosts, PersonalBudget, SourcingFinance } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FinancialProjectionsViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{label}</span>
    </div>
    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 italic tracking-tighter">{value}</p>
  </div>
);

type ActiveTab = 'pl' | 'startup' | 'survival' | 'sourcing';

export const FinancialProjectionsView: React.FC<FinancialProjectionsViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pl');

  const financials = canvasData.financials || {
    years: [
      { year: 1, revenue: 0, cogs: 0, operatingExpenses: 0 },
      { year: 2, revenue: 0, cogs: 0, operatingExpenses: 0 },
      { year: 3, revenue: 0, cogs: 0, operatingExpenses: 0 },
    ]
  };

  const defaultStartupCosts: StartupCosts = {
    itComputers: 0,
    stock: 0,
    tools: 0,
    professionalFees: 0,
    insurance: 0,
    rentDeposit: 0,
    licenses: 0,
    wagesRecruitment: 0,
    other: 0
  };

  const defaultPersonalBudget: PersonalBudget = {
    mortgageRent: 0,
    utilities: 0,
    food: 0,
    taxes: 0,
    otherExpenditure: 0,
    personalIncome: 0
  };

  const defaultSourcingFinance: SourcingFinance = {
    borrowingRequirements: 0,
    startupContributions: 0,
    assetsSecurity: ''
  };

  const startupCosts = financials.startupCosts || defaultStartupCosts;
  const personalBudget = financials.personalBudget || defaultPersonalBudget;
  const sourcingFinance = financials.sourcingFinance || defaultSourcingFinance;

  const updateYearField = (yearNum: number, field: keyof FinancialYear, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCanvasData(prev => {
      const currentFinancials = prev.financials || { years: [] };
      const updatedYears = (currentFinancials.years || []).map(y => {
        if (y.year === yearNum) {
          const updatedYear = { ...y, [field]: numValue };
          
          // Re-calculate opex if detailed subfields are modified
          if ([
            'salaries', 
            'rent', 
            'bankingCharges', 
            'insurances', 
            'depreciation', 
            'otherOpEx'
          ].includes(field as string)) {
            const salaries = field === 'salaries' ? numValue : (y.salaries || 0);
            const rent = field === 'rent' ? numValue : (y.rent || 0);
            const bankingCharges = field === 'bankingCharges' ? numValue : (y.bankingCharges || 0);
            const insurances = field === 'insurances' ? numValue : (y.insurances || 0);
            const depreciation = field === 'depreciation' ? numValue : (y.depreciation || 0);
            const otherOpEx = field === 'otherOpEx' ? numValue : (y.otherOpEx || 0);
            
            updatedYear.operatingExpenses = salaries + rent + bankingCharges + insurances + depreciation + otherOpEx;
          }
          return updatedYear;
        }
        return y;
      });

      return {
        ...prev,
        financials: {
          ...currentFinancials,
          years: updatedYears
        }
      };
    });
  };

  const updateStartupCosts = (field: keyof StartupCosts, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCanvasData(prev => ({
      ...prev,
      financials: {
        ...(prev.financials || { years: [] }),
        startupCosts: {
          ...(prev.financials?.startupCosts || defaultStartupCosts),
          [field]: numValue
        }
      }
    }));
  };

  const updatePersonalBudget = (field: keyof PersonalBudget, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCanvasData(prev => ({
      ...prev,
      financials: {
        ...(prev.financials || { years: [] }),
        personalBudget: {
          ...(prev.financials?.personalBudget || defaultPersonalBudget),
          [field]: numValue
        }
      }
    }));
  };

  const updateSourcingFinance = (field: keyof SourcingFinance, value: any) => {
    const finalVal = field === 'assetsSecurity' ? value : (parseFloat(value) || 0);
    setCanvasData(prev => ({
      ...prev,
      financials: {
        ...(prev.financials || { years: [] }),
        sourcingFinance: {
          ...(prev.financials?.sourcingFinance || defaultSourcingFinance),
          [field]: finalVal
        }
      }
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calculations
  const totalRevenue = financials.years.reduce((acc, y) => acc + y.revenue, 0);
  const totalProfit = financials.years.reduce((acc, y) => acc + (y.revenue - y.cogs - y.operatingExpenses), 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Startup cost total
  const totalStartupCosts = Object.keys(startupCosts).reduce((acc, key) => {
    if (key === 'id') return acc;
    return acc + (startupCosts[key as keyof StartupCosts] || 0);
  }, 0);

  // Personal Budget totals
  const totalPersonalOutgoings = 
    (personalBudget.mortgageRent || 0) +
    (personalBudget.utilities || 0) +
    (personalBudget.food || 0) +
    (personalBudget.taxes || 0) +
    (personalBudget.otherExpenditure || 0);
  const totalPersonalIncome = personalBudget.personalIncome || 0;
  const personalNetSurplus = totalPersonalIncome - totalPersonalOutgoings;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Financial Projections</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Strategic Financial Planning & Modeling</p>
        </div>
      </div>

      {/* Pill Sub-Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl w-fit border border-zinc-200/50 dark:border-zinc-800/30">
        <button
          onClick={() => setActiveTab('pl')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'pl' 
              ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/40' 
              : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          P&L Projections
        </button>
        <button
          onClick={() => setActiveTab('startup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'startup' 
              ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/40' 
              : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Start-up Costs
        </button>
        <button
          onClick={() => setActiveTab('survival')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'survival' 
              ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/40' 
              : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          Survival Budget
        </button>
        <button
          onClick={() => setActiveTab('sourcing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'sourcing' 
              ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/40' 
              : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Sourcing of Finance
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: P&L */}
          {activeTab === 'pl' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  label="Total Projected Revenue" 
                  value={formatCurrency(totalRevenue)} 
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="bg-blue-600"
                />
                <StatCard 
                  label="Cumulative Net Profit" 
                  value={formatCurrency(totalProfit)} 
                  icon={<DollarSign className="w-4 h-4" />}
                  color="bg-emerald-600"
                />
                <StatCard 
                  label="Average Net Margin" 
                  value={`${avgMargin.toFixed(1)}%`} 
                  icon={<PieChart className="w-4 h-4" />}
                  color="bg-violet-600"
                />
              </div>

              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-72 border-r border-zinc-150 dark:border-zinc-800">Financial Item</th>
                        {financials.years.map(y => (
                          <th key={y.year} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 text-center bg-zinc-50/20 dark:bg-zinc-900/20">
                            Year {y.year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {/* REVENUE */}
                      <tr className="bg-zinc-50/20 dark:bg-zinc-900/10">
                        <td className="px-8 py-3.5 border-r border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Revenue Stream</span>
                        </td>
                        {financials.years.map(y => <td key={y.year} className="px-8 py-3.5 bg-zinc-50/5 dark:bg-zinc-900/5"></td>)}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-5 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">Total Revenue</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Core Inflows</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-5">
                            <input
                              type="number"
                              value={y.revenue || ''}
                              onChange={(e) => updateYearField(y.year, 'revenue', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>

                      {/* DIRECT COSTS */}
                      <tr className="bg-zinc-50/20 dark:bg-zinc-900/10">
                        <td className="px-8 py-3.5 border-r border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Direct Cost breakdown</span>
                        </td>
                        {financials.years.map(y => <td key={y.year} className="px-8 py-3.5 bg-zinc-50/5 dark:bg-zinc-900/5"></td>)}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-5 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">Cost of Goods Sold (COGS)</p>
                          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">Total Direct Overhead</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-5">
                            <input
                              type="number"
                              value={y.cogs || ''}
                              onChange={(e) => updateYearField(y.year, 'cogs', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Stock / Materials Cost</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Inventory purchases</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.stock || ''}
                              onChange={(e) => updateYearField(y.year, 'stock', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>

                      {/* GROSS PROFIT */}
                      <tr className="bg-zinc-900 dark:bg-zinc-55 hover:bg-zinc-850 dark:hover:bg-zinc-100 transition-colors">
                        <td className="px-8 py-4 border-r border-zinc-800 dark:border-zinc-200">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Gross Profit</span>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4 text-center">
                            <p className="text-sm font-black italic text-white dark:text-zinc-900">
                              {formatCurrency(y.revenue - y.cogs)}
                            </p>
                          </td>
                        ))}
                      </tr>

                      {/* OPERATING EXPENSES */}
                      <tr className="bg-zinc-50/20 dark:bg-zinc-900/10">
                        <td className="px-8 py-3.5 border-r border-zinc-100 dark:border-zinc-800">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Operating Expenses Split</span>
                        </td>
                        {financials.years.map(y => <td key={y.year} className="px-8 py-3.5 bg-zinc-50/5 dark:bg-zinc-900/5"></td>)}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Salaries & Wages</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Staff & Directors cost</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.salaries || ''}
                              onChange={(e) => updateYearField(y.year, 'salaries', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Rent & Premises</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Office / Retail leasing</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.rent || ''}
                              onChange={(e) => updateYearField(y.year, 'rent', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Banking Charges</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Transaction fees, interest</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.bankingCharges || ''}
                              onChange={(e) => updateYearField(y.year, 'bankingCharges', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Insurances</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Commercial & public liability</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.insurances || ''}
                              onChange={(e) => updateYearField(y.year, 'insurances', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Depreciation</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Asset value reductions</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.depreciation || ''}
                              onChange={(e) => updateYearField(y.year, 'depreciation', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="group transition-colors">
                        <td className="px-8 py-4 pl-12 border-r border-zinc-150 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Other Overheads</p>
                          <p className="text-[9px] font-semibold text-zinc-400 uppercase">Utilities, legal, marketing, etc.</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-4">
                            <input
                              type="number"
                              value={y.otherOpEx || ''}
                              onChange={(e) => updateYearField(y.year, 'otherOpEx', e.target.value)}
                              className="w-full bg-zinc-50/60 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:ring-1 ring-blue-500/20 text-center"
                              placeholder="0"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-zinc-50 dark:bg-zinc-900/60 transition-colors">
                        <td className="px-8 py-5 border-r border-zinc-150 dark:border-zinc-800 font-bold">
                          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">Total Operating Expenses (OpEx)</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Sum of Overheads</p>
                        </td>
                        {financials.years.map(y => (
                          <td key={y.year} className="px-8 py-5 text-center font-bold">
                            <p className="text-sm text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(y.operatingExpenses)}
                            </p>
                          </td>
                        ))}
                      </tr>

                      {/* NET PROFIT */}
                      <tr className="bg-emerald-600 dark:bg-emerald-500">
                        <td className="px-8 py-5 border-r border-emerald-700 dark:border-emerald-400 shadow-inner">
                          <p className="text-sm font-black uppercase italic tracking-tighter text-white">Net Profit (EBITDA)</p>
                          <p className="text-[10px] font-bold text-emerald-200 dark:text-emerald-900 uppercase tracking-widest">Bottom Line</p>
                        </td>
                        {financials.years.map(y => {
                          const netProfit = y.revenue - y.cogs - y.operatingExpenses;
                          const margin = y.revenue > 0 ? (netProfit / y.revenue) * 100 : 0;
                          return (
                            <td key={y.year} className="px-8 py-5 text-center border-l border-emerald-500/20">
                              <p className="text-lg font-black italic text-white tracking-tighter">
                                {formatCurrency(netProfit)}
                              </p>
                              <p className="text-[10px] font-black text-emerald-100 dark:text-emerald-900 uppercase tracking-widest mt-0.5">
                                {margin.toFixed(1)}% Margin
                              </p>
                            </td>
                          );
                        })}
                      </tr>

                      {/* BREAKEVEN FORECAST */}
                      <tr className="bg-blue-50 dark:bg-blue-950/40">
                        <td className="px-8 py-5 border-r border-blue-100 dark:border-blue-900/40">
                          <p className="text-sm font-black uppercase text-blue-800 dark:text-blue-300">Breakeven Forecast</p>
                          <p className="text-[9px] font-bold text-blue-500 dark:text-blue-500 uppercase tracking-tight">Required Breakeven Revenue</p>
                        </td>
                        {financials.years.map(y => {
                          const grossProfit = y.revenue - y.cogs;
                          const grossMarginRatio = y.revenue > 0 ? grossProfit / y.revenue : 0;
                          const breakevenRevenue = grossMarginRatio > 0 ? y.operatingExpenses / grossMarginRatio : 0;
                          
                          return (
                            <td key={y.year} className="px-8 py-5 text-center border-l border-blue-500/10">
                              {breakevenRevenue > 0 ? (
                                <>
                                  <p className="text-sm font-black text-blue-900 dark:text-blue-100">
                                    {formatCurrency(breakevenRevenue)}
                                  </p>
                                  <p className="text-[9px] font-semibold text-blue-500 dark:text-blue-400 uppercase mt-0.5">
                                    ({((breakevenRevenue / y.revenue) * 100).toFixed(0)}% of Projected Rev)
                                  </p>
                                </>
                              ) : (
                                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                  N/A (No Margin)
                                </p>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850 rounded-3xl p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight italic">Detailed P&L Structure</h4>
                    <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-1 leading-relaxed max-w-3xl">
                      Splitting out operating expenses like **salaries, rent, utilities, and depreciation** ensures bank and investor readiness. The calculated **Breakeven Forecast** details the critical sales threshold needed to cover your fixed and variable operational cost overheads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: START-UP COSTS */}
          {activeTab === 'startup' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-150 dark:border-zinc-850 p-8 rounded-3xl shadow-sm backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200">Pre-Trading Start-up Expenses</h3>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Capital required before opening date</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl text-right">
                    <p className="text-[9px] font-black uppercase tracking-wider text-blue-500">Total Start-up Outlay</p>
                    <p className="text-xl font-black text-blue-700 dark:text-blue-400 italic mt-0.5">{formatCurrency(totalStartupCosts)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">IT & Computers</label>
                    <input 
                      type="number"
                      value={startupCosts.itComputers || ''}
                      onChange={(e) => updateStartupCosts('itComputers', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Initial Stock</label>
                    <input 
                      type="number"
                      value={startupCosts.stock || ''}
                      onChange={(e) => updateStartupCosts('stock', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 12000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Tools & Machinery</label>
                    <input 
                      type="number"
                      value={startupCosts.tools || ''}
                      onChange={(e) => updateStartupCosts('tools', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 3500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Professional Fees (Legal/Accountant)</label>
                    <input 
                      type="number"
                      value={startupCosts.professionalFees || ''}
                      onChange={(e) => updateStartupCosts('professionalFees', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 1500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Insurance Setup</label>
                    <input 
                      type="number"
                      value={startupCosts.insurance || ''}
                      onChange={(e) => updateStartupCosts('insurance', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Rent & Premises Deposit</label>
                    <input 
                      type="number"
                      value={startupCosts.rentDeposit || ''}
                      onChange={(e) => updateStartupCosts('rentDeposit', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 6000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Licenses & Permits</label>
                    <input 
                      type="number"
                      value={startupCosts.licenses || ''}
                      onChange={(e) => updateStartupCosts('licenses', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 1200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pre-trade Wages & Recruitment</label>
                    <input 
                      type="number"
                      value={startupCosts.wagesRecruitment || ''}
                      onChange={(e) => updateStartupCosts('wagesRecruitment', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 4500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Other Costs</label>
                    <input 
                      type="number"
                      value={startupCosts.other || ''}
                      onChange={(e) => updateStartupCosts('other', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERSONAL SURVIVAL BUDGET */}
          {activeTab === 'survival' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-150 dark:border-zinc-850 p-8 rounded-3xl shadow-sm backdrop-blur-xl space-y-8">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200">Personal Survival Budget</h3>
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Ensure the founders can survive during early stage growth</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Monthly Outgoings */}
                  <div className="p-6 border border-zinc-100 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-500">Monthly Personal Outgoings</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Mortgage or Rent</label>
                        <input 
                          type="number"
                          value={personalBudget.mortgageRent || ''}
                          onChange={(e) => updatePersonalBudget('mortgageRent', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 1500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Utilities & Broadband</label>
                        <input 
                          type="number"
                          value={personalBudget.utilities || ''}
                          onChange={(e) => updatePersonalBudget('utilities', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 350"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Food & Household Groceries</label>
                        <input 
                          type="number"
                          value={personalBudget.food || ''}
                          onChange={(e) => updatePersonalBudget('food', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Personal Taxes (Council tax, etc.)</label>
                        <input 
                          type="number"
                          value={personalBudget.taxes || ''}
                          onChange={(e) => updatePersonalBudget('taxes', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Other Personal Expenditure</label>
                        <input 
                          type="number"
                          value={personalBudget.otherExpenditure || ''}
                          onChange={(e) => updatePersonalBudget('otherExpenditure', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Income Sources */}
                  <div className="flex flex-col justify-between p-6 border border-zinc-100 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-2xl space-y-4">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500">Monthly Income Sources</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Non-Business Income (Partner/Other)</label>
                        <input 
                          type="number"
                          value={personalBudget.personalIncome || ''}
                          onChange={(e) => updatePersonalBudget('personalIncome', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          placeholder="e.g. 2500"
                        />
                      </div>
                    </div>

                    {/* Live Balance Summary */}
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-2xl space-y-2 mt-4 md:mt-0">
                      <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                        <span>Total Income:</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{formatCurrency(totalPersonalIncome)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                        <span>Total Outgoings:</span>
                        <span className="text-zinc-800 dark:text-zinc-200">{formatCurrency(totalPersonalOutgoings)}</span>
                      </div>
                      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Net Surplus / Deficit:</span>
                        <span className={`text-sm font-black italic ${personalNetSurplus >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {formatCurrency(personalNetSurplus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOURCING FINANCE */}
          {activeTab === 'sourcing' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-150 dark:border-zinc-850 p-8 rounded-3xl shadow-sm backdrop-blur-xl space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200">Sourcing of Finance</h3>
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Inflow of initial borrowings and partner investments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Borrowing Requirements (Loans)</label>
                    <input 
                      type="number"
                      value={sourcingFinance.borrowingRequirements || ''}
                      onChange={(e) => updateSourcingFinance('borrowingRequirements', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 15000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Owner / Start-up Contributions</label>
                    <input 
                      type="number"
                      value={sourcingFinance.startupContributions || ''}
                      onChange={(e) => updateSourcingFinance('startupContributions', e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
                      placeholder="e.g. 10000"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Assets Available as Security (Description)</label>
                    <textarea 
                      value={sourcingFinance.assetsSecurity || ''}
                      onChange={(e) => updateSourcingFinance('assetsSecurity', e.target.value)}
                      className="w-full h-24 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                      placeholder="Detail collateral, personal guarantees, or business equipment available as security..."
                    />
                  </div>
                </div>

                {/* Sourcing Summary Card */}
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-blue-900 dark:text-blue-100">Total Capitalization Inflow</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Sum of borrowings and cash contributions</p>
                  </div>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-400 italic">
                    {formatCurrency((sourcingFinance.borrowingRequirements || 0) + (sourcingFinance.startupContributions || 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
