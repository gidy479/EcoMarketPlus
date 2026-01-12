import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed w-full top-0 z-50 glass-nav bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-500 hover:to-teal-400 transition-all">
                        EcoMarketPlus+
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Marketplace</Link>
                                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Dashboard</Link>
                                <Link to="/finance" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Finance</Link>
                                <Link to="/profile" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Profile</Link>
                                <Link to="/wallet" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Wallet</Link>
                                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 font-medium transition-colors">
                                    Logout
                                </button>
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                                    {user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Marketplace</Link>
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="px-5 py-2.5 rounded-full text-green-700 font-medium hover:bg-green-50 transition-all">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all">
                                        Get Started
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-600 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col border-t border-gray-100 pt-4 animate-fade-in-down">
                        <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                <Link to="/finance" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>Finance</Link>
                                <Link to="/profile" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                <Link to="/wallet" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>Wallet</Link>
                                <button onClick={handleLogout} className="text-left text-red-500 font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-center w-full px-5 py-2.5 rounded-xl text-green-700 font-medium bg-green-50 hover:bg-green-100 transition-all" onClick={() => setIsMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/register" className="block text-center w-full px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all" onClick={() => setIsMenuOpen(false)}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default AppHeader;

export function AppHeader() {
    return <Header />
}
