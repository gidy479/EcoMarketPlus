import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="relative h-64 bg-gray-100 overflow-hidden">
                {/* Image */}
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🛍️</span>
                    </div>
                )}

                {/* Eco Score Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span className="text-sm font-bold text-green-600">{product.ecoScore}</span>
                    <span className="text-xs text-gray-500">Eco-Score</span>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        {product.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex justify-between items-end mt-4">
                    <span className="text-2xl font-bold text-gray-900">₵{product.price}</span>
                    <Link to={`/product/${product._id}`} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
