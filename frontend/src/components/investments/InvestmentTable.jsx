import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';
import ConfirmModal from '../common/ConfirmModal';

const InvestmentTable = ({
  investments = [],
  onEdit,
  onDelete,
  onAddTransaction,
}) => {
  const { format } = useCurrency();
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-medium text-[11px] uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="py-3.5 px-4 sm:px-6">Asset Name</th>
              <th className="py-3.5 px-4 sm:px-6">Type</th>
              <th className="py-3.5 px-4 sm:px-6">Platform</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Invested</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Current Value</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">P / L</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Return %</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {investments.map((inv) => {
              const pL = inv.currentValue - inv.investedAmount;
              const returnPct =
                inv.investedAmount > 0
                  ? ((pL / inv.investedAmount) * 100).toFixed(2)
                  : '0.00';
              const isProfit = pL >= 0;

              return (
                <tr
                  key={inv._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="truncate max-w-[180px] sm:max-w-xs">{inv.name}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Qty: {inv.quantity} {inv.notes ? `• ${inv.notes}` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400">
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                    {inv.platform}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {format(inv.investedAmount)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {format(inv.currentValue)}
                  </td>
                  <td
                    className={`py-3.5 px-4 sm:px-6 text-right font-semibold whitespace-nowrap ${
                      isProfit
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isProfit ? '+' : ''}
                    {format(pL)}
                  </td>
                  <td
                    className={`py-3.5 px-4 sm:px-6 text-right font-bold whitespace-nowrap ${
                      isProfit
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isProfit ? '+' : ''}
                    {returnPct}%
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1 opacity-85 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onAddTransaction(inv)}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center space-x-1"
                        title="Add Buy/Sell/SIP/Dividend"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Tx</span>
                      </button>
                      <button
                        onClick={() => onEdit(inv)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Investment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inv)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete Investment"
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget._id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Investment"
        message={`Are you sure you want to delete ${deleteTarget?.name}? All associated transaction records will also be removed.`}
      />
    </div>
  );
};

export default InvestmentTable;
