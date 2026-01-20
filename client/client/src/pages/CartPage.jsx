import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
                        <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                        <Link to="/marketplace" className="text-green-600 font-bold hover:underline">Go Shopping</Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-900 hover:text-green-600">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-gray-500">{item.category}</div>
                                        <div className="font-bold text-gray-900 mt-1">GHS {item.price} x {item.qty}</div>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="md:w-1/3">
                            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-green-500/5 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                                <div className="flex justify-between mb-2 text-gray-600">
                                    <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span>GHS {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-6 text-gray-600">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900 mb-6">
                                    <span>Subtotal</span>
                                    <span>GHS {subtotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={checkoutHandler}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
