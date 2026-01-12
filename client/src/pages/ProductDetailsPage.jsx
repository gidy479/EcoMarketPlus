import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Product not found');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="pt-32 text-center">Loading...</div>;
    if (error) return <div className="pt-32 text-center text-red-600">{error}</div>;

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <Link to="/marketplace" className="text-sm text-gray-500 hover:text-green-600 mb-6 inline-block">← Back to Marketplace</Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="h-96 md:h-[500px] bg-gray-200 rounded-3xl overflow-hidden relative">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-6xl text-gray-400 bg-gray-100">🛍️</div>
                        )}
                        <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600">{product.ecoScore}</span>
                            <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Eco-Score</span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg text-xs uppercase tracking-wider mb-2">
                                {product.category || 'General'}
                            </span>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            {product.isVerified && (
                                <div className="flex items-center text-green-600 gap-1 text-sm font-medium">
                                    <span>✓ Verified Eco-Friendly</span>
                                </div>
                            )}
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mb-6">₵ {product.price}</div>

                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {product.description}
                        </p>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 mb-8">
                            <h3 className="text-lg font-bold text-green-800 mb-4">Verification Report</h3>
                            <ul className="space-y-2">
                                {product.verificationReport && product.verificationReport.length > 0 ? (
                                    product.verificationReport.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                            <span className="text-green-500 mt-1">✓</span>
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-sm">No details available.</li>
                                )}
                            </ul>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200">
                                Add to Cart
                            </button>
                            <button className="px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                                ♡
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
