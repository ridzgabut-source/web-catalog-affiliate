import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PublicHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline font-bold text-xl text-primary tracking-tight leading-none">
                KoleksiKita
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                Katalog Afiliasi
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-headline transition-colors ${
                isActive('/') && location.search === ''
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary font-medium'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/catalog"
              className={`text-sm font-headline transition-colors ${
                isActive('/catalog') && !location.search.includes('featured=true')
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary font-medium'
              }`}
            >
              Katalog Lengkap
            </Link>
            <Link
              to="/catalog?featured=true"
              className={`text-sm font-headline transition-colors ${
                location.search.includes('featured=true')
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary font-medium'
              }`}
            >
              Rekomendasi Pilihan
            </Link>
          </nav>
        </div>

        {/* Right Controls: Search & Admin Link */}
        <div className="flex items-center gap-3">
          {/* Quick Search Form */}
          <form onSubmit={handleSearch} className="relative hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk kurasi..."
              className="w-48 lg:w-64 h-10 pl-9 pr-4 bg-surface-container-low text-on-surface placeholder:text-slate-400 text-xs rounded-full border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </form>

          {/* Admin Login / Dashboard Shortcut */}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold font-headline bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Kelola Katalog"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAuthenticated ? 'dashboard' : 'admin_panel_settings'}
            </span>
            <span>{isAuthenticated ? 'Admin Panel' : 'Masuk Admin'}</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menu navigasi"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="relative flex items-center mb-2">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 pointer-events-none text-[18px]">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk kurasi..."
              className="w-full h-10 pl-9 pr-4 bg-slate-100 text-on-surface text-sm rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none"
            />
          </form>

          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-headline ${
                isActive('/') && location.search === ''
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-headline ${
                isActive('/catalog') && !location.search.includes('featured=true')
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Katalog Lengkap
            </Link>
            <Link
              to="/catalog?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-headline ${
                location.search.includes('featured=true')
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Rekomendasi Pilihan
            </Link>
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-headline text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{isAuthenticated ? 'Admin Panel' : 'Masuk Admin'}</span>
              <span className="material-symbols-outlined text-[18px] text-slate-400">arrow_forward</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
