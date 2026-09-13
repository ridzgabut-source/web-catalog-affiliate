import React from 'react';
import Button from '../common/Button.jsx';

export default function FilterDrawer({
  isOpen,
  onClose,
  categories = [],
  selectedCategory = '',
  onSelectCategory,
  selectedSort = 'newest',
  onSelectSort,
  isFeaturedOnly = false,
  onToggleFeatured,
  onResetFilters,
  totalResults = 0,
}) {
  if (!isOpen) return null;

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Harga: Termurah' },
    { value: 'price_desc', label: 'Harga: Termahal' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="relative bg-white rounded-t-3xl shadow-elevation-3 border-t border-slate-200 p-6 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h3 className="text-lg font-bold font-headline text-on-surface">
            Filter & Urutan
          </h3>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            Reset Semua
          </button>
        </div>

        {/* Sort */}
        <div className="mb-6 space-y-3">
          <label className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
            Urutkan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelectSort(opt.value)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                  selectedSort === opt.value
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="mb-6 py-3 border-y border-slate-100">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-800">
              Hanya Produk Unggulan
            </span>
            <input
              type="checkbox"
              checked={isFeaturedOnly}
              onChange={(e) => onToggleFeatured(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary/20 border-slate-300"
            />
          </label>
        </div>

        {/* Categories */}
        <div className="mb-6 space-y-3">
          <label className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
            Kategori
          </label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === ''
                  ? 'bg-primary text-white border-primary'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Semua Kategori
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat.name} ({cat.product_count || 0})
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply CTA */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full"
          >
            Lihat {totalResults} Produk
          </Button>
        </div>
      </div>
    </div>
  );
}
