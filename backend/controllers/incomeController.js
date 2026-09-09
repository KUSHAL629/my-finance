const Income = require('../models/Income');

// @desc    Get all income records with filtering & pagination
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res, next) => {
  try {
    const {
      search,
      source,
      startDate,
      endDate,
      year,
      month,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    if (source && source !== 'All') {
      query.source = source;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (year && month) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: incomes.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      incomes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single income record
// @route   GET /api/income/:id
// @access  Private
const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      income,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create income record
// @route   POST /api/income
// @access  Private
const createIncome = async (req, res, next) => {
  try {
    const { amount, source, description, date, notes } = req.body;

    if (!amount || !source || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount, source, and description',
      });
    }

    const income = await Income.create({
      userId: req.user._id,
      amount: Number(amount),
      source,
      description,
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Income recorded successfully',
      income,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update income record
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res, next) => {
  try {
    let income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    income = await Income.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      income,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete income record
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
