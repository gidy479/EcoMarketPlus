import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="pt-24 min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 md:py-24 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6 animate-fade-in-up">
                    Driving the Green Economy
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Sustainable Shopping. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                        Smart Finance.
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join the ecosystem where every purchase tracks your carbon footprint and builds your financial future.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Link to="/marketplace" className="px-8 py-4 rounded-full bg-green-600 text-white font-bold text-lg shadow-xl shadow-green-500/20 hover:bg-green-700 hover:scale-105 transition-all">
                        Explore Marketplace
                    </Link>
                    <Link to="/register" className="px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-lg shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-105 transition-all">
                        Join Community
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Verified Eco-Friendly"
                        desc="Eliminate greenwashing. Every product is vetted for materials, production, and lifecycle impact."
                        icon="🌿"
                    />
                    <FeatureCard
                        title="Integrated Wallet"
                        desc="Manage payments seamlessly. Track spending habits and set sustainability goals."
                        icon="💳"
                    />
                    <FeatureCard
                        title="AI Actions"
                        desc="Receive personalized insights to optimize your budget and reduce your carbon footprint."
                        icon="🤖"
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ title, desc, icon }) => (
    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all">
        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default HomePage;
