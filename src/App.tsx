import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderFailedPage } from './pages/OrderFailedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminAddProduct } from './pages/admin/AdminAddProduct';
import { AdminEditProduct } from './pages/admin/AdminEditProduct';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetails } from './pages/admin/AdminOrderDetails';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminSettings } from './pages/admin/AdminSettings';

import { seedInitialProducts } from './services/productService';

export const App: React.FC = () => {
  useEffect(() => {
    // Seed initial catalogue for immediate preview if empty
    seedInitialProducts();
  }, []);

  return (
    <Routes>
      {/* 1. Customer WhatsApp Commerce Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/p/:slug" element={<ProductPage />} />
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      <Route path="/order-confirmed/:orderId" element={<OrderSuccessPage />} />
      <Route path="/order-failed" element={<OrderFailedPage />} />

      {/* 2. Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 3. Protected Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminAddProduct />} />
        <Route path="products/:id/edit" element={<AdminEditProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 4. 404 Not Found Route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
