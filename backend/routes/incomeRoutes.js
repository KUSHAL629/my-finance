const express = require('express');
const {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getIncomes).post(createIncome);
router
  .route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
