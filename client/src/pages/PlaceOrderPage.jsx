import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';
import { API_URL } from '../config';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping over 500
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% Tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
    const paymentMethod = localStorage.getItem('paymentMethod');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [navigate, shippingAddress, paymentMethod]);

    // Paystack Configuration
    const publicKey = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // REPLACE WITH REAL KEY
    // Using a placeholder key for now. In production, this should be in .env

    const componentProps = {
        email: user?.email,
        amount: totalPrice * 100, // Paystack is in kobo/pesewas
        metadata: {
            name: user?.name,
            phone: '0500000000', // Should come from user profile
        },
        publicKey,
        text: 'Pay Now',
        onSuccess: (reference) => handlePaystackSuccess(reference),
        onClose: () => alert('Transaction Cancelled'),
    };

    const handlePaystackSuccess = async (reference) => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    ...item,
                    product: item._id
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                paymentResult: {
                    id: reference.reference,
                    status: 'success',
                    update_time: String(Date.now()),
                    email_address: user.email,
                },
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored
                },
            };

            // Create Order in Backend
            const { data } = await axios.post(`${API_URL}/api/orders`, orderData, config);

            // Clear Cart and Redirect
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert('Order creation failed');
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold mb-8">Review Your Order</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Shipping</h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold text-gray-900">Address: </span>
                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <p className="text-gray-600 mb-1">
                                <span className="font-semibold text-gray-900">Method: </span>
                                {paymentMethod}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                                <div className="space-y-4">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                                <Link to={`/product/${item._id}`} className="font-medium text-gray-900 hover:text-green-600">{item.name}</Link>
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
                                    <span>GHS {itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>GHS {shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>GHS {taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>GHS {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Paystack Button Placeholder - User needs to provide Public Key */}
                            {paymentMethod === 'Wallet' ? (
                                <button
                                    onClick={() => handlePaystackSuccess({ reference: 'WAL-' + Date.now() })} // Reusing success handler as backend handles wallet deduction
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Pay with Wallet (GHS {totalPrice.toFixed(2)})
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePaystackSuccess({ reference: 'mock_ref_' + Date.now() })}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Place Order (Mock Payment)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
