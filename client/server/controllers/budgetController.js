const Budget = require('../models/Budget');

// @desc    Get user budgets
// @route   GET /api/finance/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a budget
// @route   POST /api/finance/budgets
// @access  Private
const createBudget = async (req, res) => {
    const { category, limit, period } = req.body;

    try {
        const budget = new Budget({
            user: req.user._id,
            category,
            limit,
            period
        });

        const createdBudget = await budget.save();
        res.status(201).json(createdBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBudgets,
    createBudget
};
