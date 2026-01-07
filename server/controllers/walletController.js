const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get user wallet balance
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res) => {
    try {
        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            // Create wallet if not exists
            wallet = await Wallet.create({ user: req.user._id });
        }

        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fund wallet (Mock Payment)
// @route   POST /api/wallet/fund
// @access  Private
const fundWallet = async (req, res) => {
    const { amount, reference, description } = req.body;

    try {
        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            wallet = await Wallet.create({ user: req.user._id });
        }

        wallet.balance += Number(amount);
        await wallet.save();

        const transaction = await Transaction.create({
            user: req.user._id,
            wallet: wallet._id,
            type: 'CREDIT',
            amount: Number(amount),
            description: description || 'Wallet Funding',
            reference: reference || `REF-${Date.now()}`,
            status: 'COMPLETED',
            category: 'Income',
        });

        res.json({ wallet, transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get wallet transactions
// @route   GET /api/wallet/transactions
// @access  Private
const getWalletTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWallet, fundWallet, getWalletTransactions };
