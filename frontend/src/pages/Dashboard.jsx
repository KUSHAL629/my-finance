import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

import SummaryCards from '../components/dashboard/SummaryCards';
import QuickActions from '../components/dashboard/QuickActions';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import InvestmentTrendChart from '../components/dashboard/InvestmentTrendChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

import ExpenseModal from '../components/expenses/ExpenseModal';
import IncomeModal from '../components/income/IncomeModal';
import InvestmentModal from '../components/investments/InvestmentModal';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [summary, setSummary] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Modals state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async (year) => {
    try {
      setLoading(true);
      const [sumRes, chartRes] = await Promise.all([
        api.dashboard.getSummary(),
        api.dashboard.getCharts(year || selectedYear),
      ]);
      setSummary(sumRes.summary);
      setChartsData({
        availableYears: chartRes.availableYears,
        monthlyComparison: chartRes.monthlyComparison,
        categoryBreakdown: chartRes.categoryBreakdown,
        investmentAllocation: chartRes.investmentAllocation,
        recentTransactions: sumRes.recentTransactions,
      });
    } catch (err) {
      toast.error('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, toast]);

  useEffect(() => {
    fetchDashboardData(selectedYear);

    const handleDataUpdate = () => {
      fetchDashboardData(selectedYear);
    };

    window.addEventListener('finance:data-updated', handleDataUpdate);
    return () => window.removeEventListener('finance:data-updated', handleDataUpdate);
  }, [fetchDashboardData, selectedYear]);

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    fetchDashboardData(newYear);
  };

  // Quick Action Handlers
  const handleSaveExpense = async (data) => {
    try {
      setModalLoading(true);
      await api.expenses.create(data);
      toast.success('Expense recorded successfully!');
      setExpenseModalOpen(false);
      fetchDashboardData(selectedYear);
    } catch (err) {
      toast.error('Failed to save expense: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveIncome = async (data) => {
    try {
      setModalLoading(true);
      await api.income.create(data);
      toast.success('Income recorded successfully!');
      setIncomeModalOpen(false);
      fetchDashboardData(selectedYear);
    } catch (err) {
      toast.error('Failed to save income: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveInvestment = async (data) => {
    try {
      setModalLoading(true);
      await api.investments.create(data);
      toast.success('Investment added successfully!');
      setInvestmentModalOpen(false);
      fetchDashboardData(selectedYear);
    } catch (err) {
      toast.error('Failed to save investment: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Investor'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your live wealth overview, active investments, and monthly cash flow.
          </p>
        </div>

        <QuickActions
          onAddExpense={() => setExpenseModalOpen(true)}
          onAddIncome={() => setIncomeModalOpen(true)}
          onAddInvestment={() => setInvestmentModalOpen(true)}
        />
      </div>

      {/* Top 4 Summary Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Main Income vs Expenses vs Savings Bar Chart */}
      <IncomeExpenseChart
        data={chartsData?.monthlyComparison || []}
        availableYears={chartsData?.availableYears || [selectedYear]}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      {/* Dual Charts Grid: Categories & Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart
          categoryBreakdown={chartsData?.categoryBreakdown || []}
        />
        <InvestmentTrendChart
          allocation={chartsData?.investmentAllocation || []}
        />
      </div>

      {/* Recent Activity Table */}
      <RecentTransactions
        transactions={chartsData?.recentTransactions || []}
        onAddExpense={() => setExpenseModalOpen(true)}
        onAddIncome={() => setIncomeModalOpen(true)}
      />

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        isLoading={modalLoading}
      />

      <IncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSave={handleSaveIncome}
        isLoading={modalLoading}
      />

      <InvestmentModal
        isOpen={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
        onSave={handleSaveInvestment}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;
