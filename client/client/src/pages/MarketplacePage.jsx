import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config';

const MarketplacePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/products?pageNumber=${page}`);
                setProducts(data.products || data);
                setTotalPages(data.pages || 1);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Eco-Marketplace</h1>
                        <p className="text-gray-600">Discover products that are good for you and the planet.</p>
                    </div>
                    {/* Mock Filter Buttons */}
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">Filter</button>
                        <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">Sort by: Eco-Score</button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : error ? (
                    <div className="text-red-600 text-center py-20">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && (
                    <div className="flex justify-center mt-12 gap-4">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-lg border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-lg border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;
