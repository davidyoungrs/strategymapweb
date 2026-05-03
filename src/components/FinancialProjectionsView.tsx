import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart,
  ArrowLeft,
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import { CanvasData, FinancialYear } from '../types';
import { motion } from 'framer-motion';

interface FinancialProjectionsViewProps {
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  onBack: () => void;
}

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 italic tracking-tighter">{value}</p>
  </div>
);

export const FinancialProjectionsView: React.FC<FinancialProjectionsViewProps> = ({
  canvasData,
  setCanvasData,
  onBack
}) => {
  const financials = canvasData.financials || {
    years: [
      { year: 1, revenue: 0, cogs: 0, operatingExpenses: 0 },
      { year: 2, revenue: 0, cogs: 0, operatingExpenses: 0 },
      { year: 3, revenue: 0, cogs: 0, operatingExpenses: 0 },
    ]
  };

  const updateYear = (yearNum: number, field: keyof FinancialYear, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCanvasData(prev => ({
      ...prev,
      financials: {
        years: (prev.financials?.years || []).map(y => 
          y.year === yearNum ? { ...y, [field]: numValue } : y
        )
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

  const totalRevenue = financials.years.reduce((acc, y) => acc + y.revenue, 0);
  const totalProfit = financials.years.reduce((acc, y) => acc + (y.revenue - y.cogs - y.operatingExpenses), 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase italic">Financial Projections</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">3-Year Strategic Forecast</p>
        </div>
      </div>

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

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Projection Period</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Revenue ($)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">COGS ($)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">OpEx ($)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {financials.years.map((y) => {
                const grossProfit = y.revenue - y.cogs;
                const netProfit = grossProfit - y.operatingExpenses;
                const margin = y.revenue > 0 ? (netProfit / y.revenue) * 100 : 0;

                return (
                  <tr key={y.year} className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-900 dark:text-zinc-100">
                          Y{y.year}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-50">Year {y.year}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Projection</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <input
                        type="number"
                        value={y.revenue || ''}
                        onChange={(e) => updateYear(y.year, 'revenue', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 ring-blue-500/20"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-8 py-8">
                      <input
                        type="number"
                        value={y.cogs || ''}
                        onChange={(e) => updateYear(y.year, 'cogs', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 ring-blue-500/20"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-8 py-8">
                      <input
                        type="number"
                        value={y.operatingExpenses || ''}
                        onChange={(e) => updateYear(y.year, 'operatingExpenses', e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 ring-blue-500/20"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-8 py-8 text-right">
                      <p className={`text-sm font-black italic tracking-tight ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {formatCurrency(netProfit)}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {margin.toFixed(1)}% Margin
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-3xl p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight italic">Financial Logic</h4>
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed max-w-2xl font-medium">
              These projections are key for investor readiness. Ensure your revenue growth correlates with the **Market Sizing (SAM/SOM)** you defined earlier. The **AI Strategist** can help sanity-check these margins against industry averages.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
