import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminHeader({ onToggleSidebar, title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Buka menu admin"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-headline text-on-surface leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Single-Owner Admin</span>
        </div>
      </div>
    </header>
  );
}
