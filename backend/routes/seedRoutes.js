const express = require('express');
const { loadDemoData, clearUserData } = require('../controllers/seedController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/demo-data', loadDemoData);
router.post('/clear-data', clearUserData);

module.exports = router;
