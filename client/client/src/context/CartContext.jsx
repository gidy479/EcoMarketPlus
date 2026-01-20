import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        setCartItems(prevItems => {
            const existItem = prevItems.find(x => x._id === product._id);
            if (existItem) {
                return prevItems.map(x =>
                    x._id === existItem._id ? { ...existItem, qty: existItem.qty + qty } : x
                );
            } else {
                return [...prevItems, { ...product, qty }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(x => x._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
