import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ProductCard, { formatRupiah } from '../../components/catalog/ProductCard.jsx';
import StickyAffiliateBar from '../../components/catalog/StickyAffiliateBar.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);

          // Fetch related products in same category
          const relatedRes = await productApi.getProducts({
            category: res.data.category_id,
            limit: 3,
          });
          if (relatedRes.success) {
            setRelatedProducts(
              relatedRes.data.items.filter((p) => p.id !== res.data.id)
            );
          }
        } else {
          setError(res.message || 'Produk tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
        setError('Gagal memuat detail produk.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 aspect-square bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/2" />
            <div className="h-32 bg-slate-100 rounded-2xl" />
            <div className="h-12 bg-slate-200 rounded-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h2 className="text-xl font-bold font-headline text-on-surface">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-sm text-on-surface-variant">
          Produk yang Anda cari mungkin telah dinonaktifkan atau tautannya telah berubah.
        </p>
        <Button as={Link} to="/catalog" variant="primary" size="md">
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const marketplaceLabel = product.marketplace_type === 'shopee'
    ? 'Beli di Shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'Beli di Tokopedia'
    : 'Beli di Marketplace Resmi';

  const marketplaceVariant = product.marketplace_type === 'shopee'
    ? 'shopee'
    : product.marketplace_type === 'tokopedia'
    ? 'tokopedia'
    : 'primary';

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-16 space-y-12">
      {/* 1. Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
        <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/catalog" className="hover:text-primary transition-colors">Katalog</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link
          to={`/catalog?category=${product.category_id}`}
          className="hover:text-primary transition-colors whitespace-nowrap"
        >
          {product.category_name}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-800 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Product Showcase (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6">
          <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-elevation-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.is_featured && <Badge variant="featured" size="md" />}
              {hasDiscount && (
                <Badge variant="discount" size="md">
                  Hemat {discountPercent}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Information & Outbound Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <Badge variant="category" size="md">
              {product.category_name}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing Block */}
          <div className="p-5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-1">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider font-headline">
              Harga Rekomendasi
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-headline font-bold text-3xl text-primary tnum tracking-tight">
                {formatRupiah(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through tnum">
                  {formatRupiah(product.original_price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              *Harga dapat berubah sewaktu-waktu tergantung promo dan diskon di platform marketplace.
            </p>
          </div>

          {/* Primary Outbound Action Buttons (Desktop & Tablet) */}
          <div className="space-y-3 pt-2">
            <Button
              as="a"
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              variant={marketplaceVariant}
              size="lg"
              className="w-full text-center shadow-md hover:shadow-lg"
              icon="open_in_new"
              iconPosition="right"
            >
              {marketplaceLabel}
            </Button>
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>Anda diarahkan langsung ke toko resmi terverifikasi</span>
            </p>
          </div>

          {/* Description Section */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold font-headline text-on-surface">
              Ulasan Kurator
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Matrix Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold font-headline text-on-surface">
                Spesifikasi Utama
              </h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                      >
                        <td className="py-3 px-4 text-xs font-semibold text-slate-500 w-1/3">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-slate-900 tnum">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Affiliate Disclosure Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg shrink-0 mt-0.5">
              info
            </span>
            <p className="leading-relaxed">
              <strong>Transparansi Afiliasi:</strong> Tautan pembelian di halaman ini mengarahkan Anda ke toko resmi di marketplace mitra. Kami mungkin menerima sedikit komisi jika Anda membeli, tanpa mengubah harga barang bagi Anda.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-headline text-on-surface">
              Produk Terkait Lainnya
            </h2>
            <Link
              to={`/catalog?category=${product.category_id}`}
              className="text-xs font-semibold font-headline text-primary hover:underline"
            >
              Lihat Kategori Ini →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Mobile Sticky Bottom Affiliate CTA Bar */}
      <StickyAffiliateBar product={product} />
    </div>
  );
}
