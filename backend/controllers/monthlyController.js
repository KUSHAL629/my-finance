const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Investment = require('../models/Investment');
const InvestmentTransaction = require('../models/InvestmentTransaction');

// @desc    Get month-by-month financial summaries
// @route   GET /api/monthly-records
// @access  Private
const getMonthlySummaries = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all user records
    const [incomes, expenses, investments, transactions] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
      Investment.find({ userId }),
      InvestmentTransaction.find({ userId }),
    ]);

    // Group by Year-Month string (e.g. "2026-09")
    const monthMap = {};

    const getMonthKey = (date) => {
      const d = new Date(date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    };

    // Aggregate Incomes
    incomes.forEach((inc) => {
      const key = getMonthKey(inc.date);
      if (!monthMap[key]) {
        monthMap[key] = { key, year: new Date(inc.date).getFullYear(), month: new Date(inc.date).getMonth() + 1, income: 0, expenses: 0, investments: 0 };
      }
      monthMap[key].income += inc.amount;
    });

    // Aggregate Expenses
    expenses.forEach((exp) => {
      const key = getMonthKey(exp.date);
      if (!monthMap[key]) {
        monthMap[key] = { key, year: new Date(exp.date).getFullYear(), month: new Date(exp.date).getMonth() + 1, income: 0, expenses: 0, investments: 0 };
      }
      monthMap[key].expenses += exp.amount;
    });

    // Aggregate Investment Transactions for the month
    transactions.forEach((tx) => {
      const key = getMonthKey(tx.date);
      if (!monthMap[key]) {
        monthMap[key] = { key, year: new Date(tx.date).getFullYear(), month: new Date(tx.date).getMonth() + 1, income: 0, expenses: 0, investments: 0 };
      }
      if (tx.transactionType === 'Buy' || tx.transactionType === 'SIP contribution') {
        monthMap[key].investments += tx.amount;
      }
    });

    // If empty, add current month
    const now = new Date();
    const currentKey = getMonthKey(now);
    if (!monthMap[currentKey]) {
      monthMap[currentKey] = {
        key: currentKey,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        income: 0,
        expenses: 0,
        investments: 0,
      };
    }

    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const records = Object.values(monthMap)
      .map((item) => {
        const savings = item.income - item.expenses;
        const savingsRate = item.income > 0 ? (savings / item.income) * 100 : 0;
        return {
          key: item.key,
          year: item.year,
          month: item.month,
          monthName: `${monthNames[item.month]} ${item.year}`,
          income: Number(item.income.toFixed(2)),
          expenses: Number(item.expenses.toFixed(2)),
          savings: Number(savings.toFixed(2)),
          savingsRate: Number(savingsRate.toFixed(1)),
          investments: Number(item.investments.toFixed(2)),
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key));

    res.status(200).json({
      success: true,
      records,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed financial breakdown for a specific month
// @route   GET /api/monthly-records/:year/:month
// @access  Private
const getMonthlyDetail = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.params.year, 10);
    const month = parseInt(req.params.month, 10); // 1-12

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [incomes, expenses, transactions, allInvestments] = await Promise.all([
      Income.find({ userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 }),
      Expense.find({ userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 }),
      InvestmentTransaction.find({ userId, date: { $gte: startDate, $lte: endDate } }).populate('investmentId').sort({ date: -1 }),
      Investment.find({ userId }),
    ]);

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    // Investment summary for this month
    const monthlyInvestedAmount = transactions
      .filter((tx) => tx.transactionType === 'Buy' || tx.transactionType === 'SIP contribution')
      .reduce((sum, item) => sum + item.amount, 0);

    // Category-wise breakdown
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([cat, amt]) => ({
      category: cat,
      amount: Number(amt.toFixed(2)),
      percentage: totalExpenses > 0 ? Number(((amt / totalExpenses) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // Combined transactions history
    const transactionsHistory = [
      ...incomes.map((i) => ({
        _id: i._id,
        date: i.date,
        type: 'Income',
        category: i.source,
        description: i.description,
        amount: i.amount,
        notes: i.notes,
      })),
      ...expenses.map((e) => ({
        _id: e._id,
        date: e.date,
        type: 'Expense',
        category: e.category,
        paymentMethod: e.paymentMethod,
        description: e.description,
        amount: e.amount,
        notes: e.notes,
      })),
      ...transactions.map((t) => ({
        _id: t._id,
        date: t.date,
        type: 'Investment',
        category: t.transactionType,
        description: t.investmentId ? t.investmentId.name : 'Investment Transaction',
        amount: t.amount,
        notes: t.notes,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    res.status(200).json({
      success: true,
      monthName: `${monthNames[month]} ${year}`,
      year,
      month,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        totalSavings: Number(totalSavings.toFixed(2)),
        savingsRate: Number(savingsRate.toFixed(1)),
        totalInvestments: Number(monthlyInvestedAmount.toFixed(2)),
      },
      categoryBreakdown,
      transactions: transactionsHistory,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMonthlySummaries,
  getMonthlyDetail,
};
