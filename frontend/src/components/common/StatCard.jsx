import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subValues = [],
  badge,
  badgeType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/50',
  onClick,
  cardBorder = 'border-slate-200 dark:border-slate-800',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 rounded-2xl p-6 border ${cardBorder} shadow-sm hover:shadow-md transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-105 duration-200`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Badges or Sub-metrics */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {badge && (
          <div
            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              badgeType === 'positive'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : badgeType === 'negative'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {badgeType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {badgeType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{badge}</span>
          </div>
        )}

        {subValues && subValues.length > 0 && (
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 ml-auto">
            {subValues.map((sub, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="font-normal">{sub.label}:</span>
                <span className={`font-semibold ${sub.color || 'text-slate-700 dark:text-slate-200'}`}>
                  {sub.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
