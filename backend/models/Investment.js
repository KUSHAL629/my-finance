const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Investment name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Investment type is required'],
      enum: [
        'Stocks',
        'Mutual Funds',
        'SIP',
        'Fixed Deposit',
        'Gold',
        'Cryptocurrency',
        'Bonds',
        'ETFs',
        'Other',
      ],
      default: 'Mutual Funds',
      index: true,
    },
    platform: {
      type: String,
      trim: true,
      default: 'Direct',
    },
    investedAmount: {
      type: Number,
      required: [true, 'Invested amount is required'],
      min: [0, 'Invested amount cannot be negative'],
    },
    currentValue: {
      type: Number,
      required: [true, 'Current value is required'],
      min: [0, 'Current value cannot be negative'],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, 'Quantity cannot be negative'],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: [0, 'Current price cannot be negative'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

InvestmentSchema.virtual('profitLoss').get(function () {
  return Number((this.currentValue - this.investedAmount).toFixed(2));
});

InvestmentSchema.virtual('returnPercentage').get(function () {
  if (this.investedAmount <= 0) return 0;
  return Number(
    (((this.currentValue - this.investedAmount) / this.investedAmount) * 100).toFixed(2)
  );
});

InvestmentSchema.index({ userId: 1, type: 1 });
InvestmentSchema.index({ userId: 1, purchaseDate: -1 });

module.exports = mongoose.model('Investment', InvestmentSchema);
