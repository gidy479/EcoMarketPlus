import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Paystack');

    const submitHandler = (e) => {
        e.preventDefault();
        localStorage.setItem('paymentMethod', paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex justify-center pb-20">
            <div className="w-full max-w-lg p-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Payment Method</h1>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-4">
                            <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-green-600"
                                    value="Paystack"
                                    checked={paymentMethod === 'Paystack'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-3 font-medium text-gray-900">Paystack (Mobile Money / Card)</span>
                            </label>
                            {/* Add more payment methods here if needed */}
                            <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-green-600"
                                    value="Wallet"
                                    checked={paymentMethod === 'Wallet'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-3 font-medium text-gray-900">Digital Wallet</span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
