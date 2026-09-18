import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin material-symbols-outlined text-4xl text-primary">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-slate-500 font-headline uppercase tracking-wider">
            Memuat Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  // Protected route enforcement
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Dynamic header titles based on pathname
  let pageTitle = 'Dashboard Ringkasan';
  let pageSubtitle = 'Pantau performa katalog produk dan kategori Anda.';
  if (location.pathname.startsWith('/admin/products')) {
    pageTitle = 'Manajemen Produk';
    pageSubtitle = 'Kelola daftar produk afiliasi, status aktif, dan tautan marketplace.';
  } else if (location.pathname.startsWith('/admin/categories')) {
    pageTitle = 'Manajemen Kategori';
    pageSubtitle = 'Kelola pengelompokan produk dan pantau jumlah item per kategori.';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar & Mobile Drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          title={pageTitle}
          subtitle={pageSubtitle}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
