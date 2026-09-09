import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title based on path
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Dashboard';
    if (p.startsWith('/expenses')) return 'Expense Management';
    if (p.startsWith('/investments')) return 'Investment Portfolio';
    if (p.startsWith('/monthly')) return 'Monthly Records';
    if (p.startsWith('/reports')) return 'Reports & Analytics';
    if (p.startsWith('/settings')) return 'Settings & Preferences';
    return 'Financial Overview';
  };

  // Format today's date
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/expenses?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-400 dark:text-slate-500">
            {today}
          </p>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses, investments or notes (Press Enter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h4>
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Savings Milestone Achieved
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Your savings rate this month is over 60%! Excellent financial health.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'My Account'}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                <span>Settings & Profile</span>
              </Link>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  toast.info('Logged out successfully');
                  navigate('/login');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
