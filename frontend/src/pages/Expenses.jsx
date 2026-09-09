import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, CreditCard, Download } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

import ExpensePeriodSummary from '../components/expenses/ExpensePeriodSummary';
import ExpenseFilterBar from '../components/expenses/ExpenseFilterBar';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseModal from '../components/expenses/ExpenseModal';
import EmptyState from '../components/common/EmptyState';

const Expenses = () => {
  const toast = useToast();
  const { format } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  const [period, setPeriod] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    paymentMethod: 'All',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 15,
  });

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Sync category or search from URL if changed
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setFilters((f) => ({ ...f, category: urlCategory }));
    if (urlSearch) setFilters((f) => ({ ...f, search: urlSearch }));
  }, [searchParams]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, expRes] = await Promise.all([
        api.expenses.getSummary({ period }),
        api.expenses.getAll({
          search: filters.search,
          category: filters.category,
          paymentMethod: filters.paymentMethod,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: filters.page,
          limit: filters.limit,
        }),
      ]);

      setSummary(sumRes);
      setExpenses(expRes.expenses);
      setTotalPages(expRes.totalPages);
      setTotalCount(expRes.total);
    } catch (err) {
      toast.error('Failed to load expenses: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [period, filters, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      paymentMethod: 'All',
      sortBy: 'date',
      sortOrder: 'desc',
      page: 1,
      limit: 15,
    });
    setSearchParams({});
  };

  const handleSaveExpense = async (data) => {
    try {
      setModalLoading(true);
      if (editingExpense) {
        await api.expenses.update(editingExpense._id, data);
        toast.success('Expense updated successfully');
      } else {
        await api.expenses.create(data);
        toast.success('Expense recorded successfully');
      }
      setModalOpen(false);
      setEditingExpense(null);
      loadData();
    } catch (err) {
      toast.error('Failed to save expense: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.expenses.delete(id);
      toast.success('Expense deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete expense: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Expense Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log, categorize, and analyze your day-to-day spending
          </p>
        </div>

        <button
          onClick={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Expense</span>
        </button>
      </div>

      {/* Daily / Weekly / Monthly Period Summary Bar */}
      <ExpensePeriodSummary
        period={period}
        setPeriod={setPeriod}
        summary={summary}
        loading={loading}
      />

      {/* Filter and Search Bar */}
      <ExpenseFilterBar
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Expenses Table or Empty State */}
      {expenses.length === 0 && !loading ? (
        <EmptyState
          icon={CreditCard}
          title="No expenses recorded"
          description="Track your coffee, groceries, rent, and shopping bills to take control of your financial outflow."
          actionText="+ Add First Expense"
          onAction={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setModalOpen(true);
          }}
          onDelete={handleDeleteExpense}
          currentPage={filters.page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={(p) => setFilters({ ...filters, page: p })}
        />
      )}

      {/* Add / Edit Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default Expenses;
