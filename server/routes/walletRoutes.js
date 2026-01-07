const express = require('express');
const router = express.Router();
const { getWallet, fundWallet, getWalletTransactions } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWallet);
router.post('/fund', protect, fundWallet);
router.get('/history', protect, getWalletTransactions);

module.exports = router;
