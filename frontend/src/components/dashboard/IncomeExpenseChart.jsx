import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const CustomTooltip = ({ active, payload, label, format }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs z-50">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const IncomeExpenseChart = ({
  data = [],
  availableYears = [],
  selectedYear,
  onYearChange,
}) => {
  const { format } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Income vs Expenses vs Savings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Month-by-month cash flow and net savings comparison
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedYear === year
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => {
                if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                return val;
              }}
            />
            <Tooltip content={<CustomTooltip format={format} />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#F43F5E"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="savings"
              name="Savings"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
