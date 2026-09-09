const express = require('express');
const {
  getExpenses,
  getExpenseSummary,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/').get(getExpenses).post(createExpense);
router.route('/summary').get(getExpenseSummary);
router
  .route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
