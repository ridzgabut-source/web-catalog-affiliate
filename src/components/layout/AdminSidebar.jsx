import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast('Berhasil logout dari Admin Panel.', 'info');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: 'dashboard',
      exact: true,
    },
    {
      label: 'Manajemen Produk',
      path: '/admin/products',
      icon: 'inventory_2',
      exact: false,
    },
    {
      label: 'Manajemen Kategori',
      path: '/admin/categories',
      icon: 'category',
      exact: false,
    },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo in Admin */}
          <div className="h-16 sm:h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-headline font-bold text-base text-primary leading-tight">
                  KoleksiKita
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-headline transition-all duration-150 ${
                    active
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-on-surface font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${active ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Outbound/Logout Links */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-headline font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>Lihat Website Publik</span>
            </div>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-bold text-on-surface truncate">
                  {user?.name || 'Admin Owner'}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user?.email || 'admin@koleksikita.com'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Keluar dari sesi admin"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
