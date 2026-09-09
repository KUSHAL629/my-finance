import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const ASSET_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
];

const InvestmentTrendChart = ({ allocation = [] }) => {
  const navigate = useNavigate();
  const { format } = useCurrency();

  const totalValue = allocation.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Portfolio Allocation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Asset distribution across categories
          </p>
        </div>
        <button
          onClick={() => navigate('/investments')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Portfolio →
        </button>
      </div>

      {allocation.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-slate-400">No active investments in your portfolio.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-56 w-full md:w-1/2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [
                    `${format(value)} (${((value / (totalValue || 1)) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {allocation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ASSET_COLORS[index % ASSET_COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] text-slate-400">Portfolio</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {format(totalValue)}
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {allocation.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ASSET_COLORS[idx % ASSET_COLORS.length] }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {format(item.value)}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 w-9 text-right font-medium">
                    {((item.value / (totalValue || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentTrendChart;
