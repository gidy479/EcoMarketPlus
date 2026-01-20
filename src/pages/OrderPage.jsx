import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const OrderPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };
                const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    if (loading) return <div className="pt-32 text-center text-xl">Loading...</div>;
    if (error) return <div className="pt-32 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-green-600">{order.user.email}</a></p>
                            <p className="mt-2">
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">Delivered on {order.deliveredAt}</div>
                            ) : (
                                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">Not Delivered</div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <p><strong>Method: </strong> {order.paymentMethod}</p>
                            {order.isPaid ? (
                                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">Paid on {order.paidAt?.substring(0, 10)}</div>
                            ) : (
                                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">Not Paid</div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                                <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-green-600">{item.name}</Link>
                                            </div>
                                            <div className="text-gray-600">
                                                {item.qty} x GHS {item.price} = <span className="font-bold text-gray-900">GHS {item.qty * item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-green-500/5 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items</span>
                                    <span>GHS {order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>GHS {order.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>GHS {order.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>GHS {order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
