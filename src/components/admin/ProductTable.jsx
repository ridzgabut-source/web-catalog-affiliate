import React from 'react';
import Badge from '../common/Badge.jsx';
import { Switch } from '../common/Input.jsx';
import { formatRupiah } from '../catalog/ProductCard.jsx';

export default function ProductTable({
  products = [],
  onEdit,
  onDelete,
  onToggleStatus,
  updatingId = null,
}) {
  if (products.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
        Belum ada produk yang cocok dengan filter atau pencarian Anda.
      </div>
    );
  }

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    try {
      return new Date(isoStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div>
      {/* 1. Desktop Table View (≥ 768px) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-headline uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Produk</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Harga</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6">Diperbarui</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.image}
                        alt={`Thumbnail ${p.name}`}
                        title={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                        onError={(e) => {
                          e.target.src = '/images/og/og-koleksikita.webp';
                        }}
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-sm text-on-surface truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          /{p.slug}
                        </p>
                        {p.is_featured && (
                          <span className="inline-block mt-1">
                            <Badge variant="featured" size="sm" />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                    {p.category_name}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-headline font-bold text-sm text-primary tnum">
                    {formatRupiah(p.price)}
                  </td>

                  {/* Status Toggle via updateProduct */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center gap-2">
                      <Switch
                        checked={p.status === 'ACTIVE'}
                        onChange={(checked) =>
                          onToggleStatus(p.id, checked ? 'ACTIVE' : 'INACTIVE')
                        }
                        disabled={updatingId === p.id}
                      />
                      <span className="text-xs font-semibold text-slate-600 w-12 text-left">
                        {p.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </td>

                  {/* Updated Date */}
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {formatDate(p.updated_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                        title="Edit Produk"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus Produk"
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
      </div>

      {/* 2. Mobile Card List (< 768px) */}
      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-elevation-1 space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={p.image}
                alt={`Thumbnail ${p.name}`}
                title={p.name}
                className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                onError={(e) => {
                  e.target.src = '/images/og/og-koleksikita.webp';
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                  {p.category_name}
                </span>
                <h4 className="font-semibold text-sm text-on-surface line-clamp-1 mt-0.5">
                  {p.name}
                </h4>
                <p className="font-headline font-bold text-sm text-primary tnum mt-1">
                  {formatRupiah(p.price)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={p.status === 'ACTIVE'}
                  onChange={(checked) =>
                    onToggleStatus(p.id, checked ? 'ACTIVE' : 'INACTIVE')
                  }
                  disabled={updatingId === p.id}
                />
                <span className="text-xs font-semibold text-slate-600">
                  {p.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(p)}
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
