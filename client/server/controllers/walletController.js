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

// @desc    Fund wallet (Verified Payment)
// @route   POST /api/wallet/fund
// @access  Private
const fundWallet = async (req, res) => {
    const { amount, reference, description } = req.body;

    if (!reference) {
        return res.status(400).json({ message: 'Transaction reference is required' });
    }

    try {
        let verifiedAmount = 0;
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (secretKey) {
            // Verify with Paystack
            const axios = require('axios');
            try {
                const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                    headers: { Authorization: `Bearer ${secretKey}` }
                });

                const data = verifyRes.data.data;
                if (data.status !== 'success') {
                    return res.status(400).json({ message: 'Transaction verification failed by provider' });
                }

                // Paystack returns amount in kobo (base currency unit), convert to GHS
                verifiedAmount = data.amount / 100;

            } catch (apiError) {
                console.error("Paystack API Error:", apiError.response?.data || apiError.message);
                return res.status(400).json({ message: 'Payment verification failed' });
            }
        } else {
            // Fallback for development if no key provided (Optional: Remove for strict prod)
            console.warn("WARNING: PAYSTACK_SECRET_KEY missing. Using unverified amount.");
            verifiedAmount = Number(amount);
        }

        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            wallet = await Wallet.create({ user: req.user._id });
        }

        // Idempotency: Check if reference already exists
        const existingTxn = await Transaction.findOne({ reference });
        if (existingTxn) {
            return res.status(400).json({ message: 'Transaction already processed' });
        }

        wallet.balance += verifiedAmount;
        await wallet.save();

        const transaction = await Transaction.create({
            user: req.user._id,
            wallet: wallet._id,
            type: 'CREDIT',
            amount: verifiedAmount,
            description: description || 'Wallet Funding',
            reference: reference,
            status: 'COMPLETED',
            category: 'Income',
        });

        res.json({ wallet, transaction });
    } catch (error) {
        console.error(error);
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
