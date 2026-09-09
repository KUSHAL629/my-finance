import React, { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

import InvestmentCards from '../components/investments/InvestmentCards';
import InvestmentTable from '../components/investments/InvestmentTable';
import InvestmentTrendChart from '../components/dashboard/InvestmentTrendChart';
import InvestmentModal from '../components/investments/InvestmentModal';
import TransactionModal from '../components/investments/TransactionModal';
import EmptyState from '../components/common/EmptyState';
import { INVESTMENT_TYPES } from '../utils/constants';

const Investments = () => {
  const toast = useToast();
  const { format } = useCurrency();

  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedInvestmentForTx, setSelectedInvestmentForTx] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [invRes, sumRes] = await Promise.all([
        api.investments.getAll({
          search,
          type: selectedType,
        }),
        api.investments.getPortfolioSummary(),
      ]);

      setInvestments(invRes.investments);
      setSummary(sumRes);
    } catch (err) {
      toast.error('Failed to load investments: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveInvestment = async (data) => {
    try {
      setModalLoading(true);
      if (editingInvestment) {
        await api.investments.update(editingInvestment._id, data);
        toast.success('Investment updated successfully');
      } else {
        await api.investments.create(data);
        toast.success('Investment added successfully');
      }
      setModalOpen(false);
      setEditingInvestment(null);
      loadData();
    } catch (err) {
      toast.error('Failed to save investment: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteInvestment = async (id) => {
    try {
      await api.investments.delete(id);
      toast.success('Investment and associated transactions removed');
      loadData();
    } catch (err) {
      toast.error('Failed to delete investment: ' + err.message);
    }
  };

  const handleSaveTransaction = async (data) => {
    if (!selectedInvestmentForTx) return;
    try {
      setModalLoading(true);
      await api.investments.addTransaction(selectedInvestmentForTx._id, data);
      toast.success('Investment transaction recorded');
      setTransactionModalOpen(false);
      setSelectedInvestmentForTx(null);
      loadData();
    } catch (err) {
      toast.error('Failed to record transaction: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Investment Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track Stocks, Mutual Funds, SIPs, Gold, Fixed Deposits, and Returns
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInvestment(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Investment</span>
        </button>
      </div>

      {/* Portfolio Summary Metric Cards */}
      <InvestmentCards summary={summary} />

      {/* Portfolio Allocation Chart */}
      {summary?.allocation && summary.allocation.length > 0 && (
        <div className="max-w-2xl">
          <InvestmentTrendChart allocation={summary.allocation} />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search asset name, platform, notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
        >
          <option value="All">All Asset Types</option>
          {INVESTMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Table or Empty state */}
      {investments.length === 0 && !loading ? (
        <EmptyState
          icon={TrendingUp}
          title="No investments added yet"
          description="Build long term wealth by recording your SIPs, Stocks, Mutual Funds, and Gold holdings."
          actionText="+ Add First Investment"
          onAction={() => {
            setEditingInvestment(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <InvestmentTable
          investments={investments}
          onEdit={(inv) => {
            setEditingInvestment(inv);
            setModalOpen(true);
          }}
          onDelete={handleDeleteInvestment}
          onAddTransaction={(inv) => {
            setSelectedInvestmentForTx(inv);
            setTransactionModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <InvestmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingInvestment(null);
        }}
        onSave={handleSaveInvestment}
        initialData={editingInvestment}
        isLoading={modalLoading}
      />

      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false);
          setSelectedInvestmentForTx(null);
        }}
        onSave={handleSaveTransaction}
        investment={selectedInvestmentForTx}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default Investments;
