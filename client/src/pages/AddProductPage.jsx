import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        countInStock: '',
        materials: '',
        productionMethod: '',
        certification: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                image: formData.image,
                category: formData.category,
                countInStock: parseInt(formData.countInStock),
                ecoCredentials: {
                    materials: formData.materials,
                    productionMethod: formData.productionMethod,
                    certification: formData.certification
                }
            };

            await axios.post(`${API_URL}/api/products`, productData, config);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Eco-Product</h1>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (GHS)</label>
                            <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Count In Stock</label>
                            <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.countInStock} onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea required rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product... Mention materials, production, etc." />
                    </div>

                    {/* Eco Credentials */}
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <h3 className="text-lg font-bold text-green-800 mb-4">Eco Credentials (for AI Verification)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-green-900 mb-2">Materials (e.g., Organic Cotton, Recycled Plastic)</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.materials} onChange={(e) => setFormData({ ...formData, materials: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-900 mb-2">Production Method (e.g., Solar Powered, Handmade)</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.productionMethod} onChange={(e) => setFormData({ ...formData, productionMethod: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-900 mb-2">Certifications (e.g., GOTS, Fair Trade)</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.certification} onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                    placeholder="Enter any recognized certifications..." />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:bg-green-700 hover:scale-[1.02] transition-all disabled:opacity-50">
                        {loading ? 'Verifying & Creating...' : 'Submit Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
