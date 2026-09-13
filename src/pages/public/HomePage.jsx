import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import { categoryApi } from '../../api/categoryApi.js';
import ProductCard from '../../components/catalog/ProductCard.jsx';
import CategoryPills from '../../components/catalog/CategoryPills.jsx';
import { ProductCardSkeleton } from '../../components/common/Skeleton.jsx';
import Button from '../../components/common/Button.jsx';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';

export default function HomePage() {
  useDocumentMeta({
    title: 'KoleksiKita - Kurasi Produk Pilihan Terbaik',
    description: 'Temukan rekomendasi produk pilihan terbaik dengan ulasan terpercaya dan tautan resmi Shopee & Tokopedia.',
    image: '/images/og/og-koleksikita.webp',
  });

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getProducts({ featured: true, limit: 6 }),
          categoryApi.getCategories(),
        ]);

        if (prodRes.success) {
          setFeaturedProducts(prodRes.data.items);
        }
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategorySelect = (slug) => {
    if (!slug) {
      navigate('/catalog');
    } else {
      navigate(`/catalog?category=${slug}`);
    }
  };

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-high text-primary font-headline font-bold text-xs uppercase tracking-wider border border-primary/10">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Katalog Kurasi Mandiri</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headline text-on-surface tracking-tight leading-[1.15]">
            Katalog Produk Pilihan Berkualitas
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Daftar rekomendasi barang terbaik yang kami kurasi dengan cermat. Klik produk untuk langsung cek harga dan bertransaksi di marketplace resmi tanpa ribet.
          </p>

          {/* Quick Category Pills */}
          <div className="pt-3 flex justify-center">
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section ("Kurasi Produk Minggu Ini") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-on-surface">
                Kurasi Produk Minggu Ini
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Dipilih berdasarkan kualitas material, ulasan objektif, dan reputasi toko resmi.
            </p>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-sm font-headline font-semibold text-primary hover:text-primary-dark transition-colors self-start sm:self-auto"
          >
            <span>Buka Katalog Lengkap</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Product Cards Grid: 2-col on mobile, 3-col on desktop */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button
            as={Link}
            to="/catalog"
            variant="outline"
            size="lg"
            icon="apps"
          >
            Lihat Semua Koleksi Produk
          </Button>
        </div>
      </section>

      {/* 3. Educational Callout Banner ("Bagaimana Katalog Ini Bekerja?") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-low rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-container-high shadow-elevation-1">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-2xl">info</span>
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="text-base sm:text-lg font-bold font-headline text-on-surface">
                Bagaimana Katalog Ini Bekerja?
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl">
                Kami menguji dan mengkurasi barang berkualitas tinggi secara independen. Ketika Anda tertarik pada produk, tombol kami mengarahkan Anda ke toko resmi terverifikasi di Shopee dan Tokopedia. Anda tetap bertransaksi aman langsung di platform resmi pilihan Anda.
              </p>
            </div>
          </div>

          <Button
            as={Link}
            to="/catalog"
            variant="primary"
            size="md"
            className="shrink-0 whitespace-nowrap"
            icon="arrow_forward"
            iconPosition="right"
          >
            Mulai Belanja
          </Button>
        </div>
      </section>
    </div>
  );
}
