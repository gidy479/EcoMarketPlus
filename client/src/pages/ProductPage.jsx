import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    if (loading) return <div className="pt-32 text-center text-xl">Loading...</div>;
    if (!product) return <div className="pt-32 text-center text-xl">Product not found.</div>;


    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-xl shadow-green-500/5 overflow-hidden">
                    {/* Image Section */}
                    <div className="md:w-1/2 rounded-2xl overflow-hidden bg-gray-100 relative group h-96">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 text-6xl">🛍️</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm uppercase tracking-wide">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{product.ecoScore}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest">Eco-Score</div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

                        {/* Eco Credentials */}
                        <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-4">Sustainability Profile</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-green-100 pb-2">
                                    <span className="text-green-700">Materials</span>
                                    <span className="font-semibold text-green-900 text-right">{product.ecoCredentials?.materials || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-green-100 pb-2">
                                    <span className="text-green-700">Production</span>
                                    <span className="font-semibold text-green-900 text-right">{product.ecoCredentials?.productionMethod || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Certification</span>
                                    <span className="font-semibold text-green-900 text-right">{product.ecoCredentials?.certification || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-auto">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Quantity</label>
                                <select
                                    className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                >
                                    {[...Array(product.countInStock > 0 ? product.countInStock : 0).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-4xl font-bold text-gray-900">GHS {product.price}</div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-gray-200 ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-green-600'}`}
                            >
                                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
