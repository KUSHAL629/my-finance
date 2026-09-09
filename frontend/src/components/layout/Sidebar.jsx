import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [seeding, setSeeding] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const handleLoadDemoData = async () => {
    if (seeding) return;
    try {
      setSeeding(true);
      await api.seed.loadDemoData();
      toast.success('Realistic demo data loaded successfully!');
      window.dispatchEvent(new Event('finance:data-updated'));
    } catch (err) {
      toast.error('Failed to load demo data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Investments', path: '/investments', icon: TrendingUp },
    { name: 'Monthly Records', path: '/monthly', icon: Calendar },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight truncate">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                My<span className="text-indigo-600 dark:text-indigo-400">Finance</span>
              </span>
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Wealth Manager
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-200" />
              {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Demo Data Quick Action */}
      {!isCollapsed ? (
        <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Financial Data</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-snug">
            Populate ₹1,25,000 salary, categorized expenses & investments.
          </p>
          <button
            onClick={handleLoadDemoData}
            disabled={seeding}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {seeding ? 'Loading Data...' : 'Load Demo Data'}
          </button>
        </div>
      ) : (
        <div className="p-2 flex justify-center mb-2">
          <button
            onClick={handleLoadDemoData}
            disabled={seeding}
            title="Load Realistic Demo Data"
            className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Footer / Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3.5 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="ml-3 truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
