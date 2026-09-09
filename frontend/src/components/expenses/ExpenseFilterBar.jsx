import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';

const ExpenseFilterBar = ({
  filters,
  setFilters,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description or notes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value, page: 1 })}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
          >
            <option value="All">All Payments</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
