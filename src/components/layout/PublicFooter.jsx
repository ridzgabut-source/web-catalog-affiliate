import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-slate-200 mt-16 sm:mt-24 pb-20 sm:pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top Footer: Brand, Links, & Affiliate Disclosure Alert */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
              </div>
              <span className="font-headline font-bold text-xl text-primary tracking-tight">
                KoleksiKita
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Katalog kurasi independen yang menampilkan barang-barang terbaik pilihan kami. Kami menghubungkan Anda langsung ke toko resmi terverifikasi di Shopee, Tokopedia, dan marketplace terkemuka lainnya.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-headline font-semibold text-sm text-on-surface uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary transition-colors">Katalog Lengkap</Link>
              </li>
              <li>
                <Link to="/catalog?featured=true" className="hover:text-primary transition-colors">Produk Rekomendasi</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-primary transition-colors">Portal Admin</Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Transparency Box (PRD Section 10) */}
          <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-elevation-1 space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-headline font-semibold text-sm">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Transparansi Afiliasi</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Beberapa link di website ini merupakan affiliate link. Kami dapat menerima komisi apabila Anda melakukan pembelian melalui link tersebut, <strong>tanpa ada biaya tambahan apapun bagi Anda</strong>. Kami hanya merekomendasikan produk berkualitas tinggi dengan ulasan terpercaya.
            </p>
          </div>
        </div>

        {/* Bottom Footer: Copyright & Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KoleksiKita. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Platform Katalog Independen</span>
            <span>•</span>
            <span className="text-slate-400">Bukan E-commerce / Marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
