import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check connection.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google Server Login Error:', err);
            setError(err.response?.data?.message || 'Google Login Failed on Server');
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 px-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue your sustainable journey</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-green-600 focus:ring-green-500 border-gray-300 mr-2" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">Forgot password?</Link>
                    </div>

                    <button type="submit" className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 hover:scale-[1.02] transition-all">
                        Sign In
                    </button>

                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.error('Google Login Failed');
                                setError('Google Login Failed');
                            }}
                            useOneTap
                            containerProps={{
                                style: { width: '100%' }
                            }}
                        />
                    </div>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-green-600 hover:text-green-700">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
