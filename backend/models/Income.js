const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    source: {
      type: String,
      required: [true, 'Income source is required'],
      enum: ['Salary', 'Freelance', 'Business', 'Interest', 'Dividends', 'Other'],
      default: 'Salary',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
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

IncomeSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Income', IncomeSchema);
