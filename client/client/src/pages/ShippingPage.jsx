import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShippingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Ghana');

    const submitHandler = (e) => {
        e.preventDefault();
        // Save to LocalStorage or Context
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex justify-center pb-20">
            <div className="w-full max-w-lg p-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Shipping Address</h1>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter your street address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter postal code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                        >
                            Continue to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
