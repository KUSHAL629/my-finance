import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  PieChart as PieIcon,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../utils/formatters';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import InvestmentTrendChart from '../components/dashboard/InvestmentTrendChart';

const Reports = () => {
  const toast = useToast();
  const { format, currency } = useCurrency();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const res = await api.dashboard.getCharts(selectedYear);
        setChartsData(res);
      } catch (err) {
        toast.error('Failed to load reports: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [selectedYear, toast]);

  // Export Expenses to CSV
  const handleExportExpensesCSV = async () => {
    try {
      toast.info('Generating Expenses CSV...');
      const res = await api.expenses.getAll({ limit: 1000 });
      if (!res.expenses || res.expenses.length === 0) {
        toast.error('No expense records available to export');
        return;
      }

      const headers = ['Date', 'Category', 'Description', 'Amount', 'Payment Method', 'Type', 'Notes'];
      const rows = res.expenses.map((e) => [
        formatDate(e.date),
        `"${e.category}"`,
        `"${e.description.replace(/"/g, '""')}"`,
        e.amount,
        `"${e.paymentMethod}"`,
        `"${e.type}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Expenses CSV exported successfully!');
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    }
  };

  // Export Investments to CSV
  const handleExportInvestmentsCSV = async () => {
    try {
      toast.info('Generating Investments CSV...');
      const res = await api.investments.getAll({ limit: 1000 });
      if (!res.investments || res.investments.length === 0) {
        toast.error('No investment records available to export');
        return;
      }

      const headers = [
        'Asset Name',
        'Asset Type',
        'Platform',
        'Invested Amount',
        'Current Value',
        'Profit / Loss',
        'Return %',
        'Purchase Date',
        'Quantity',
        'Notes',
      ];
      const rows = res.investments.map((inv) => {
        const pL = inv.currentValue - inv.investedAmount;
        const retPct = inv.investedAmount > 0 ? ((pL / inv.investedAmount) * 100).toFixed(2) : 0;
        return [
          `"${inv.name.replace(/"/g, '""')}"`,
          `"${inv.type}"`,
          `"${inv.platform}"`,
          inv.investedAmount,
          inv.currentValue,
          pL,
          retPct,
          formatDate(inv.purchaseDate),
          inv.quantity,
          `"${(inv.notes || '').replace(/"/g, '""')}"`,
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `investments_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Investments CSV exported successfully!');
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into long-term savings rates, asset performance, and export spreadsheets
          </p>
        </div>

        {/* CSV Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportExpensesCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Expenses CSV</span>
          </button>
          <button
            onClick={handleExportInvestmentsCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Portfolio CSV</span>
          </button>
        </div>
      </div>

      {/* Main Income vs Expense Bar Chart */}
      <IncomeExpenseChart
        data={chartsData?.monthlyComparison || []}
        availableYears={chartsData?.availableYears || [selectedYear]}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* Breakdown Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart
          categoryBreakdown={chartsData?.categoryBreakdown || []}
        />
        <InvestmentTrendChart
          allocation={chartsData?.investmentAllocation || []}
        />
      </div>
    </div>
  );
};

export default Reports;
