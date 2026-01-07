import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'consumer' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/dashboard');
        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 px-4">
            <div className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Join EcoMarketPlus</h1>
                    <p className="text-gray-500">Start your sustainable journey today</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" type="email"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" type="password"
                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option value="consumer">Conscious Consumer</option>
                            <option value="seller">Eco-friendly Business</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 hover:scale-[1.02] transition-all mt-4">
                        Register
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="font-bold text-green-600">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
