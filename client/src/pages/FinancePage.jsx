import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FinancePage = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [summary, setSummary] = useState(null);
    const [insights, setInsights] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState('DEBIT'); // or CREDIT

    // Forms
    const [budgetForm, setBudgetForm] = useState({ category: '', limit: '' });
    const [transactionForm, setTransactionForm] = useState({
        type: 'DEBIT', category: 'General', amount: '', description: '', isEcoFriendly: false
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, insightsRes, budgetsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/finance/summary'),
                axios.get('http://localhost:5000/api/finance/insights'),
                axios.get('http://localhost:5000/api/finance/budgets')
            ]);

            setSummary(summaryRes.data);
            setInsights(insightsRes.data);
            setBudgets(budgetsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching finance data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleCreateBudget = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/finance/budgets', {
                category: budgetForm.category,
                limit: Number(budgetForm.limit)
            });
            setShowBudgetModal(false);
            setBudgetForm({ category: '', limit: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create budget');
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/finance/transaction', {
                ...transactionForm,
                amount: Number(transactionForm.amount),
                type: transactionType
            });
            setShowTransactionModal(false);
            setTransactionForm({ type: 'DEBIT', category: 'General', amount: '', description: '', isEcoFriendly: false });
            fetchData();
        } catch (error) {
            alert('Failed to add transaction');
        }
    };

    if (loading) return <div className="pt-32 text-center">Loading Finance Data...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
                    <p className="text-gray-500">Manage your budget and track eco-friendly spending.</p>
                </header>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Total Income</h3>
                            <p className="text-2xl font-bold text-gray-900">GHS {summary.totalIncome.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Total Expenses</h3>
                            <p className="text-2xl font-bold text-red-600">GHS {summary.totalExpenses.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Remaining Balance</h3>
                            <p className="text-2xl font-bold text-green-600">GHS {summary.remainingBalance.toFixed(2)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl shadow-sm border border-green-100">
                            <h3 className="text-green-800 text-sm font-medium">Eco Score</h3>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-bold text-green-700">{summary.ecoScore}%</p>
                                <span className="text-green-600 text-sm mb-1">sustainable spending</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Overview & Insights
                    </button>
                    <button
                        onClick={() => setActiveTab('budgets')}
                        className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'budgets' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Budgets
                    </button>
                    <button
                        onClick={() => setActiveTab('actions')}
                        className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'actions' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Add Transaction
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-green-800 flex items-center gap-2">
                                <span>🤖</span> AI Insights
                            </h2>
                            {insights.length === 0 ? (
                                <p className="text-gray-500">No insights available yet. Start spending to get recommendations!</p>
                            ) : (
                                <ul className="space-y-4">
                                    {insights.map((insight, index) => (
                                        <li key={index} className={`p-4 rounded-xl text-sm ${insight.type === 'warning' ? 'bg-red-50 text-red-700' : insight.type === 'alert' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                            {insight.message}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Spending Breakdown</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Eco-Friendly</span>
                                        <span className="font-medium">GHS {summary?.ecoExpenses.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${summary && summary.totalExpenses ? (summary.ecoExpenses / summary.totalExpenses * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Non-Eco</span>
                                        <span className="font-medium">GHS {summary?.nonEcoExpenses.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${summary && summary.totalExpenses ? (summary.nonEcoExpenses / summary.totalExpenses * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'budgets' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Your Budgets</h2>
                            <button onClick={() => setShowBudgetModal(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">
                                + Set New Budget
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {budgets.map((budget) => (
                                <div key={budget._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-lg text-gray-800">{budget.category}</span>
                                        <span className="text-gray-500 text-sm">Limit: GHS {budget.limit}</span>
                                    </div>
                                    {/* Mock usage for now as we don't have per-category aggregation in the summary yet for specific categories other than eco/non-eco */}
                                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-right">0% Used (Tracking coming soon)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                        <h2 className="text-xl font-bold mb-6 text-center">Log Manual Transaction</h2>
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => { setTransactionType('DEBIT'); setTransactionForm({ ...transactionForm, category: 'General' }); }}
                                className={`flex-1 py-2 rounded-lg font-medium transition ${transactionType === 'DEBIT' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Expense
                            </button>
                            <button
                                onClick={() => { setTransactionType('CREDIT'); setTransactionForm({ ...transactionForm, category: 'Income' }); }}
                                className={`flex-1 py-2 rounded-lg font-medium transition ${transactionType === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Income
                            </button>
                        </div>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GHS)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    value={transactionForm.amount}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    value={transactionForm.category}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                                >
                                    {transactionType === 'CREDIT' ? (
                                        <>
                                            <option value="Salary">Salary</option>
                                            <option value="Business">Business</option>
                                            <option value="Gift">Gift</option>
                                            <option value="Other">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Groceries">Groceries</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="General">General</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    value={transactionForm.description}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                />
                            </div>
                            {transactionType === 'DEBIT' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="ecoFriendly"
                                        checked={transactionForm.isEcoFriendly}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, isEcoFriendly: e.target.checked })}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="ecoFriendly" className="text-gray-700">This was an eco-friendly purchase 🌱</label>
                                </div>
                            )}
                            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
                                Add Transaction
                            </button>
                        </form>
                    </div>
                )}

                {/* Budget Modal */}
                {showBudgetModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                            <h2 className="text-2xl font-bold mb-6">Set New Budget</h2>
                            <form onSubmit={handleCreateBudget} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <select
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        value={budgetForm.category}
                                        onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Entertainment">Entertainment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Limit (GHS)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="0.00"
                                        value={budgetForm.limit}
                                        onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowBudgetModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-700">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancePage;
