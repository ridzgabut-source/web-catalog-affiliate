import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';

export default function NotFoundPage() {
  useDocumentMeta({
    title: '404 Halaman Tidak Ditemukan | KoleksiKita',
    description: 'Halaman yang Anda cari tidak dapat ditemukan di KoleksiKita.',
  });

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-4xl">search_off</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-headline text-on-surface">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Halaman yang Anda tuju tidak tersedia atau tautan mungkin sudah usang.
        </p>
      </div>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Button as={Link} to="/" variant="primary" size="md" icon="home">
          Ke Beranda
        </Button>
        <Button as={Link} to="/catalog" variant="outline" size="md" icon="category">
          Buka Katalog
        </Button>
      </div>
    </div>
  );
}
