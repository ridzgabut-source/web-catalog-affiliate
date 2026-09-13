import React, { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../../api/categoryApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import CategoryTable from '../../components/admin/CategoryTable.jsx';
import CategoryFormModal from '../../components/admin/CategoryFormModal.jsx';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import { ProductTableSkeleton } from '../../components/common/Skeleton.jsx';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // 409 Conflict Blocking Modal State (PRD Section 18)
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getCategories({ includeInactive: true });
      if (res.success) {
        setCategories(res.data);
      }
    } catch {
      showToast('Gagal memuat daftar kategori.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        const res = await categoryApi.updateCategory(editingCategory.id, formData);
        if (res.success) {
          showToast('Kategori berhasil diperbarui.', 'success');
          setFormModalOpen(false);
          loadCategories();
        } else {
          showToast(res.message || 'Gagal memperbarui kategori.', 'error');
        }
      } else {
        const res = await categoryApi.createCategory(formData);
        if (res.success) {
          showToast('Kategori baru berhasil ditambahkan.', 'success');
          setFormModalOpen(false);
          loadCategories();
        } else {
          showToast(res.message || 'Gagal menambahkan kategori.', 'error');
        }
      }
    } catch {
      showToast('Terjadi kesalahan pada sistem.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete request (enforce PRD Section 18 / 409 Conflict check)
  const handleRequestDelete = (cat) => {
    if (cat.product_count > 0) {
      // Reject deletion with clear explanation
      setConflictMessage(
        `Kategori "${cat.name}" masih digunakan oleh ${cat.product_count} produk. Untuk alasan keamanan data, kategori tidak dapat dihapus selama masih memiliki produk terkait. Silakan pindahkan atau hapus produk terlebih dahulu.`
      );
      setConflictModalOpen(true);
      return;
    }

    setDeletingCategory(cat);
    setDeleteModalOpen(true);
  };

  // Confirm Delete when safe
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setActionLoading(true);
    try {
      const res = await categoryApi.deleteCategory(deletingCategory.id);
      if (res.success) {
        showToast('Kategori berhasil dihapus.', 'success');
        setDeleteModalOpen(false);
        setDeletingCategory(null);
        loadCategories();
      } else {
        showToast(res.message || 'Gagal menghapus kategori.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">
            Kategori Produk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pengelompokan produk dan pantau jumlah item yang terhubung.
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
          Tambah Kategori Baru
        </Button>
      </div>

      {/* Categories Table */}
      {loading ? (
        <ProductTableSkeleton rows={5} />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
        />
      )}

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        isLoading={actionLoading}
      />

      {/* Safe Delete Confirm Modal (0 products) */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori"
        message="Apakah Anda yakin ingin menghapus kategori ini?"
        itemName={deletingCategory?.name}
        isDeleting={actionLoading}
      />

      {/* 409 Conflict Alert Modal (PRD Section 18) */}
      <Modal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        title="Penghapusan Kategori Ditolak"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">shield</span>
            </div>
            <div>
              <h4 className="text-sm font-bold font-headline text-slate-900">
                Aturan Proteksi Integritas Data (PRD Bagian 18)
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {conflictMessage}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setConflictModalOpen(false)}
            >
              Mengerti
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
