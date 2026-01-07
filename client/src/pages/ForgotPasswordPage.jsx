import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(data.data);

            // DEV ONLY: Show link
            if (data.devLink) {
                setMessage(prev => (
                    <div>
                        {prev} <br />
                        <a href={data.devLink} className="underline font-bold text-blue-600">
                            [DEV MODE] Click here to Reset Password
                        </a>
                    </div>
                ));
            }
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-500">Enter your email to receive a reset link</p>
                </div>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
