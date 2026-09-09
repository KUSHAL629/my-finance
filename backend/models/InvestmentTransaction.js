const mongoose = require('mongoose');

const InvestmentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
      index: true,
    },
    transactionType: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['Buy', 'Sell', 'SIP contribution', 'Dividend', 'Withdrawal'],
      default: 'Buy',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

InvestmentTransactionSchema.index({ userId: 1, investmentId: 1, date: -1 });

module.exports = mongoose.model(
  'InvestmentTransaction',
  InvestmentTransactionSchema
);
