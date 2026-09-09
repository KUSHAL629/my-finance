import React from 'react';
import { PlusCircle, Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'You have not added any entries yet. Click below to create your first record.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
