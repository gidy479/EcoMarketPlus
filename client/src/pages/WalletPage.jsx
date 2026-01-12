import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { PaystackButton } from 'react-paystack';

const WalletPage = () => {
    const { token, user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);

    const [transactions, setTransactions] = useState([]);

    const fetchWallet = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/wallet`);
            setWallet(data);

            const txnRes = await axios.get(`${API_URL}/api/wallet/history`);
            setTransactions(txnRes.data);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [token]);

    const handlePaystackSuccessAction = async (reference) => {
        try {
            await axios.post(`${API_URL}/api/wallet/fund`, {
                amount,
                reference: reference.reference,
                description: "Wallet Funding via Paystack"
            });
            fetchWallet();
            setAmount('');
            alert('Wallet funded successfully!');
        } catch (error) {
            console.error("Funding error", error);
            alert("Funding failed on backend");
        }
    };

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    const componentProps = {
        email: user?.email,
        amount: amount * 100,
        currency: 'GHS',
        metadata: {
            name: user?.name,
            phone: "0000000000",
        },
        publicKey: paystackKey,
        text: "Deposit Funds",
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: () => alert("Transaction canceled"),
    };

    const handleDepositClick = () => {
        if (!paystackKey || paystackKey.includes('replace_this')) {
            alert('Please configure a valid VITE_PAYSTACK_PUBLIC_KEY in client/.env');
            return;
        }
    };

    if (loading) return <div className="pt-32 text-center">Loading...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">My Digital Wallet</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">💳</div>
                        <h2 className="text-xl font-medium opacity-80 mb-2">Total Balance</h2>
                        <div className="text-5xl font-bold mb-8">GHS {wallet?.balance.toFixed(2) || '0.00'}</div>
                        <div className="space-y-4">
                            <label className="text-sm font-medium opacity-90 block">Add Funds (Momo / Card)</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 w-full"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                {amount > 0 ? (
                                    <div onClick={handleDepositClick}>
                                        {(!paystackKey || paystackKey.includes('replace_this')) ? (
                                            <button
                                                className="px-6 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Stop parent click event
                                                    if (window.confirm("Paystack Key missing. Proceed with MOCK deposit?")) {
                                                        handlePaystackSuccessAction({ reference: 'MOCK_' + Date.now() });
                                                    }
                                                }}
                                            >
                                                Mock Deposit (Dev)
                                            </button>
                                        ) : (
                                            <PaystackButton {...componentProps} className="px-6 py-2 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors" />
                                        )}
                                    </div>
                                ) : (
                                    <button disabled className="px-6 py-2 bg-white/50 text-white font-bold rounded-lg cursor-not-allowed">
                                        Deposit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats/Info Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Impact</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">🌱</div>
                                <div>
                                    <div className="text-sm text-gray-500">Eco-Spending</div>
                                    <div className="font-bold text-gray-900">12% High Impact</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">📊</div>
                                <div>
                                    <div className="text-sm text-gray-500">Monthly Budget</div>
                                    <div className="font-bold text-gray-900">On Track</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No transactions yet. Fund your wallet to get started!</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{txn.description}</div>
                                            <div className="text-xs text-gray-500">{txn.category}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                                        <td className={`p-4 text-right font-bold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                                            {txn.type === 'CREDIT' ? '+' : '-'} GHS {txn.amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
