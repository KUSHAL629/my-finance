import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  AlertOctagon,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const InvestmentCards = ({ summary }) => {
  const { format } = useCurrency();

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Invested */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Total Invested Capital
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {format(summary.totalInvested)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">Across {summary.totalAssetsCount} active assets</p>
      </div>

      {/* Current Portfolio Value */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Current Portfolio Value
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {format(summary.currentPortfolioValue)}
            </h3>
          </div>
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              summary.netProfitLoss >= 0
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
            }`}
          >
            {summary.netProfitLoss >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{summary.overallReturnPercentage >= 0 ? '+' : ''}{summary.overallReturnPercentage}%</span>
          </span>
        </div>
        <div className="mt-2 text-xs flex space-x-2">
          <span className="text-slate-400">Net Return:</span>
          <span
            className={`font-semibold ${
              summary.netProfitLoss >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {summary.netProfitLoss >= 0 ? '+' : ''}
            {format(summary.netProfitLoss)}
          </span>
        </div>
      </div>

      {/* Best Performing Asset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
          <Award className="w-4 h-4" />
          <p className="text-xs font-semibold">Top Performing Asset</p>
        </div>
        {summary.bestPerforming ? (
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {summary.bestPerforming.name}
            </h4>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-400">{summary.bestPerforming.type}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{summary.bestPerforming.returnPercentage}% ({format(summary.bestPerforming.profitLoss)})
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-2">No investments recorded yet</p>
        )}
      </div>

      {/* Worst Performing Asset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
          <AlertOctagon className="w-4 h-4" />
          <p className="text-xs font-semibold">Asset Under Watch</p>
        </div>
        {summary.worstPerforming ? (
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {summary.worstPerforming.name}
            </h4>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-400">{summary.worstPerforming.type}</span>
              <span
                className={`font-bold ${
                  summary.worstPerforming.returnPercentage >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {summary.worstPerforming.returnPercentage >= 0 ? '+' : ''}
                {summary.worstPerforming.returnPercentage}%
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-2">No investments recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default InvestmentCards;
