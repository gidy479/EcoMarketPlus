import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const { user } = useAuth();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div className="pt-32 text-center">Loading Profile...</div>;
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            await axios.put('http://localhost:5000/api/auth/profile', {
                name,
                avatar: avatarUrl
            }, config);

            window.location.reload();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
            setEditing(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-center relative group">
                            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl text-green-600 font-bold mb-4 border-4 border-white shadow-md overflow-hidden relative">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>

                            {editing && (
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Avatar URL</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Paste an image URL</p>
                                </div>
                            )}

                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    {/* Details / Stats */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Account Details</h3>
                                {!editing ? (
                                    <button onClick={() => setEditing(true)} className="text-green-600 font-bold text-sm hover:underline">Edit</button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button onClick={() => setEditing(false)} className="text-gray-500 font-bold text-sm hover:underline">Cancel</button>
                                        <button onClick={handleUpdate} disabled={loading} className="text-green-600 font-bold text-sm hover:underline">
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                    {editing ? (
                                        <input className="w-full p-3 bg-gray-50 rounded-xl border focus:ring-green-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.name}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-medium">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Role Specific Actions */}
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-3xl border border-green-100">
                            <h3 className="text-xl font-bold text-green-900 mb-4">
                                {user.role === 'seller' ? 'Seller Hub' : 'Shopping Activity'}
                            </h3>

                            {user.role === 'seller' ? (
                                <div>
                                    <p className="text-gray-600 mb-4">Manage your eco-friendly products and view sales performance.</p>
                                    <div className="flex space-x-4">
                                        <Link to="/dashboard" className="px-5 py-2 bg-green-600 text-white rounded-xl font-bold shadow-green-200 shadow-lg hover:bg-green-700 transition">Go to Dashboard</Link>
                                        <Link to="/add-product" className="px-5 py-2 bg-white text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-50 transition">List New Product</Link>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-600 mb-4">Track your orders and view your purchase history.</p>
                                    <div className="flex space-x-4">
                                        <Link to="/dashboard" className="px-5 py-2 bg-green-600 text-white rounded-xl font-bold shadow-green-200 shadow-lg hover:bg-green-700 transition">View My Orders</Link>
                                        <Link to="/marketplace" className="px-5 py-2 bg-white text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-50 transition">Continue Shopping</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
