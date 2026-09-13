import React from 'react';

export default function CategoryPills({
  categories = [],
  selectedCategory = '',
  onSelectCategory,
}) {
  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          type="button"
          onClick={() => onSelectCategory('')}
          className={`px-4 py-1.5 rounded-full text-xs font-headline transition-all duration-200 ${
            selectedCategory === ''
              ? 'bg-primary text-white font-bold shadow-sm'
              : 'bg-surface-container text-slate-600 hover:bg-surface-container-high hover:text-on-surface font-medium'
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
              className={`px-4 py-1.5 rounded-full text-xs font-headline transition-all duration-200 ${
                isSelected
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'bg-surface-container text-slate-600 hover:bg-surface-container-high hover:text-on-surface font-medium'
              }`}
            >
              {cat.name}
              {cat.product_count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {cat.product_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
