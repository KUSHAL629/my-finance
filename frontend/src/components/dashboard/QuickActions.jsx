import React from 'react';
import { Plus, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const QuickActions = ({ onAddExpense, onAddInvestment, onAddIncome }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onAddExpense}
        className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
      >
        <ArrowDownLeft className="w-4 h-4" />
        <span>+ Add Expense</span>
      </button>

      <button
        onClick={onAddIncome}
        className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
      >
        <ArrowUpRight className="w-4 h-4" />
        <span>+ Add Income</span>
      </button>

      <button
        onClick={onAddInvestment}
        className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
      >
        <TrendingUp className="w-4 h-4" />
        <span>+ Add Investment</span>
      </button>
    </div>
  );
};

export default QuickActions;
