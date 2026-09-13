import React from 'react';
import Badge from '../common/Badge.jsx';

export default function CategoryTable({
  categories = [],
  onEdit,
  onDelete,
}) {
  if (categories.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        Belum ada kategori yang ditambahkan.
      </div>
    );
  }

  return (
    <div>
      {/* 1. Desktop Table (≥ 768px) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-elevation-1 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-[11px] font-headline uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Nama Kategori</th>
              <th className="py-3.5 px-6">Slug</th>
              <th className="py-3.5 px-6">Jumlah Produk</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-sm text-on-surface">
                    {c.name}
                  </div>
                  {c.description && (
                    <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">
                      {c.description}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                  {c.slug}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs font-headline tnum">
                    <span className="material-symbols-outlined text-sm text-slate-400">inventory_2</span>
                    <span>{c.product_count || 0} Produk</span>
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Badge variant="status" status={c.status} size="sm" />
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onEdit(c)}
                      className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                      title="Edit Kategori"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Kategori"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card List (< 768px) */}
      <div className="md:hidden space-y-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-elevation-1 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-sm text-on-surface">
                  {c.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  /{c.slug}
                </p>
                {c.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
              <Badge variant="status" status={c.status} size="sm" />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold font-headline">
                {c.product_count || 0} Produk Terkait
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Hapus"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
