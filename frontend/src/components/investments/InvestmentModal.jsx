import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { INVESTMENT_TYPES } from '../../utils/constants';

const InvestmentModal = ({ isOpen, onClose, onSave, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Mutual Funds',
    platform: 'Zerodha',
    investedAmount: '',
    currentValue: '',
    quantity: '1',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Mutual Funds',
        platform: initialData.platform || 'Direct',
        investedAmount: initialData.investedAmount !== undefined ? initialData.investedAmount : '',
        currentValue: initialData.currentValue !== undefined ? initialData.currentValue : '',
        quantity: initialData.quantity !== undefined ? initialData.quantity : '1',
        currentPrice: initialData.currentPrice !== undefined ? initialData.currentPrice : '',
        purchaseDate: initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'Mutual Funds',
        platform: 'Zerodha',
        investedAmount: '',
        currentValue: '',
        quantity: '1',
        currentPrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Investment name is required';
    if (formData.investedAmount === '' || Number(formData.investedAmount) < 0) {
      errs.investedAmount = 'Invested amount cannot be negative';
    }
    if (formData.currentValue === '' || Number(formData.currentValue) < 0) {
      errs.currentValue = 'Current value cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
      quantity: Number(formData.quantity) || 1,
      currentPrice: Number(formData.currentPrice) || 0,
    });
  };

  // Live calculation preview
  const investedNum = Number(formData.investedAmount) || 0;
  const currentNum = Number(formData.currentValue) || 0;
  const profitLoss = currentNum - investedNum;
  const returnPct = investedNum > 0 ? ((profitLoss / investedNum) * 100).toFixed(2) : '0.00';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Investment' : 'Add New Investment'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Investment / Asset Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Parag Parikh Flexi Cap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Asset Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            >
              {INVESTMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invested Amount & Current Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Invested Amount (₹) *
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 50000"
              value={formData.investedAmount}
              onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all ${
                errors.investedAmount
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.investedAmount && <p className="text-xs text-rose-500 mt-1">{errors.investedAmount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Portfolio Value (₹) *
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 58500"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all ${
                errors.currentValue
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.currentValue && <p className="text-xs text-rose-500 mt-1">{errors.currentValue}</p>}
          </div>
        </div>

        {/* Live Return Preview Card */}
        {investedNum > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Profit/Loss: </span>
              <span className={`font-semibold ${profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {profitLoss >= 0 ? `+₹${profitLoss.toFixed(2)}` : `-₹${Math.abs(profitLoss).toFixed(2)}`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Return Rate: </span>
              <span className={`font-semibold ${profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {profitLoss >= 0 ? `+${returnPct}%` : `${returnPct}%`}
              </span>
            </div>
          </div>
        )}

        {/* Platform, Quantity, Purchase Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Platform / Broker
            </label>
            <input
              type="text"
              placeholder="e.g. Zerodha, Groww"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Quantity / Units
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 25"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Purchase Date
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Notes / Strategy (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="e.g. SIP target 5 years, dividend payout history..."
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
            <span>{initialData ? 'Update Investment' : 'Add Investment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvestmentModal;
