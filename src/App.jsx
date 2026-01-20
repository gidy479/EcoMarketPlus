import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import WalletPage from './pages/WalletPage';
import FinancePage from './pages/FinancePage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/finance" element={<FinancePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/placeorder" element={<PlaceOrderPage />} />
                  <Route path="/order/:id" element={<OrderPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/add-product" element={<AddProductPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
