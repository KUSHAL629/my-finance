import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { useCurrency } from '../../context/CurrencyContext';

const CategoryDonutChart = ({ categoryBreakdown = [] }) => {
  const navigate = useNavigate();
  const { format } = useCurrency();

  const getColorForCategory = (name) => {
    const found = EXPENSE_CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return found ? found.color : '#8B5CF6';
  };

  const handleCategoryClick = (entry) => {
    if (entry && entry.name) {
      navigate(`/expenses?category=${encodeURIComponent(entry.name)}`);
    }
  };

  const totalAmount = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Expense Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribution by spending category
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {format(totalAmount)} Total
        </span>
      </div>

      {categoryBreakdown.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-slate-400">No expense records found for this period.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Chart */}
          <div className="h-56 w-full md:w-1/2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [
                    `${format(value)} (${((value / (totalAmount || 1)) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  onClick={handleCategoryClick}
                  cursor="pointer"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorForCategory(entry.name)}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] text-slate-400">Top Spend</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                {categoryBreakdown[0]?.name || 'N/A'}
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="w-full md:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
            {categoryBreakdown.slice(0, 6).map((item) => (
              <div
                key={item.name}
                onClick={() => handleCategoryClick(item)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: getColorForCategory(item.name) }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {format(item.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 w-9 text-right font-medium">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDonutChart;
