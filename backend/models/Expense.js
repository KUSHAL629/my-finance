const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Food',
        'Shopping',
        'Transportation',
        'Bills',
        'Rent',
        'Entertainment',
        'Healthcare',
        'Education',
        'Travel',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'UPI',
    },
    type: {
      type: String,
      enum: ['Expense', 'Recurring', 'One-time'],
      default: 'Expense',
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

ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
