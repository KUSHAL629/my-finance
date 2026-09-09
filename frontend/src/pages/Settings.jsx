import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sliders,
  Shield,
  Trash2,
  Sparkles,
  LogOut,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [dateFormat, setDateFormat] = useState(user?.preferences?.dateFormat || 'DD/MM/YYYY');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Clear data confirm modal
  const [clearDataModal, setClearDataModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await updateProfile({
        name,
        currency,
        preferences: {
          theme,
          dateFormat,
        },
      });
      toast.success('Profile preferences saved!');
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please provide current and new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setPasswordSaving(true);
      await api.auth.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Failed to change password: ' + err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleClearData = async () => {
    try {
      setClearing(true);
      await api.seed.clearData();
      toast.success('All records have been cleared from database.');
      setClearDataModal(false);
      window.dispatchEvent(new Event('finance:data-updated'));
    } catch (err) {
      toast.error('Failed to clear data: ' + err.message);
    } finally {
      setClearing(false);
    }
  };

  const handleLoadDemo = async () => {
    try {
      setSeeding(true);
      await api.seed.loadDemoData();
      toast.success('Realistic sample financial data populated!');
      window.dispatchEvent(new Event('finance:data-updated'));
    } catch (err) {
      toast.error('Failed to load demo data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account profile, display currency, theme, and security credentials
        </p>
      </div>

      {/* Profile & Preferences Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Profile & Preferences
            </h3>
            <p className="text-xs text-slate-400">Your personal details and app configuration</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 08/09/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/08/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-08)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {profileSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Security: Change Password Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Security & Credentials
            </h3>
            <p className="text-xs text-slate-400">Update password to keep your financial logs secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Session Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Data Management
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          You can load sample data anytime for demonstration, or wipe all records to start tracking your finances completely from scratch.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleLoadDemo}
            disabled={seeding}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{seeding ? 'Loading...' : 'Populate Demo Data'}</span>
          </button>

          <button
            onClick={() => setClearDataModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all ml-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={clearDataModal}
        onClose={() => setClearDataModal(false)}
        onConfirm={handleClearData}
        isLoading={clearing}
        title="Clear All Financial Records"
        message="Are you sure you want to delete all expenses, incomes, investments, and transactions? Your user account will remain active, but all financial entries will be permanently removed."
        confirmText="Yes, Wipe All Data"
      />
    </div>
  );
};

export default Settings;
