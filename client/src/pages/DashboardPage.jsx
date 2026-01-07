import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) return <div className="pt-32 text-center">Loading...</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                <div className="bg-white p-8 rounded-3xl shadow-lg shadow-green-500/10 border border-green-100 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, <span className="text-green-600">{user.name}</span></h2>
                    <p className="text-gray-600">Account Type: <span className="uppercase font-bold tracking-wider text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md ml-2">{user.role}</span></p>
                </div>

                {user.role === 'seller' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Your Products</h3>
                            <p className="text-gray-600 mb-4">You have {user.products?.length || 'active'} listings.</p>
                            <Link to="/add-product" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 inline-block">
                                Add New Product
                            </Link>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Sales Overview</h3>
                            <div className="text-3xl font-bold text-gray-900 mb-2">GHS 450.00</div>
                            <p className="text-gray-500">Total Revenue</p>
                        </div>
                    </div>
                )}

                {user.role === 'consumer' && (
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4">My Orders</h3>
                        {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
                            <p className="text-gray-600">No active orders yet. Start exploring the marketplace!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="pb-3 font-semibold text-gray-600">ID</th>
                                            <th className="pb-3 font-semibold text-gray-600">Date</th>
                                            <th className="pb-3 font-semibold text-gray-600">Total</th>
                                            <th className="pb-3 font-semibold text-gray-600">Paid</th>
                                            <th className="pb-3 font-semibold text-gray-600">Delivered</th>
                                            <th className="pb-3 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 text-sm text-gray-900">{order._id.substring(0, 10)}...</td>
                                                <td className="py-4 text-sm text-gray-600">{order.createdAt.substring(0, 10)}</td>
                                                <td className="py-4 font-bold text-gray-900">GHS {order.totalPrice.toFixed(2)}</td>
                                                <td className="py-4">
                                                    {order.isPaid ? <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Paid</span> : <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-1 rounded">Not Paid</span>}
                                                </td>
                                                <td className="py-4">
                                                    {order.isDelivered ? <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Delivered</span> : <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-1 rounded">Pending</span>}
                                                </td>
                                                <td className="py-4">
                                                    <Link to={`/order/${order._id}`} className="text-green-600 hover:text-green-800 font-medium text-sm">
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
