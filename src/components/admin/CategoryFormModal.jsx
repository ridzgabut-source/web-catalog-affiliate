import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { Input, Textarea, Switch } from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category = null,
  isLoading = false,
}) {
  const isEdit = Boolean(category);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        status: category.status || 'ACTIVE',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        status: 'ACTIVE',
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        ...prev,
        name: val,
        slug: isEdit ? prev.slug : generatedSlug,
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Nama kategori wajib diisi.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
      subtitle={
        isEdit
          ? 'Perbarui informasi dan status kategori produk ini.'
          : 'Buat kategori baru untuk mengelompokkan produk-produk afiliasi Anda.'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Kategori"
          required
          value={formData.name}
          onChange={handleNameChange}
          error={errors.name}
          placeholder="misal: Setup Meja Kerja"
        />

        <Input
          label="Slug URL"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="setup-meja-kerja"
          helperText="Otomatis dibuat dari nama kategori"
        />

        <Textarea
          label="Deskripsi Kategori (Opsional)"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ringkasan singkat tentang kategori ini..."
        />

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <Switch
            label="Status Kategori"
            description="Kategori aktif tampil di katalog publik"
            checked={formData.status === 'ACTIVE'}
            onChange={(checked) =>
              setFormData({ ...formData, status: checked ? 'ACTIVE' : 'INACTIVE' })
            }
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
