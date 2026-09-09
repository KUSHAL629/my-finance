import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  X,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

const MobileNav = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const toast = useToast();

  if (!isOpen) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Investments', path: '/investments', icon: TrendingUp },
    { name: 'Monthly Records', path: '/monthly', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleSeed = async () => {
    try {
      await api.seed.loadDemoData();
      toast.success('Realistic demo data loaded successfully!');
      window.dispatchEvent(new Event('finance:data-updated'));
      onClose();
    } catch (err) {
      toast.error('Failed to load demo data: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 z-10 shadow-2xl p-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              My<span className="text-indigo-600 dark:text-indigo-400">Finance</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Demo Data button in drawer */}
        <div className="p-3 mb-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <button
            onClick={handleSeed}
            className="w-full py-2 px-3 bg-indigo-600 text-white text-xs font-medium rounded-lg flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Data</span>
          </button>
        </div>

        {/* Logout */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center px-3.5 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
