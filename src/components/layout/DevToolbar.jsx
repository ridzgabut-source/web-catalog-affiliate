import React, { useState } from 'react';
import { apiClient } from '../../api/apiClient.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const handleReset = () => {
    const res = apiClient.resetMockData();
    showToast(res.message, 'success');
    setIsOpen(false);
    // Reload after a brief pause so user sees the change refreshed
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isOpen && (
        <div className="mb-2 p-4 bg-slate-900 text-white rounded-2xl shadow-elevation-3 border border-slate-800 w-72 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold font-headline uppercase tracking-wider text-slate-300">
                Dev Testing Tools
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Penyimpanan: <strong className="text-slate-200">LocalStorage (Mock API)</strong>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Login Demo: <strong className="text-slate-200">admin@koleksikita.com</strong> / <strong className="text-slate-200">admin123</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={handleReset}
              className="w-full py-2 px-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 text-xs font-semibold rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Data ke Mock Awal</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold py-2 px-3.5 rounded-full shadow-elevation-2 backdrop-blur-sm border border-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95"
        title="Buka panel bantuan testing"
      >
        <span className="material-symbols-outlined text-[16px] text-emerald-400">tune</span>
        <span>DEV MODE</span>
      </button>
    </div>
  );
}
