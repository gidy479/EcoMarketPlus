const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Wallet = require('../models/Wallet');

// @desc    Add manual income or expense
// @route   POST /api/finance/transaction
// @access  Private
const addTransaction = async (req, res) => {
    const { type, amount, category, description, isEcoFriendly, date } = req.body;

    try {
        let wallet = await Wallet.findOne({ user: req.user._id });

        if (!wallet) {
            // Auto-create wallet if it doesn't exist, just like in walletController
            wallet = await Wallet.create({ user: req.user._id });
        }

        const transaction = await Transaction.create({
            user: req.user._id,
            wallet: wallet._id,
            type,
            amount,
            category,
            description,
            isEcoFriendly: isEcoFriendly || false,
            isManualEntry: true,
            date: date || Date.now(),
            status: 'COMPLETED'
        });

        // Optional: Update wallet balance if it's a "Real" transaction tracked via manual entry?
        // For this prototype, let's say manual entries affect the 'perceived' balance in the tracker,
        // but maybe not the actual 'digital wallet' balance unless specified.
        // Requirement says: "Allow optional manual expense entry for external spending."
        // External spending implies it comes from outside the EcoMarket wallet.
        // So we do NOT update the Wallet balance for manual entries, just record the transaction.

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get financial summary
// @route   GET /api/finance/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        let totalIncome = 0;
        let totalExpenses = 0;
        let ecoExpenses = 0;
        let nonEcoExpenses = 0;

        transactions.forEach(txn => {
            if (txn.type === 'CREDIT') {
                totalIncome += txn.amount;
            } else if (txn.type === 'DEBIT') {
                totalExpenses += txn.amount;
                if (txn.isEcoFriendly) {
                    ecoExpenses += txn.amount;
                } else {
                    nonEcoExpenses += txn.amount;
                }
            }
        });

        const wallet = await Wallet.findOne({ user: req.user._id });

        res.json({
            totalIncome,
            totalExpenses,
            remainingBalance: totalIncome - totalExpenses, // Simple cash flow
            walletBalance: wallet ? wallet.balance : 0,
            ecoExpenses,
            nonEcoExpenses,
            ecoScore: totalExpenses > 0 ? Math.round((ecoExpenses / totalExpenses) * 100) : 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get AI Insights
// @route   GET /api/finance/insights
// @access  Private
const getAIInsights = async (req, res) => {
    try {
        // Mocking lightweight AI logic
        const budgets = await Budget.find({ user: req.user._id });
        const transactions = await Transaction.find({ user: req.user._id });

        const insights = [];

        // Insight 1: Budget Alert
        // Calc current month spending per category
        const currentMonth = new Date().getMonth();
        const categorySpending = {};

        transactions.forEach(txn => {
            const txnDate = new Date(txn.createdAt);
            if (txnDate.getMonth() === currentMonth && txn.type === 'DEBIT') {
                categorySpending[txn.category] = (categorySpending[txn.category] || 0) + txn.amount;
            }
        });

        budgets.forEach(budget => {
            const spent = categorySpending[budget.category] || 0;
            const threshold = budget.limit * budget.alertThreshold;

            if (spent >= budget.limit) {
                insights.push({
                    type: 'warning',
                    message: `🚨 You have exceeded your ${budget.category} budget!`
                });
            } else if (spent >= threshold) {
                insights.push({
                    type: 'alert',
                    message: `⚠️ You are close to exceeding your ${budget.category} budget (${Math.round(spent / budget.limit * 100)}% used).`
                });
            }
        });

        // Insight 2: Eco Suggestion
        // Simple random suggestion for prototype
        const suggestions = [
            "💡 You spent 15% more on non-eco products this week. Try switching to local brands.",
            "🌱 Great job! 40% of your expenses were eco-friendly this month.",
            "💰 You could save GHS 50 by buying bulk eco-detergents."
        ];
        insights.push({ type: 'tip', message: suggestions[Math.floor(Math.random() * suggestions.length)] });

        res.json(insights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addTransaction,
    getFinancialSummary,
    getAIInsights
};
