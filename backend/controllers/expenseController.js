const Expense = require('../models/Expense');

// @desc    Get all expenses with filtering, sorting, and pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      startDate,
      endDate,
      year,
      month, // 1 to 12
      period, // 'daily', 'weekly', 'monthly'
      date, // specific date YYYY-MM-DD
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { userId: req.user._id };

    // Search by description or notes
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Month & Year filter
    if (year && month) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Specific Date filter for Daily view
    if (date) {
      const d = new Date(date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    // Sorting
    const sort = {};
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'amount') {
      sort.amount = order;
    } else {
      sort.date = order;
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      expenses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get expense summary (daily, weekly, monthly stats)
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res, next) => {
  try {
    const { period = 'monthly', date = new Date().toISOString() } = req.query;
    const targetDate = new Date(date);
    let startDate, endDate;

    if (period === 'daily') {
      startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'weekly') {
      const day = targetDate.getDay();
      const diffToMonday = targetDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(targetDate.setDate(diffToMonday));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // monthly
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const expenses = await Expense.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ amount: -1 });

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const transactionCount = expenses.length;
    const highestExpense = expenses.length > 0 ? expenses[0] : null;

    // Daily average calculation
    const diffDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const averageDailySpending = totalSpent / diffDays;

    // Most used category
    const categoryTotals = {};
    expenses.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    let mostUsedCategory = 'None';
    let maxCatAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxCatAmount) {
        maxCatAmount = amount;
        mostUsedCategory = cat;
      }
    });

    res.status(200).json({
      success: true,
      period,
      startDate,
      endDate,
      totalSpent: Number(totalSpent.toFixed(2)),
      transactionCount,
      averageDailySpending: Number(averageDailySpending.toFixed(2)),
      highestExpense: highestExpense
        ? {
            amount: highestExpense.amount,
            description: highestExpense.description,
            category: highestExpense.category,
            date: highestExpense.date,
          }
        : null,
      mostUsedCategory,
      categoryTotals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found',
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, paymentMethod, date, notes, type } =
      req.body;

    if (!amount || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount, category, and description',
      });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      amount: Number(amount),
      category,
      description,
      paymentMethod: paymentMethod || 'UPI',
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
      type: type || 'Expense',
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found',
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExpenses,
  getExpenseSummary,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
