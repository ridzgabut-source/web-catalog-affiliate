import React from 'react';

export default function FilterSidebar({
  categories = [],
  selectedCategory = '',
  onSelectCategory,
  selectedSort = 'newest',
  onSelectSort,
  isFeaturedOnly = false,
  onToggleFeatured,
  onResetFilters,
  hasActiveFilters = false,
}) {
  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Harga: Termurah' },
    { value: 'price_desc', label: 'Harga: Termahal' },
  ];

  return (
    <aside className="w-full bg-white rounded-2xl p-6 border border-slate-200/80 shadow-elevation-1 space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-headline font-bold text-base text-on-surface">
          <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
          <span>Filter Produk</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="space-y-3">
        <label className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
          Urutkan Berdasarkan
        </label>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-primary cursor-pointer select-none"
            >
              <input
                type="radio"
                name="desktop_sort"
                value={opt.value}
                checked={selectedSort === opt.value}
                onChange={() => onSelectSort(opt.value)}
                className="w-4 h-4 text-primary focus:ring-primary/20 border-slate-300"
              />
              <span className={selectedSort === opt.value ? 'font-semibold text-primary' : ''}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Featured Only Toggle */}
      <div className="pt-2 pb-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-primary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isFeaturedOnly}
            onChange={(e) => onToggleFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300"
          />
          <span className="font-medium">Hanya Produk Unggulan</span>
        </label>
      </div>

      {/* Categories Section */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
          Kategori
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <label className="flex items-center justify-between text-sm text-slate-700 hover:text-primary cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="desktop_cat"
                value=""
                checked={selectedCategory === ''}
                onChange={() => onSelectCategory('')}
                className="w-4 h-4 text-primary focus:ring-primary/20 border-slate-300"
              />
              <span className={selectedCategory === '' ? 'font-semibold text-primary' : ''}>
                Semua Kategori
              </span>
            </div>
          </label>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-primary cursor-pointer select-none py-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="desktop_cat"
                    value={cat.slug}
                    checked={isSelected}
                    onChange={() => onSelectCategory(cat.slug)}
                    className="w-4 h-4 text-primary focus:ring-primary/20 border-slate-300"
                  />
                  <span className={isSelected ? 'font-semibold text-primary' : ''}>
                    {cat.name}
                  </span>
                </div>
                {cat.product_count !== undefined && (
                  <span className="text-xs text-slate-400 font-mono">
                    {cat.product_count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
