import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';

const ExpenseModal = ({ isOpen, onClose, onSave, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    paymentMethod: 'UPI',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        paymentMethod: initialData.paymentMethod || 'UPI',
        type: initialData.type || 'Expense',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        paymentMethod: 'UPI',
        type: 'Expense',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add New Expense'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount & Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 1250"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all ${
                errors.amount
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <input
            type="text"
            placeholder="e.g. Swiggy Lunch with Team"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all ${
              errors.description
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Category & Payment Method row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Type
          </label>
          <div className="flex space-x-3">
            {['Expense', 'Recurring', 'One-time'].map((typeOption) => (
              <label
                key={typeOption}
                className={`flex-1 py-2 text-center text-xs font-medium rounded-xl border cursor-pointer transition-all ${
                  formData.type === typeOption
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={typeOption}
                  checked={formData.type === typeOption}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="sr-only"
                />
                {typeOption}
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Notes / Receipt info (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Add any extra details or invoice reference..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all resize-none"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-60"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            <span>{initialData ? 'Update Expense' : 'Save Expense'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
