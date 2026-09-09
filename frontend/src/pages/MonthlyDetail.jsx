import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/formatters';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import ExpenseModal from '../components/expenses/ExpenseModal';
import IncomeModal from '../components/income/IncomeModal';

const MonthlyDetail = () => {
  const { year, month } = useParams();
  const toast = useToast();
  const { format } = useCurrency();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  const loadMonthDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.monthly.getDetail(year, month);
      setData(res);
    } catch (err) {
      toast.error('Failed to load month details: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    loadMonthDetail();
  }, [loadMonthDetail]);

  const handleSaveExpense = async (formData) => {
    try {
      await api.expenses.create(formData);
      toast.success('Expense added to ' + data?.monthName);
      setExpenseModalOpen(false);
      loadMonthDetail();
    } catch (err) {
      toast.error('Failed to add expense: ' + err.message);
    }
  };

  const handleSaveIncome = async (formData) => {
    try {
      await api.income.create(formData);
      toast.success('Income added to ' + data?.monthName);
      setIncomeModalOpen(false);
      loadMonthDetail();
    } catch (err) {
      toast.error('Failed to add income: ' + err.message);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const { summary, categoryBreakdown, transactions, monthName } = data;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/monthly"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Months</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {monthName} Financial Overview
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>
          <button
            onClick={() => setIncomeModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Income</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Income</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {format(summary.totalIncome)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Expenses</span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {format(summary.totalExpenses)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Net Savings</span>
          <span className={`text-lg sm:text-xl font-bold mt-1 block ${summary.totalSavings >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {format(summary.totalSavings)}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Savings Rate</span>
          <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
            {summary.savingsRate}%
          </span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Investments Logged</span>
          <span className="text-lg sm:text-xl font-bold text-violet-600 dark:text-violet-400 mt-1 block">
            {format(summary.totalInvestments)}
          </span>
        </div>
      </div>

      {/* Category Breakdown & Progress bars */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Expense Category Breakdown
        </h3>
        {categoryBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400">No expenses recorded for this month.</p>
        ) : (
          <div className="space-y-3.5">
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-slate-900 dark:text-white">
                    {format(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History for the Month */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Transaction History ({transactions.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-4 sm:px-6">Type</th>
                <th className="py-3 px-4 sm:px-6">Description</th>
                <th className="py-3 px-4 sm:px-6">Category</th>
                <th className="py-3 px-4 sm:px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        tx.type === 'Income'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : tx.type === 'Expense'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          : 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800 dark:text-slate-200">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-400">{tx.category}</td>
                  <td
                    className={`py-3.5 px-4 sm:px-6 text-right font-bold whitespace-nowrap ${
                      tx.type === 'Income' ? 'text-emerald-600' : tx.type === 'Expense' ? 'text-rose-600' : 'text-violet-600'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}
                    {format(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />
      <IncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSave={handleSaveIncome}
      />
    </div>
  );
};

export default MonthlyDetail;
