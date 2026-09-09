const express = require('express');
const {
  getInvestments,
  getPortfolioSummary,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTransactions,
  addInvestmentTransaction,
  deleteInvestmentTransaction,
} = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/portfolio/summary', getPortfolioSummary);

router.route('/').get(getInvestments).post(createInvestment);

router
  .route('/:id')
  .get(getInvestmentById)
  .put(updateInvestment)
  .delete(deleteInvestment);

router
  .route('/:id/transactions')
  .get(getInvestmentTransactions)
  .post(addInvestmentTransaction);

router.route('/:id/transactions/:transactionId').delete(deleteInvestmentTransaction);

module.exports = router;
