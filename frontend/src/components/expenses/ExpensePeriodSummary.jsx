import React from 'react';
import {
  DollarSign,
  Receipt,
  TrendingDown,
  Award,
  Calendar,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const ExpensePeriodSummary = ({
  period,
  setPeriod,
  summary,
  loading,
}) => {
  const { format } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top Toggle Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            Spending Horizon
          </span>
        </div>

        {/* Daily / Weekly / Monthly Switch */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                period === p
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {p} View
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
        {/* Total Spent */}
        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Spent
          </p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
            {format(summary?.totalSpent || 0)}
          </p>
        </div>

        {/* Transactions */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Transactions
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {summary?.transactionCount || 0}
          </p>
        </div>

        {/* Avg Daily */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Avg Daily Spending
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {format(summary?.averageDailySpending || 0)}
          </p>
        </div>

        {/* Highest Expense */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Highest Expense
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
            {summary?.highestExpense ? format(summary.highestExpense.amount) : 'None'}
          </p>
        </div>

        {/* Most-used category */}
        <div className="col-span-2 md:col-span-1 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Top Category
          </p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
            {summary?.mostUsedCategory || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpensePeriodSummary;
