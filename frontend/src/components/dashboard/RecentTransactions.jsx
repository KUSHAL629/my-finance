import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';

const RecentTransactions = ({ transactions = [], onAddExpense, onAddIncome }) => {
  const { format } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest financial inflows and outflows
          </p>
        </div>
        <Link
          to="/expenses"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View All Transactions →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-xs text-slate-400 mb-3">No recent transactions recorded yet.</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={onAddExpense}
              className="text-xs px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 rounded-lg font-medium"
            >
              + Expense
            </button>
            <button
              onClick={onAddIncome}
              className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-lg font-medium"
            >
              + Income
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-4 sm:px-6">Description</th>
                <th className="py-3 px-4 sm:px-6">Category / Source</th>
                <th className="py-3 px-4 sm:px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-xs">
                          {tx.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 sm:px-6 text-right font-bold whitespace-nowrap ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {format(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
