import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import { Input, Textarea, Select, Switch } from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  isLoading = false,
}) {
  const isEdit = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    original_price: '',
    image: '',
    affiliate_url: '',
    marketplace_type: 'generic',
    is_featured: false,
    status: 'ACTIVE',
    description: '',
  });

  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [errors, setErrors] = useState({});

  // Populate form on open or change of product prop
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        category_id: product.category_id || (categories[0]?.id || ''),
        price: product.price !== undefined ? String(product.price) : '',
        original_price: product.original_price !== undefined ? String(product.original_price) : '',
        image: product.image || '',
        affiliate_url: product.affiliate_url || '',
        marketplace_type: product.marketplace_type || 'generic',
        is_featured: Boolean(product.is_featured),
        status: product.status || 'ACTIVE',
        description: product.description || '',
      });

      if (product.specs && Object.keys(product.specs).length > 0) {
        setSpecs(
          Object.entries(product.specs).map(([k, v]) => ({ key: k, value: v }))
        );
      } else {
        setSpecs([{ key: '', value: '' }]);
      }
    } else {
      setFormData({
        name: '',
        slug: '',
        category_id: categories[0]?.id || '',
        price: '',
        original_price: '',
        image: '',
        affiliate_url: '',
        marketplace_type: 'generic',
        is_featured: false,
        status: 'ACTIVE',
        description: '',
      });
      setSpecs([{ key: '', value: '' }]);
    }
    setErrors({});
  }, [product, categories, isOpen]);

  // Handle auto-slug on name change
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
        // Only auto-update slug if not in edit mode or slug was matching previous name
        slug: isEdit ? prev.slug : generatedSlug,
      };
    });
  };

  // Spec row helpers
  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, val) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama produk wajib diisi.';
    if (!formData.category_id) errs.category_id = 'Kategori wajib dipilih.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      errs.price = 'Harga wajib diisi dengan angka minimal 0.';
    }
    if (!formData.image.trim()) {
      errs.image = 'URL gambar produk wajib diisi.';
    }
    if (!formData.affiliate_url.trim()) {
      errs.affiliate_url = 'URL afiliasi wajib diisi.';
    } else if (!formData.affiliate_url.startsWith('https://')) {
      errs.affiliate_url = 'URL afiliasi harus menggunakan protokol HTTPS (https://...).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert specs array to object
    const specsObj = {};
    specs.forEach((item) => {
      if (item.key.trim() && item.value.trim()) {
        specsObj[item.key.trim()] = item.value.trim();
      }
    });

    const payload = {
      ...formData,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : undefined,
      specs: specsObj,
    };

    onSubmit(payload);
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const marketplaceOptions = [
    { value: 'generic', label: 'Marketplace Umum' },
    { value: 'shopee', label: 'Shopee Official Store' },
    { value: 'tokopedia', label: 'Tokopedia Official Store' },
    { value: 'tiktok', label: 'TikTok Shop' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}
      subtitle={
        isEdit
          ? 'Perbarui informasi produk, harga, dan tautan afiliasi marketplace.'
          : 'Lengkapi formulir untuk menambahkan kurasi produk baru ke dalam katalog.'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Produk"
            required
            value={formData.name}
            onChange={handleNameChange}
            error={errors.name}
            placeholder="misal: Sony WH-1000XM5 Headphone"
          />

          <Input
            label="Slug URL"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="sony-wh-1000xm5-headphone"
            helperText="Otomatis dibuat dari nama produk"
          />
        </div>

        {/* Row 2: Category & Marketplace Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Kategori Produk"
            required
            options={categoryOptions}
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            error={errors.category_id}
          />

          <Select
            label="Tipe Marketplace"
            options={marketplaceOptions}
            value={formData.marketplace_type}
            onChange={(e) => setFormData({ ...formData, marketplace_type: e.target.value })}
            helperText="Menyesuaikan warna dan ikon tombol outbound"
          />
        </div>

        {/* Row 3: Price & Original Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Harga Katalog (Rp)"
            type="number"
            required
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
            placeholder="199000"
          />

          <Input
            label="Harga Coret Asli (Opsional Rp)"
            type="number"
            min="0"
            value={formData.original_price}
            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            placeholder="250000"
            helperText="Akan ditampilkan sebagai diskon coret"
          />
        </div>

        {/* Row 4: Image URL with Live Thumbnail Preview */}
        <div>
          <Input
            label="URL Gambar Produk"
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            error={errors.image}
            placeholder="https://images.unsplash.com/photo-..."
            icon="image"
          />

          {formData.image && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={formData.image}
                alt="Preview produk"
                className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700 block">Preview Gambar</span>
                Pastikan gambar berasio 1:1 dan beresolusi tajam.
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Affiliate URL */}
        <Input
          label="URL Afiliasi Marketplace (HTTPS Wajib)"
          type="url"
          required
          value={formData.affiliate_url}
          onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
          error={errors.affiliate_url}
          placeholder="https://shopee.co.id/... atau https://www.tokopedia.com/..."
          icon="link"
          helperText="Tautan tempat pengunjung akan diarahkan saat mengklik tombol Beli"
        />

        {/* Row 6: Description */}
        <Textarea
          label="Ulasan / Deskripsi Kurasi Produk"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Jelaskan alasan mengapa produk ini direkomendasikan..."
        />

        {/* Row 7: Toggles (Featured & Status) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Switch
            label="Produk Unggulan"
            description="Tampilkan di beranda depan"
            checked={formData.is_featured}
            onChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />

          <Switch
            label="Status Aktif"
            description="Produk dapat dilihat publik"
            checked={formData.status === 'ACTIVE'}
            onChange={(checked) => setFormData({ ...formData, status: checked ? 'ACTIVE' : 'INACTIVE' })}
          />
        </div>

        {/* Row 8: Specifications Matrix Editor */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold font-headline uppercase tracking-wider text-slate-700">
              Spesifikasi Produk (Key - Value)
            </label>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Tambah Baris</span>
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="misal: Garansi"
                  value={item.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="w-1/3 h-9 px-3 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="misal: 1 Tahun Resmi"
                  value={item.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
                />
                {specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Hapus baris spesifikasi"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
