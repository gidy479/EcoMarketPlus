const express = require('express');
const router = express.Router();
const { getBudgets, createBudget } = require('../controllers/budgetController');
const { addTransaction, getFinancialSummary, getAIInsights } = require('../controllers/financeController');
const { protect } = require('../middleware/auth');

router.get('/budgets', protect, getBudgets);
router.post('/budgets', protect, createBudget);

router.post('/transaction', protect, addTransaction);
router.get('/summary', protect, getFinancialSummary);
router.get('/insights', protect, getAIInsights);

module.exports = router;
