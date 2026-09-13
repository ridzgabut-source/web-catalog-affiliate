import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/' && location.search === '') return true;
    if (path === '/catalog' && location.pathname === '/catalog' && !location.search.includes('featured=true')) return true;
    if (path === '/featured' && location.search.includes('featured=true')) return true;
    if (path === '/admin' && location.pathname.startsWith('/admin')) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] px-2 py-1.5 flex items-center justify-around">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors ${
          isActive('/') ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isActive('/') ? 'fill' : ''}`}>
          home
        </span>
        <span className="text-[10px] font-headline font-semibold mt-0.5">Beranda</span>
      </Link>

      <Link
        to="/catalog"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors ${
          isActive('/catalog') ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isActive('/catalog') ? 'fill' : ''}`}>
          category
        </span>
        <span className="text-[10px] font-headline font-semibold mt-0.5">Katalog</span>
      </Link>

      <Link
        to="/catalog?featured=true"
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors ${
          isActive('/featured') ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isActive('/featured') ? 'fill' : ''}`}>
          hotel_class
        </span>
        <span className="text-[10px] font-headline font-semibold mt-0.5">Pilihan</span>
      </Link>

      <Link
        to={isAuthenticated ? '/admin' : '/admin/login'}
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors ${
          isActive('/admin') ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isActive('/admin') ? 'fill' : ''}`}>
          manage_accounts
        </span>
        <span className="text-[10px] font-headline font-semibold mt-0.5">Admin</span>
      </Link>
    </nav>
  );
}
