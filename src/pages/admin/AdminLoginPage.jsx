import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Input } from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { DEMO_ADMIN } from '../../api/mockData.js';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, navigate to admin dashboard
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        showToast(res.message, 'success');
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <span className="font-headline font-bold text-2xl text-primary tracking-tight">
              KoleksiKita
            </span>
          </Link>
          <h2 className="text-xl font-bold font-headline text-on-surface">
            Admin / Owner Login
          </h2>
          <p className="text-xs text-on-surface-variant">
            Masuk untuk mengelola katalog produk dan kategori afiliasi Anda.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-elevation-2 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Admin"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@koleksikita.com"
              icon="mail"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon="lock"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-md"
                isLoading={loading}
                icon="login"
              >
                Masuk ke Admin
              </Button>
            </div>
          </form>

          {/* 1-Click Demo Credentials Helper */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary">key</span>
                <span>Akun Demo Pengujian:</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                admin@koleksikita.com / admin123
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-primary font-bold hover:bg-primary/5 transition-all text-xs"
              >
                Isi Otomatis Kredensial Demo
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Website Publik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
