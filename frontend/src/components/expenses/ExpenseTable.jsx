import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';
import ConfirmModal from '../common/ConfirmModal';
import Modal from '../common/Modal';

const ExpenseTable = ({
  expenses = [],
  loading = false,
  onEdit,
  onDelete,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  totalCount = 0,
}) => {
  const { format } = useCurrency();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const getCategoryMeta = (categoryName) => {
    const found = EXPENSE_CATEGORIES.find(
      (c) => c.name.toLowerCase() === categoryName?.toLowerCase()
    );
    return found || { color: '#64748b', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="py-3 px-4 sm:px-6">Date</th>
              <th className="py-3 px-4 sm:px-6">Description</th>
              <th className="py-3 px-4 sm:px-6">Category</th>
              <th className="py-3 px-4 sm:px-6">Payment Method</th>
              <th className="py-3 px-4 sm:px-6 text-right">Amount</th>
              <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => {
              const catMeta = getCategoryMeta(expense.category);
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                    {formatDate(expense.date)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[200px] sm:max-w-xs">{expense.description}</span>
                      {expense.notes && (
                        <span className="text-[11px] text-slate-400 font-normal truncate max-w-[180px]">
                          {expense.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${catMeta.bg}`}
                    >
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                      {expense.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                    -{format(expense.amount)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewTarget(expense)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(expense)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing {expenses.length} of {totalCount} total entries
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget._id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deleteTarget?.description}" for ${deleteTarget ? format(deleteTarget.amount) : ''}? This cannot be undone.`}
      />

      {/* View Details Modal */}
      {viewTarget && (
        <Modal
          isOpen={!!viewTarget}
          onClose={() => setViewTarget(null)}
          title="Expense Details"
          maxWidth="max-w-md"
        >
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Amount:</span>
              <span className="font-bold text-rose-600 text-base">{format(viewTarget.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Description:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{viewTarget.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{viewTarget.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{viewTarget.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(viewTarget.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{viewTarget.type}</span>
            </div>
            {viewTarget.notes && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Notes:</span>
                <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                  {viewTarget.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpenseTable;
