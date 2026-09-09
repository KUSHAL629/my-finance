const express = require('express');
const {
  getMonthlySummaries,
  getMonthlyDetail,
} = require('../controllers/monthlyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getMonthlySummaries);
router.get('/:year/:month', getMonthlyDetail);

module.exports = router;
