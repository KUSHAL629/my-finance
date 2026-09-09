import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-36"></div>
      </div>
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            </div>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-40 mb-6"></div>
    <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-end justify-between p-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-t"
          style={{ height: `${Math.floor(Math.random() * 60) + 30}%` }}
        ></div>
      ))}
    </div>
  </div>
);
