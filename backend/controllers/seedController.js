const { seedUserData } = require('../utils/sampleData');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Investment = require('../models/Investment');
const InvestmentTransaction = require('../models/InvestmentTransaction');

// @desc    Seed realistic demo financial data for current user
// @route   POST /api/seed/demo-data
// @access  Private
const loadDemoData = async (req, res, next) => {
  try {
    const stats = await seedUserData(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Realistic demo financial records loaded successfully!',
      stats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear all user financial records to start fresh
// @route   POST /api/seed/clear-data
// @access  Private
const clearUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Promise.all([
      Expense.deleteMany({ userId }),
      Income.deleteMany({ userId }),
      Investment.deleteMany({ userId }),
      InvestmentTransaction.deleteMany({ userId }),
    ]);

    res.status(200).json({
      success: true,
      message: 'All your financial records have been cleared.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loadDemoData,
  clearUserData,
};
