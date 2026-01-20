const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', require('../controllers/authController').googleLogin);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.put('/reset-password/:token', require('../controllers/authController').resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, require('../controllers/authController').updateProfile);

module.exports = router;
