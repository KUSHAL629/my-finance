import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useCurrency } from '../../context/CurrencyContext';

const SummaryCards = ({ summary, loading }) => {
  const navigate = useNavigate();
  const { format } = useCurrency();

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-40"
          />
        ))}
      </div>
    );
  }

  const { balance, investments, monthlyExpenses, savings } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1: Total Balance */}
      <StatCard
        title="Total Balance"
        value={format(balance.currentBalance)}
        icon={Wallet}
        iconColor="text-indigo-600 dark:text-indigo-400"
        iconBg="bg-indigo-50 dark:bg-indigo-950/60"
        badge={balance.currentBalance >= 0 ? 'Surplus' : 'Deficit'}
        badgeType={balance.currentBalance >= 0 ? 'positive' : 'negative'}
        subValues={[
          { label: 'Income', value: format(balance.totalIncome), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Expenses', value: format(balance.totalExpenses), color: 'text-rose-600 dark:text-rose-400' },
        ]}
        onClick={() => navigate('/monthly')}
      />

      {/* Card 2: Total Investments */}
      <StatCard
        title="Total Investments"
        value={format(investments.currentValue)}
        icon={TrendingUp}
        iconColor="text-violet-600 dark:text-violet-400"
        iconBg="bg-violet-50 dark:bg-violet-950/60"
        badge={`${investments.returnPercentage >= 0 ? '+' : ''}${investments.returnPercentage}%`}
        badgeType={investments.isProfitable ? 'positive' : 'negative'}
        subValues={[
          { label: 'Invested', value: format(investments.totalInvested) },
          {
            label: 'P/L',
            value: `${investments.profitLoss >= 0 ? '+' : ''}${format(investments.profitLoss)}`,
            color: investments.isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
          },
        ]}
        onClick={() => navigate('/investments')}
      />

      {/* Card 3: Monthly Expenses */}
      <StatCard
        title="Monthly Expenses"
        value={format(monthlyExpenses.currentMonth)}
        icon={CreditCard}
        iconColor="text-rose-600 dark:text-rose-400"
        iconBg="bg-rose-50 dark:bg-rose-950/60"
        badge={`${monthlyExpenses.changePercentage >= 0 ? '+' : ''}${monthlyExpenses.changePercentage}% vs last mo`}
        badgeType={monthlyExpenses.changePercentage <= 0 ? 'positive' : 'negative'}
        subValues={[
          { label: 'Last Month', value: format(monthlyExpenses.previousMonth) },
        ]}
        onClick={() => navigate('/expenses')}
      />

      {/* Card 4: Savings */}
      <StatCard
        title="Monthly Savings"
        value={format(savings.savingsAmount)}
        icon={PiggyBank}
        iconColor="text-emerald-600 dark:text-emerald-400"
        iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        badge={`${savings.savingsPercentage}% Saved`}
        badgeType={savings.savingsPercentage >= 20 ? 'positive' : 'neutral'}
        subValues={[
          { label: 'Income', value: format(savings.monthlyIncome), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Spent', value: format(savings.monthlyExpenses), color: 'text-rose-600 dark:text-rose-400' },
        ]}
        onClick={() => navigate('/reports')}
      />
    </div>
  );
};

export default SummaryCards;
