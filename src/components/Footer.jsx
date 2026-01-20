import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <p>&copy; 2026 EcoMarketPlus. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-gray-400">Privacy</a>
                    <a href="#" className="hover:text-gray-400">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
