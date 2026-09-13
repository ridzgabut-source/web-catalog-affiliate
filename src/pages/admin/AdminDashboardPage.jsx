import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import { categoryApi } from '../../api/categoryApi.js';
import StatCard from '../../components/admin/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { formatRupiah } from '../../components/catalog/ProductCard.jsx';
import { ProductTableSkeleton } from '../../components/common/Skeleton.jsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalCategories: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [allProdRes, activeProdRes, catRes] = await Promise.all([
          productApi.getProducts({ limit: 50 }),
          productApi.getProducts({ status: 'ACTIVE', limit: 50 }),
          categoryApi.getCategories({ includeInactive: true }),
        ]);

        const totalProds = allProdRes.success ? allProdRes.data.pagination.total : 0;
        const activeProds = activeProdRes.success ? activeProdRes.data.pagination.total : 0;
        const inactiveProds = Math.max(0, totalProds - activeProds);
        const totalCats = catRes.success ? catRes.data.length : 0;

        setStats({
          totalProducts: totalProds,
          activeProducts: activeProds,
          inactiveProducts: inactiveProds,
          totalCategories: totalCats,
        });

        if (allProdRes.success) {
          setRecentProducts(allProdRes.data.items.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-elevation-1">
        <div>
          <h2 className="text-lg font-bold font-headline text-on-surface">
            Ringkasan Katalog KoleksiKita
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola produk dan kategori afiliasi Anda dengan cepat.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            as={Link}
            to="/admin/categories"
            variant="outline"
            size="sm"
            icon="add_circle"
          >
            Tambah Kategori
          </Button>
          <Button
            as={Link}
            to="/admin/products"
            variant="primary"
            size="sm"
            icon="add"
          >
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* 2. 4 Metric Cards (PRD Section 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Produk"
          value={loading ? '...' : stats.totalProducts}
          icon="inventory_2"
          description="Semua produk dalam database"
          accentColor="primary"
        />
        <StatCard
          title="Produk Aktif"
          value={loading ? '...' : stats.activeProducts}
          icon="check_circle"
          description="Tampil pada katalog publik"
          accentColor="emerald"
        />
        <StatCard
          title="Produk Non-Aktif"
          value={loading ? '...' : stats.inactiveProducts}
          icon="pause_circle"
          description="Disembunyikan dari publik"
          accentColor="slate"
        />
        <StatCard
          title="Total Kategori"
          value={loading ? '...' : stats.totalCategories}
          icon="category"
          description="Kategori kurasi aktif"
          accentColor="amber"
        />
      </div>

      {/* 3. Recent Products Table Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-elevation-1 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-headline text-on-surface">
              Produk Terakhir Ditambahkan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar produk terbaru dalam katalog
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-headline font-semibold text-primary hover:underline"
          >
            Kelola Semua Produk →
          </Link>
        </div>

        {loading ? (
          <ProductTableSkeleton rows={4} />
        ) : recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-headline uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Produk</th>
                  <th className="py-3 px-5">Kategori</th>
                  <th className="py-3 px-5">Harga</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-on-surface truncate max-w-xs">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-xs text-slate-600">
                      {p.category_name}
                    </td>
                    <td className="py-3 px-5 font-headline font-bold text-xs text-primary tnum">
                      {formatRupiah(p.price)}
                    </td>
                    <td className="py-3 px-5">
                      <Badge variant="status" status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link
                        to="/admin/products"
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors inline-block"
                        title="Edit Produk"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            Belum ada produk dalam katalog.
          </div>
        )}
      </div>
    </div>
  );
}
