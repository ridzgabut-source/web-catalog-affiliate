import React, { useState, useEffect, useCallback } from 'react';
import { productApi } from '../../api/productApi.js';
import { categoryApi } from '../../api/categoryApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import ProductTable from '../../components/admin/ProductTable.jsx';
import ProductFormModal from '../../components/admin/ProductFormModal.jsx';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal.jsx';
import SearchBar from '../../components/catalog/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import { ProductTableSkeleton } from '../../components/common/Skeleton.jsx';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Loading states for actions
  const [actionLoading, setActionLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getProducts({
          search,
          category: selectedCategory,
          limit: 50,
          status: 'ALL', // In mockStorage, any string or we can pass null to fetch all
        }),
        categoryApi.getCategories({ includeInactive: true }),
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data.items);
      }
      if (catRes.success) {
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error('Error loading admin products:', err);
      showToast('Gagal memuat daftar produk.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Form Modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  // Open Form Modal for Edit
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormModalOpen(true);
  };

  // Submit Create or Edit
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        const res = await productApi.updateProduct(editingProduct.id, formData);
        if (res.success) {
          showToast('Produk berhasil diperbarui.', 'success');
          setFormModalOpen(false);
          loadData();
        } else {
          showToast(res.message || 'Gagal memperbarui produk.', 'error');
        }
      } else {
        const res = await productApi.createProduct(formData);
        if (res.success) {
          showToast('Produk berhasil ditambahkan.', 'success');
          setFormModalOpen(false);
          loadData();
        } else {
          showToast(res.message || 'Gagal menambahkan produk.', 'error');
        }
      }
    } catch (err) {
      showToast('Terjadi kesalahan pada sistem.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle status via updateProduct(id, { status })
  const handleToggleStatus = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      const res = await productApi.updateProduct(id, { status: newStatus });
      if (res.success) {
        showToast(
          `Status produk diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`,
          'info'
        );
        // Optimistic local state update
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      } else {
        showToast(res.message || 'Gagal mengubah status.', 'error');
      }
    } catch {
      showToast('Gagal mengubah status produk.', 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (prod) => {
    setDeletingProduct(prod);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      const res = await productApi.deleteProduct(deletingProduct.id);
      if (res.success) {
        showToast('Produk berhasil dihapus dari katalog.', 'success');
        setDeleteModalOpen(false);
        setDeletingProduct(null);
        loadData();
      } else {
        showToast(res.message || 'Gagal menghapus produk.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">
            Koleksi Produk Afiliasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {products.length} produk terdaftar dalam katalog.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          icon="add"
          className="shadow-sm"
        >
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-elevation-1 flex flex-col sm:flex-row items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari nama produk..."
          className="flex-1"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 h-11 px-3.5 bg-slate-50 text-on-surface text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-primary"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Product Data Table */}
      {loading ? (
        <ProductTableSkeleton rows={6} />
      ) : (
        <ProductTable
          products={products}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          updatingId={updatingStatusId}
        />
      )}

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk dari Katalog"
        message="Apakah Anda yakin ingin menghapus produk ini? Produk tidak akan lagi dapat diakses oleh pengunjung."
        itemName={deletingProduct?.name}
        isDeleting={actionLoading}
      />
    </div>
  );
}
