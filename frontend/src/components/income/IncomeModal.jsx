import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { INCOME_SOURCES } from '../../utils/constants';

const IncomeModal = ({ isOpen, onClose, onSave, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        source: initialData.source || 'Salary',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        amount: '',
        source: 'Salary',
        description: '',
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
      title={initialData ? 'Edit Income' : 'Record Income'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Amount (₹) *
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 125000"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white transition-all ${
              errors.amount
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
            }`}
          />
          {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Income Source *
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white transition-all"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <input
            type="text"
            placeholder="e.g. Monthly Software Engineer Salary"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white transition-all ${
              errors.description
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-emerald-500'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Notes (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="e.g. Client name, direct bank transfer ref..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white transition-all resize-none"
          />
        </div>

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
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-medium rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-60"
          >
            <span>{initialData ? 'Update Income' : 'Record Income'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IncomeModal;
