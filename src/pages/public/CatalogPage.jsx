import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import { categoryApi } from '../../api/categoryApi.js';
import ProductCard from '../../components/catalog/ProductCard.jsx';
import FilterSidebar from '../../components/catalog/FilterSidebar.jsx';
import FilterDrawer from '../../components/catalog/FilterDrawer.jsx';
import SearchBar from '../../components/catalog/SearchBar.jsx';
import Pagination from '../../components/catalog/Pagination.jsx';
import { ProductCardSkeleton } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const featuredParam = searchParams.get('featured') === 'true';

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 6, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Dynamic document meta based on active filter
  const currentCategoryName = categories.find((c) => c.slug === categoryParam || c.id === categoryParam)?.name;
  useDocumentMeta({
    title: currentCategoryName
      ? `Katalog ${currentCategoryName} | KoleksiKita`
      : searchParam
      ? `Pencarian "${searchParam}" | KoleksiKita`
      : 'Katalog Produk Pilihan | KoleksiKita',
    description: 'Jelajahi seluruh katalog produk pilihan, filter berdasarkan kategori dan harga terbaik dari Shopee & Tokopedia.',
    image: '/images/og/og-koleksikita.webp',
  });

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      const res = await categoryApi.getCategories();
      if (res.success) setCategories(res.data);
    }
    loadCategories();
  }, []);

  // Fetch products whenever params change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({
        category: categoryParam,
        search: searchParam,
        sort: sortParam,
        page: pageParam,
        per_page: 6,
        featured: featuredParam ? 'true' : null,
      });

      if (res.success) {
        setProducts(res.data.items);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching catalog products:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, sortParam, pageParam, featuredParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update query params helper
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        updated.delete(key);
      } else {
        updated.set(key, String(value));
      }
    });
    setSearchParams(updated);
  };

  const handleSearchChange = (query) => {
    updateParams({ search: query, page: 1 });
  };

  const handleCategoryChange = (slug) => {
    updateParams({ category: slug, page: 1 });
  };

  const handleSortChange = (sort) => {
    updateParams({ sort, page: 1 });
  };

  const handleToggleFeatured = (featured) => {
    updateParams({ featured, page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(categoryParam || searchParam || sortParam !== 'newest' || featuredParam);

  // Find active category label
  const activeCategoryObj = categories.find(c => c.slug === categoryParam);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-on-surface">
          Katalog Produk Terkurasi
        </h1>
        <p className="text-sm text-on-surface-variant max-w-2xl">
          Temukan produk terbaik berdasarkan kategori, harga, dan rekomendasi khusus tanpa perlu repot mencari satu per satu.
        </p>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Desktop Sidebar Filter (4 cols on 12-col grid) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterSidebar
            categories={categories}
            selectedCategory={categoryParam}
            onSelectCategory={handleCategoryChange}
            selectedSort={sortParam}
            onSelectSort={handleSortChange}
            isFeaturedOnly={featuredParam}
            onToggleFeatured={handleToggleFeatured}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Right Column: Search Bar, Mobile Filter Trigger, Grid, and Pagination */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search & Mobile Filter Bar */}
          <div className="flex items-center gap-3">
            <SearchBar
              value={searchParam}
              onChange={handleSearchChange}
              placeholder="Cari nama produk atau deskripsi..."
              className="flex-1"
            />

            {/* Mobile Filter Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden shrink-0"
              icon="tune"
            >
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary ml-1" />
              )}
            </Button>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400">Filter Aktif:</span>

              {activeCategoryName && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  <span>Kategori: {activeCategoryName}</span>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="hover:text-primary-dark"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {searchParam && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  <span>Pencarian: "{searchParam}"</span>
                  <button
                    onClick={() => handleSearchChange('')}
                    className="hover:text-black"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {featuredParam && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  <span>Hanya Unggulan</span>
                  <button
                    onClick={() => handleToggleFeatured(false)}
                    className="hover:text-amber-900"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              {sortParam !== 'newest' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  <span>
                    Urut: {sortParam === 'price_asc' ? 'Termurah' : 'Termahal'}
                  </span>
                  <button
                    onClick={() => handleSortChange('newest')}
                    className="hover:text-black"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-rose-500 hover:text-rose-600 font-semibold underline ml-1"
              >
                Reset Semua
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan {products.length} dari {pagination.total} produk
            </span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="inventory_2"
              title="Produk tidak ditemukan"
              description="Kami tidak menemukan produk yang cocok dengan kata kunci atau filter yang Anda pilih."
              actionLabel="Reset Semua Filter"
              onAction={handleResetFilters}
              actionIcon="refresh"
            />
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        categories={categories}
        selectedCategory={categoryParam}
        onSelectCategory={handleCategoryChange}
        selectedSort={sortParam}
        onSelectSort={handleSortChange}
        isFeaturedOnly={featuredParam}
        onToggleFeatured={handleToggleFeatured}
        onResetFilters={handleResetFilters}
        totalResults={pagination.total}
      />
    </div>
  );
}
