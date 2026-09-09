const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
