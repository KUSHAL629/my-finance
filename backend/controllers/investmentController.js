const Investment = require('../models/Investment');
const InvestmentTransaction = require('../models/InvestmentTransaction');

// @desc    Get all investments with filtering & sorting
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res, next) => {
  try {
    const { search, type, platform, sortBy = 'currentValue', sortOrder = 'desc' } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (platform && platform !== 'All') {
      query.platform = platform;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const investments = await Investment.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: investments.length,
      investments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get portfolio summary statistics & allocation
// @route   GET /api/investments/portfolio/summary
// @access  Private
const getPortfolioSummary = async (req, res, next) => {
  try {
    const investments = await Investment.find({ userId: req.user._id });

    let totalInvested = 0;
    let currentPortfolioValue = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    const typeDistribution = {};

    let bestPerforming = null;
    let worstPerforming = null;

    investments.forEach((inv) => {
      totalInvested += inv.investedAmount;
      currentPortfolioValue += inv.currentValue;

      const pL = inv.currentValue - inv.investedAmount;
      if (pL >= 0) {
        totalProfit += pL;
      } else {
        totalLoss += Math.abs(pL);
      }

      // Allocation by type
      typeDistribution[inv.type] = (typeDistribution[inv.type] || 0) + inv.currentValue;

      // Returns %
      const returnPct = inv.investedAmount > 0 ? (pL / inv.investedAmount) * 100 : 0;
      const invWithReturn = {
        _id: inv._id,
        name: inv.name,
        type: inv.type,
        investedAmount: inv.investedAmount,
        currentValue: inv.currentValue,
        profitLoss: Number(pL.toFixed(2)),
        returnPercentage: Number(returnPct.toFixed(2)),
      };

      if (!bestPerforming || returnPct > bestPerforming.returnPercentage) {
        bestPerforming = invWithReturn;
      }
      if (!worstPerforming || returnPct < worstPerforming.returnPercentage) {
        worstPerforming = invWithReturn;
      }
    });

    const netProfitLoss = currentPortfolioValue - totalInvested;
    const overallReturnPct =
      totalInvested > 0 ? ((currentPortfolioValue - totalInvested) / totalInvested) * 100 : 0;

    // Convert allocation to percentage array
    const allocation = Object.entries(typeDistribution).map(([type, value]) => ({
      name: type,
      value: Number(value.toFixed(2)),
      percentage: currentPortfolioValue > 0 ? Number(((value / currentPortfolioValue) * 100).toFixed(1)) : 0,
    }));

    res.status(200).json({
      success: true,
      totalInvested: Number(totalInvested.toFixed(2)),
      currentPortfolioValue: Number(currentPortfolioValue.toFixed(2)),
      netProfitLoss: Number(netProfitLoss.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      totalLoss: Number(totalLoss.toFixed(2)),
      overallReturnPercentage: Number(overallReturnPct.toFixed(2)),
      bestPerforming,
      worstPerforming,
      allocation,
      totalAssetsCount: investments.length,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single investment
// @route   GET /api/investments/:id
// @access  Private
const getInvestmentById = async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    const transactions = await InvestmentTransaction.find({
      investmentId: req.params.id,
      userId: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      investment,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res, next) => {
  try {
    const {
      name,
      type,
      platform,
      investedAmount,
      currentValue,
      quantity,
      purchaseDate,
      currentPrice,
      notes,
    } = req.body;

    if (!name || !type || investedAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide investment name, type, and invested amount',
      });
    }

    const investment = await Investment.create({
      userId: req.user._id,
      name,
      type,
      platform: platform || 'Direct',
      investedAmount: Number(investedAmount),
      currentValue: currentValue !== undefined ? Number(currentValue) : Number(investedAmount),
      quantity: quantity ? Number(quantity) : 1,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      currentPrice: currentPrice ? Number(currentPrice) : 0,
      notes: notes || '',
    });

    // Automatically create initial 'Buy' transaction if investedAmount > 0
    if (Number(investedAmount) > 0) {
      await InvestmentTransaction.create({
        userId: req.user._id,
        investmentId: investment._id,
        transactionType: 'Buy',
        amount: Number(investedAmount),
        quantity: investment.quantity,
        price: investment.currentPrice,
        date: investment.purchaseDate,
        notes: 'Initial investment purchase',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Investment added successfully',
      investment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Private
const updateInvestment = async (req, res, next) => {
  try {
    let investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    investment = await Investment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Investment updated successfully',
      investment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete investment & all its transactions
// @route   DELETE /api/investments/:id
// @access  Private
const deleteInvestment = async (req, res, next) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    // Delete associated transactions
    await InvestmentTransaction.deleteMany({ investmentId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Investment deleted successfully',
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

// --- Investment Transactions CRUD ---

// @desc    Get transactions for an investment
// @route   GET /api/investments/:id/transactions
// @access  Private
const getInvestmentTransactions = async (req, res, next) => {
  try {
    const transactions = await InvestmentTransaction.find({
      investmentId: req.params.id,
      userId: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add transaction to investment
// @route   POST /api/investments/:id/transactions
// @access  Private
const addInvestmentTransaction = async (req, res, next) => {
  try {
    const { transactionType, amount, quantity, price, date, notes } = req.body;

    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    const transaction = await InvestmentTransaction.create({
      userId: req.user._id,
      investmentId: investment._id,
      transactionType,
      amount: Number(amount),
      quantity: quantity ? Number(quantity) : 0,
      price: price ? Number(price) : 0,
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    });

    // Optionally adjust investment totals
    if (transactionType === 'Buy' || transactionType === 'SIP contribution') {
      investment.investedAmount += Number(amount);
      if (quantity) investment.quantity += Number(quantity);
      await investment.save();
    } else if (transactionType === 'Sell' || transactionType === 'Withdrawal') {
      if (quantity) investment.quantity = Math.max(0, investment.quantity - Number(quantity));
      await investment.save();
    }

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      transaction,
      investment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete investment transaction
// @route   DELETE /api/investments/:id/transactions/:transactionId
// @access  Private
const deleteInvestmentTransaction = async (req, res, next) => {
  try {
    const transaction = await InvestmentTransaction.findOneAndDelete({
      _id: req.params.transactionId,
      investmentId: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      id: req.params.transactionId,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInvestments,
  getPortfolioSummary,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTransactions,
  addInvestmentTransaction,
  deleteInvestmentTransaction,
};
