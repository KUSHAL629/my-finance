// Realistic Indian financial demo data generator
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Investment = require('../models/Investment');
const InvestmentTransaction = require('../models/InvestmentTransaction');

const seedUserData = async (userId) => {
  // Clear any existing data for this user
  await Expense.deleteMany({ userId });
  await Income.deleteMany({ userId });
  await Investment.deleteMany({ userId });
  await InvestmentTransaction.deleteMany({ userId });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to get date N days ago
  const daysAgo = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  // Helper for specific month and day
  const monthDate = (monthOffset, day) => {
    return new Date(currentYear, currentMonth - monthOffset, day, 12, 0, 0);
  };

  // 1. Incomes across the last 6 months
  const incomeRecords = [
    // Current month
    { userId, amount: 125000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(0, 1), notes: 'Monthly direct deposit' },
    { userId, amount: 22000, source: 'Freelance', description: 'UI/UX Design Consulting Project', date: monthDate(0, 10), notes: 'Client invoice paid' },
    { userId, amount: 4500, source: 'Dividends', description: 'TCS & Infosys Quarterly Dividends', date: monthDate(0, 15), notes: 'Credited to Zerodha' },
    
    // 1 month ago
    { userId, amount: 125000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(1, 1), notes: 'Monthly salary' },
    { userId, amount: 18000, source: 'Freelance', description: 'Web Development Milestone 1', date: monthDate(1, 12), notes: 'Client project' },
    { userId, amount: 3200, source: 'Interest', description: 'Bank FD Quarterly Interest', date: monthDate(1, 20), notes: 'Savings credit' },

    // 2 months ago
    { userId, amount: 120000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(2, 1), notes: 'Monthly salary' },
    { userId, amount: 15000, source: 'Freelance', description: 'Landing Page Redesign', date: monthDate(2, 14), notes: 'Client payment' },

    // 3 months ago
    { userId, amount: 120000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(3, 1), notes: 'Monthly salary' },
    { userId, amount: 25000, source: 'Business', description: 'Digital Asset Licensing', date: monthDate(3, 18), notes: 'Stripe payout' },

    // 4 months ago
    { userId, amount: 115000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(4, 1), notes: 'Monthly salary' },

    // 5 months ago
    { userId, amount: 115000, source: 'Salary', description: 'Tech Corp Monthly Salary', date: monthDate(5, 1), notes: 'Monthly salary' },
  ];

  await Income.insertMany(incomeRecords);

  // 2. Expenses spread across categories
  const expenseRecords = [
    // Today / Recent days
    { userId, amount: 650, category: 'Food', description: 'Lunch at Swiggy', paymentMethod: 'UPI', date: daysAgo(0), notes: 'Order #48102' },
    { userId, amount: 240, category: 'Transportation', description: 'Metro Smart Card Recharge', paymentMethod: 'UPI', date: daysAgo(1), notes: 'Weekly commute' },
    { userId, amount: 3200, category: 'Shopping', description: 'New Running Shoes', paymentMethod: 'Credit Card', date: daysAgo(2), notes: 'Decathlon sale' },
    { userId, amount: 1200, category: 'Entertainment', description: 'IMAX Movie Tickets with Friends', paymentMethod: 'Credit Card', date: daysAgo(3), notes: 'PVR cinemas' },
    { userId, amount: 480, category: 'Food', description: 'Groceries & Milk', paymentMethod: 'UPI', date: daysAgo(4), notes: 'Blinkit' },
    { userId, amount: 2800, category: 'Bills', description: 'Electricity Bill', paymentMethod: 'Bank Transfer', date: daysAgo(5), notes: 'Bescom bill' },
    { userId, amount: 999, category: 'Bills', description: 'Broadband Fiber Internet', paymentMethod: 'UPI', date: daysAgo(6), notes: 'Airtel Xstream' },
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(0, 5), notes: 'Transfer to landlord' },
    { userId, amount: 1500, category: 'Healthcare', description: 'Dentist Consultation & Checkup', paymentMethod: 'Debit Card', date: monthDate(0, 8), notes: 'Annual dental clinic' },
    { userId, amount: 4500, category: 'Shopping', description: 'Clothing & Essentials', paymentMethod: 'Credit Card', date: monthDate(0, 11), notes: 'Myntra Big Fashion' },
    { userId, amount: 1800, category: 'Food', description: 'Family Dinner at Barbeque Nation', paymentMethod: 'Credit Card', date: monthDate(0, 14), notes: 'Weekend outing' },
    { userId, amount: 2100, category: 'Education', description: 'Full-Stack Architecture Book & Course', paymentMethod: 'Credit Card', date: monthDate(0, 16), notes: 'Udemy & Kindle' },
    { userId, amount: 850, category: 'Transportation', description: 'Uber Rides to Airport', paymentMethod: 'UPI', date: monthDate(0, 19), notes: 'Airport pickup' },
    { userId, amount: 4200, category: 'Travel', description: 'Weekend Resort Stay Booking', paymentMethod: 'Credit Card', date: monthDate(0, 22), notes: 'Coorg trip' },
    { userId, amount: 1100, category: 'Other', description: 'Home Plants & Garden Care', paymentMethod: 'Cash', date: monthDate(0, 24), notes: 'Local nursery' },

    // Previous month (Month - 1)
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(1, 5), notes: 'Monthly rent' },
    { userId, amount: 8500, category: 'Food', description: 'Monthly Groceries & Dining', paymentMethod: 'UPI', date: monthDate(1, 10), notes: 'Zepto & supermarkets' },
    { userId, amount: 3100, category: 'Bills', description: 'Electricity & Gas Utility', paymentMethod: 'UPI', date: monthDate(1, 8), notes: 'Utilities' },
    { userId, amount: 6200, category: 'Shopping', description: 'Ergonomic Desk Chair', paymentMethod: 'Credit Card', date: monthDate(1, 15), notes: 'Home office upgrade' },
    { userId, amount: 2800, category: 'Transportation', description: 'Fuel & Cab Rides', paymentMethod: 'Debit Card', date: monthDate(1, 20), notes: 'Commute' },
    { userId, amount: 3500, category: 'Healthcare', description: 'Routine Blood Panel & Vitamins', paymentMethod: 'Debit Card', date: monthDate(1, 22), notes: '1mg diagnostics' },
    { userId, amount: 2500, category: 'Entertainment', description: 'Music Festival Pass', paymentMethod: 'Credit Card', date: monthDate(1, 25), notes: 'BookMyShow' },

    // Month - 2
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(2, 5), notes: 'Monthly rent' },
    { userId, amount: 7800, category: 'Food', description: 'Groceries & Dining Out', paymentMethod: 'UPI', date: monthDate(2, 12), notes: 'Food expenses' },
    { userId, amount: 2900, category: 'Bills', description: 'Water & Electricity', paymentMethod: 'UPI', date: monthDate(2, 9), notes: 'Bills' },
    { userId, amount: 5500, category: 'Travel', description: 'Train Tickets & Tour Booking', paymentMethod: 'Debit Card', date: monthDate(2, 18), notes: 'IRCTC booking' },

    // Month - 3
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(3, 5), notes: 'Monthly rent' },
    { userId, amount: 8100, category: 'Food', description: 'Groceries & Food Delivery', paymentMethod: 'UPI', date: monthDate(3, 11), notes: 'Food expenses' },
    { userId, amount: 3200, category: 'Bills', description: 'Electricity & Maintenance', paymentMethod: 'Bank Transfer', date: monthDate(3, 7), notes: 'Maintenance' },
    { userId, amount: 4800, category: 'Shopping', description: 'Noise Cancelling Headphones', paymentMethod: 'Credit Card', date: monthDate(3, 20), notes: 'Amazon electronics' },

    // Month - 4
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(4, 5), notes: 'Monthly rent' },
    { userId, amount: 7500, category: 'Food', description: 'Food & Pantry', paymentMethod: 'UPI', date: monthDate(4, 14), notes: 'Food' },
    { userId, amount: 2800, category: 'Bills', description: 'Utilities & Internet', paymentMethod: 'UPI', date: monthDate(4, 10), notes: 'Bills' },

    // Month - 5
    { userId, amount: 25000, category: 'Rent', description: 'Apartment Monthly Rent', paymentMethod: 'Bank Transfer', date: monthDate(5, 5), notes: 'Monthly rent' },
    { userId, amount: 7200, category: 'Food', description: 'Food & Groceries', paymentMethod: 'UPI', date: monthDate(5, 12), notes: 'Food' },
    { userId, amount: 2600, category: 'Bills', description: 'Utilities', paymentMethod: 'UPI', date: monthDate(5, 8), notes: 'Bills' },
  ];

  await Expense.insertMany(expenseRecords);

  // 3. Realistic Investments with positive and balanced returns
  const investments = [
    {
      userId,
      name: 'Parag Parikh Flexi Cap Fund',
      type: 'Mutual Funds',
      platform: 'Groww',
      investedAmount: 60000,
      currentValue: 74500,
      quantity: 820.5,
      purchaseDate: monthDate(5, 10),
      currentPrice: 90.8,
      notes: 'Monthly SIP via ECS direct debit',
    },
    {
      userId,
      name: 'Nifty 50 Index Fund',
      type: 'SIP',
      platform: 'Zerodha Coin',
      investedAmount: 50000,
      currentValue: 58200,
      quantity: 320,
      purchaseDate: monthDate(4, 15),
      currentPrice: 181.87,
      notes: 'Long-term core equity index holding',
    },
    {
      userId,
      name: 'Infosys Ltd (INFY)',
      type: 'Stocks',
      platform: 'Zerodha Kite',
      investedAmount: 45000,
      currentValue: 49800,
      quantity: 30,
      purchaseDate: monthDate(3, 5),
      currentPrice: 1660,
      notes: 'IT blue-chip company dividend stock',
    },
    {
      userId,
      name: 'Tata Motors Passenger Vehicles',
      type: 'Stocks',
      platform: 'Zerodha Kite',
      investedAmount: 30000,
      currentValue: 38400,
      quantity: 40,
      purchaseDate: monthDate(4, 1),
      currentPrice: 960,
      notes: 'EV leader in India auto sector',
    },
    {
      userId,
      name: 'Sovereign Gold Bond (SGB 2024)',
      type: 'Gold',
      platform: 'RBI / NetBanking',
      investedAmount: 35000,
      currentValue: 41200,
      quantity: 5,
      purchaseDate: monthDate(5, 20),
      currentPrice: 8240,
      notes: 'Government backed 2.5% annual coupon',
    },
    {
      userId,
      name: 'HDFC Bank Tax Saver FD',
      type: 'Fixed Deposit',
      platform: 'HDFC Bank',
      investedAmount: 50000,
      currentValue: 53600,
      quantity: 1,
      purchaseDate: monthDate(5, 1),
      currentPrice: 53600,
      notes: '7.25% p.a. fixed interest safe asset',
    },
    {
      userId,
      name: 'Bitcoin (BTC)',
      type: 'Cryptocurrency',
      platform: 'CoinDCX',
      investedAmount: 20000,
      currentValue: 24800,
      quantity: 0.0035,
      purchaseDate: monthDate(2, 10),
      currentPrice: 7085714,
      notes: 'Small high-risk speculative allocation',
    },
  ];

  const createdInvestments = await Investment.insertMany(investments);

  // 4. Create sample investment transactions
  const transactions = [
    {
      userId,
      investmentId: createdInvestments[0]._id,
      transactionType: 'SIP contribution',
      amount: 10000,
      quantity: 110,
      price: 90.9,
      date: monthDate(0, 10),
      notes: 'Monthly SIP executed',
    },
    {
      userId,
      investmentId: createdInvestments[1]._id,
      transactionType: 'SIP contribution',
      amount: 10000,
      quantity: 55,
      price: 181.8,
      date: monthDate(0, 15),
      notes: 'Index fund auto-debit',
    },
    {
      userId,
      investmentId: createdInvestments[2]._id,
      transactionType: 'Dividend',
      amount: 840,
      quantity: 0,
      price: 0,
      date: monthDate(0, 18),
      notes: 'Interim dividend credited',
    },
    {
      userId,
      investmentId: createdInvestments[3]._id,
      transactionType: 'Buy',
      amount: 15000,
      quantity: 20,
      price: 750,
      date: monthDate(2, 14),
      notes: 'Bought additional shares on market dip',
    },
  ];

  await InvestmentTransaction.insertMany(transactions);

  return {
    incomesCount: incomeRecords.length,
    expensesCount: expenseRecords.length,
    investmentsCount: createdInvestments.length,
    transactionsCount: transactions.length,
  };
};

module.exports = { seedUserData };
