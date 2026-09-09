import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp, PiggyBank, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import EmptyState from '../components/common/EmptyState';

const MonthlyRecords = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { format } = useCurrency();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        const res = await api.monthly.getAll();
        setRecords(res.records || []);
      } catch (err) {
        toast.error('Failed to load monthly records: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Monthly Financial Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Month-by-month financial health, savings rates, and cash flow archives
          </p>
        </div>
      </div>

      {records.length === 0 && !loading ? (
        <EmptyState
          icon={Calendar}
          title="No monthly records found"
          description="Record expenses and incomes to see automated monthly financial reports."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {records.map((item) => (
            <div
              key={item.key}
              onClick={() => navigate(`/monthly/${item.year}/${item.month}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {item.monthName}
                  </h3>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    item.savings >= 0
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                  }`}
                >
                  {item.savingsRate}% Saved
                </span>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 py-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Income</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {format(item.income)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Expenses</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {format(item.expenses)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Net Savings</span>
                  <span
                    className={`font-bold text-sm ${
                      item.savings >= 0
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {format(item.savings)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Investments</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">
                    {format(item.investments)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Explore Full Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthlyRecords;
