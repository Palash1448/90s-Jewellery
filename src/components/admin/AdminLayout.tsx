import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#BA9541]/30 border-t-[#BA9541] rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-[#73685C]">Verifying admin authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Determine Title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return { title: 'Dashboard Overview', sub: 'Performance, sales volume & analytics' };
    if (path === '/admin/products') return { title: 'Products Catalog', sub: 'Manage products, stock levels & links' };
    if (path === '/admin/products/new') return { title: 'Add New Product', sub: 'Create product with automated WhatsApp links' };
    if (path.includes('/admin/products/') && path.includes('/edit')) return { title: 'Edit Product', sub: 'Update pricing, images & details' };
    if (path === '/admin/orders') return { title: 'Orders Management', sub: 'Track customer orders & payments' };
    if (path.includes('/admin/orders/')) return { title: 'Order Details', sub: 'Customer, address snapshots & fulfillment timeline' };
    if (path === '/admin/customers') return { title: 'Customer Directory', sub: 'Customer lifetime values & WhatsApp contacts' };
    if (path === '/admin/settings') return { title: 'Store Settings', sub: 'Brand profile, shipping rules & templates' };
    return { title: 'Admin Console', sub: '90s chya athavani Admin' };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#191512]">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={title}
          subtitle={sub}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
