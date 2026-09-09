# MyFinance — Personal Investment & Expense Tracking Web Application

A modern, responsive, and visually polished full-stack personal finance and wealth management platform built with **React**, **Node.js**, **Express**, **MongoDB (Mongoose)**, **Tailwind CSS**, and **Recharts**.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-indigo)
![License](https://img.shields.io/badge/License-MIT-emerald)
![Currency](https://img.shields.io/badge/Currency-INR%20(₹)-amber)

---

## ✨ Features

- 🔐 **JWT-Based Authentication**: Secure registration and login with `bcrypt` password hashing, token validation, and protected routes.
- 📊 **Main Financial Dashboard**:
  - **Total Balance Card**: Tracks lifetime income, expenses, and current net cash balance.
  - **Total Investments Card**: Portfolio valuation, capital invested, total profit/loss, and overall return percentage.
  - **Monthly Expenses Card**: Current month expenses vs. previous month with percentage variance indicator.
  - **Savings Card**: Monthly income, expenditures, net savings amount, and savings rate percentage.
  - **Income vs. Expense vs. Savings Chart**: Interactive comparison bar/area chart with multi-year toggling.
  - **Category Donut Chart**: Visual distribution across spending categories with interactive click-to-filter.
  - **Portfolio Allocation Chart**: Asset class breakdown (Mutual Funds, Stocks, SIP, Gold, FD, Crypto).
  - **Recent Activity Table**: Real-time inflows and outflows with color-coded badges.
- 💳 **Expense Management**:
  - Full CRUD (Create, Read, Update, Delete with confirmation modal).
  - **Horizon Switching**: Toggle seamlessly between **Daily**, **Weekly**, and **Monthly** expense views.
  - **Period Summary Bar**: Total spent, transaction count, average daily spending, highest single expense, and top spending category.
  - **Rich Filtering & Sorting**: Filter by category, payment method (UPI, Cards, Bank Transfer, Cash), date range, and sort by date or amount with pagination.
- 📈 **Investment & Portfolio Tracking**:
  - Track Stocks, Mutual Funds, SIPs, Fixed Deposits, Gold, Crypto, Bonds, and ETFs.
  - Automatic calculations of **Profit/Loss** (`Current Value - Invested Amount`) and **Return %**.
  - **Investment Transactions**: Log and manage individual *Buy*, *Sell*, *SIP contribution*, *Dividend*, and *Withdrawal* events.
  - Top-performing and watch-list asset highlights.
- 💼 **Income Tracking**:
  - Record recurring salary, freelance invoices, dividends, and interest payouts.
  - Automatically feeds into monthly cash flow and savings calculations.
- 🗓️ **Monthly Records & Drill-Down**:
  - Month-by-month financial summary cards with savings rates.
  - Detailed monthly breakdown pages (`/monthly/:year/:month`) featuring category progress meters and filtered transaction logs.
- 📑 **Reports & CSV Export**:
  - Multi-year analytics.
  - 1-click **Export Expenses to CSV** and **Export Portfolio to CSV**.
- 🌓 **Dark Mode & Personalization**:
  - Light and Dark theme with instant persistence.
  - Customizable display currency (Default: **₹ INR** with Indian numbering format e.g. `₹1,25,000`, with `$ USD`, `€ EUR`, and `£ GBP` support).
  - Date format configuration (`DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`).
- ⚡ **1-Click Demo Data**:
  - Instant demo data loader button to test populated charts, metrics, and monthly records, plus a 1-click wipe option to start fresh.

---

## 🏗️ Architecture

```
my-finance/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with automatic in-memory fallback
│   ├── controllers/              # Auth, Expenses, Income, Investments, Dashboard, Monthly, Seed
│   ├── middleware/               # JWT protect, Error Handler
│   ├── models/                   # User, Expense, Income, Investment, InvestmentTransaction
│   ├── routes/                   # REST API routes
│   ├── utils/                    # Sample financial data generator
│   ├── server.js                 # Express entry point (Port 5000)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Dashboard, Expenses, Investments, Common, Layout
    │   ├── context/              # Auth, Theme, Currency, Toast providers
    │   ├── pages/                # Login, Register, Dashboard, Expenses, Investments, Monthly, Reports, Settings
    │   ├── services/             # API client with JWT interceptor
    │   ├── utils/                # Formatters (₹1,25,000) & Constants
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js            # Proxies /api to backend:5000
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Run the Backend
```bash
cd backend
npm install
node server.js
```
> **Note**: If a local MongoDB instance (`mongodb://127.0.0.1:27017/myfinance`) or Atlas URI in `.env` is available, the backend connects directly. If MongoDB is not running locally, the server automatically starts an embedded in-memory MongoDB instance for development!

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Account Credentials
- **Email:** `anusha@example.com`
- **Password:** `password123`
*(Or click the "Autofill Demo Account" button on the login screen, or create your own account via Register)*


