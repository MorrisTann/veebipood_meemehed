const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  confirmUser,
  forgotPassword,
  resetPassword,
  getProtectedUser,
} = require('../controllers/authController');
const {
  forgotPasswordLimiter,
  registerLimiter,
  loginLimiter,
} = require('../middleware/rateLimiters');

router.post('/register', registerLimiter, registerUser);
router.get('/confirm/:token', confirmUser);
router.post('/login', loginLimiter, loginUser);
router.get('/protected', getProtectedUser);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
