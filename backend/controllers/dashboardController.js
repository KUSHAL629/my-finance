const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Investment = require('../models/Investment');

// @desc    Get top summary cards & recent transactions for Dashboard
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Date boundaries
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // 1. Overall Lifetime Aggregates
    const [allIncomes, allExpenses, allInvestments] = await Promise.all([
      Income.find({ userId }),
      Expense.find({ userId }),
      Investment.find({ userId }),
    ]);

    const totalIncomeLifetime = allIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenseLifetime = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const currentBalance = totalIncomeLifetime - totalExpenseLifetime;

    // 2. Investment Aggregates
    const totalInvestedAmount = allInvestments.reduce((acc, curr) => acc + curr.investedAmount, 0);
    const currentInvestmentValue = allInvestments.reduce((acc, curr) => acc + curr.currentValue, 0);
    const investmentProfitLoss = currentInvestmentValue - totalInvestedAmount;
    const investmentReturnPercentage =
      totalInvestedAmount > 0
        ? (investmentProfitLoss / totalInvestedAmount) * 100
        : 0;

    // 3. Current Month vs Previous Month Expenses
    const currentMonthExpenses = allExpenses
      .filter((e) => new Date(e.date) >= startOfCurrentMonth && new Date(e.date) <= endOfCurrentMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const prevMonthExpenses = allExpenses
      .filter((e) => new Date(e.date) >= startOfPrevMonth && new Date(e.date) <= endOfPrevMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);

    let expenseChangePercentage = 0;
    if (prevMonthExpenses > 0) {
      expenseChangePercentage =
        ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100;
    }

    // 4. Monthly Savings
    const currentMonthIncome = allIncomes
      .filter((i) => new Date(i.date) >= startOfCurrentMonth && new Date(i.date) <= endOfCurrentMonth)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const currentMonthSavings = currentMonthIncome - currentMonthExpenses;
    const currentMonthSavingsPercentage =
      currentMonthIncome > 0 ? (currentMonthSavings / currentMonthIncome) * 100 : 0;

    // 5. Recent Combined Transactions (last 7)
    const recentExpenses = allExpenses.slice(0, 15).map((e) => ({
      _id: e._id,
      date: e.date,
      description: e.description,
      category: e.category,
      paymentMethod: e.paymentMethod,
      amount: e.amount,
      type: 'expense',
    }));

    const recentIncomes = allIncomes.slice(0, 15).map((i) => ({
      _id: i._id,
      date: i.date,
      description: i.description,
      category: i.source,
      paymentMethod: 'Bank Transfer',
      amount: i.amount,
      type: 'income',
    }));

    const recentTransactions = [...recentExpenses, ...recentIncomes]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);

    res.status(200).json({
      success: true,
      summary: {
        balance: {
          totalIncome: Number(totalIncomeLifetime.toFixed(2)),
          totalExpenses: Number(totalExpenseLifetime.toFixed(2)),
          currentBalance: Number(currentBalance.toFixed(2)),
        },
        investments: {
          totalInvested: Number(totalInvestedAmount.toFixed(2)),
          currentValue: Number(currentInvestmentValue.toFixed(2)),
          profitLoss: Number(investmentProfitLoss.toFixed(2)),
          returnPercentage: Number(investmentReturnPercentage.toFixed(2)),
          isProfitable: investmentProfitLoss >= 0,
        },
        monthlyExpenses: {
          currentMonth: Number(currentMonthExpenses.toFixed(2)),
          previousMonth: Number(prevMonthExpenses.toFixed(2)),
          changePercentage: Number(expenseChangePercentage.toFixed(1)),
          isIncrease: expenseChangePercentage > 0,
        },
        savings: {
          monthlyIncome: Number(currentMonthIncome.toFixed(2)),
          monthlyExpenses: Number(currentMonthExpenses.toFixed(2)),
          savingsAmount: Number(currentMonthSavings.toFixed(2)),
          savingsPercentage: Number(currentMonthSavingsPercentage.toFixed(1)),
        },
      },
      recentTransactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get interactive chart data for Dashboard
// @route   GET /api/dashboard/charts
// @access  Private
const getDashboardCharts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const requestedYear = parseInt(req.query.year, 10) || new Date().getFullYear();

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Fetch records for the selected year
    const startOfYear = new Date(requestedYear, 0, 1);
    const endOfYear = new Date(requestedYear, 11, 31, 23, 59, 59, 999);

    const [yearIncomes, yearExpenses, allExpenses, allInvestments] = await Promise.all([
      Income.find({ userId, date: { $gte: startOfYear, $lte: endOfYear } }),
      Expense.find({ userId, date: { $gte: startOfYear, $lte: endOfYear } }),
      Expense.find({ userId }),
      Investment.find({ userId }),
    ]);

    // 1. Monthly Comparison: Income vs Expenses vs Savings
    const monthlyComparison = monthNames.map((name, index) => {
      const monthIncome = yearIncomes
        .filter((i) => new Date(i.date).getMonth() === index)
        .reduce((sum, item) => sum + item.amount, 0);

      const monthExpense = yearExpenses
        .filter((e) => new Date(e.date).getMonth() === index)
        .reduce((sum, item) => sum + item.amount, 0);

      const monthSavings = monthIncome - monthExpense;

      return {
        month: name,
        monthIndex: index + 1,
        income: Number(monthIncome.toFixed(2)),
        expenses: Number(monthExpense.toFixed(2)),
        savings: Number(monthSavings.toFixed(2)),
      };
    });

    // 2. Expense Category Breakdown (Current Year or Selected Year)
    const categoryTotals = {};
    let totalYearExpense = 0;

    yearExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      totalYearExpense += exp.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount: Number(amount.toFixed(2)),
      percentage: totalYearExpense > 0 ? Number(((amount / totalYearExpense) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // 3. Investment Asset Allocation & Performance
    const assetTypeDistribution = {};
    allInvestments.forEach((inv) => {
      assetTypeDistribution[inv.type] = (assetTypeDistribution[inv.type] || 0) + inv.currentValue;
    });

    const investmentAllocation = Object.entries(assetTypeDistribution).map(([type, val]) => ({
      name: type,
      value: Number(val.toFixed(2)),
    }));

    // Find available years in user's data
    const yearsSet = new Set([new Date().getFullYear()]);
    allExpenses.forEach((e) => yearsSet.add(new Date(e.date).getFullYear()));
    yearIncomes.forEach((i) => yearsSet.add(new Date(i.date).getFullYear()));
    const availableYears = Array.from(yearsSet).sort((a, b) => b - a);

    res.status(200).json({
      success: true,
      year: requestedYear,
      availableYears,
      monthlyComparison,
      categoryBreakdown,
      investmentAllocation,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardCharts,
};
