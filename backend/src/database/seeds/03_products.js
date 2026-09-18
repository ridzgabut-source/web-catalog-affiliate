// seeds/03_products.js
// 6 produk sesuai INITIAL_PRODUCTS dari src/api/mockData.js FE
// specs disimpan sebagai JSON string (SQLite TEXT)

// UUID kategori harus match dengan seed 02_categories.js
const CAT_AUDIO    = 'a1b2c3d4-e5f6-7890-abcd-ef1234560001';
const CAT_SETUP    = 'a1b2c3d4-e5f6-7890-abcd-ef1234560002';
const CAT_KERJA    = 'a1b2c3d4-e5f6-7890-abcd-ef1234560003';
const CAT_DAPUR    = 'a1b2c3d4-e5f6-7890-abcd-ef1234560004';
const CAT_LIFESTYLE = 'a1b2c3d4-e5f6-7890-abcd-ef1234560005';
const CAT_GADGET   = 'a1b2c3d4-e5f6-7890-abcd-ef1234560006';

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('products').del();

  await knex('products').insert([
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670001',
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphone',
      slug: 'sony-wh-1000xm5-wireless-headphone',
      category_id: CAT_AUDIO,
      description: 'Peredam bising terdepan di industri dengan kenyamanan pemakaian optimal seharian. Dilengkapi dua prosesor pengontrol delapan mikrofon untuk kualitas suara fidelitas tinggi yang tak tertandingi.',
      price: 3699000,
      original_price: 4999000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://shopee.co.id/search?keyword=Sony%20WH-1000XM5%20Official',
      button1_text: 'Beli di Shopee',
      button2_url: 'https://www.tokopedia.com/search?q=Sony%20WH-1000XM5%20Official',
      button2_text: 'Beli di Tokopedia',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Tipe Driver': '30mm Presisi Carbon Fiber Dome',
        'Konektivitas': 'Bluetooth 5.2 / LDAC / Hi-Res Audio',
        'Daya Tahan Baterai': 'Hingga 30 Jam (ANC On) / Fast Charge 3 Menit untuk 3 Jam',
        'Berat': '250 gram',
        'Garansi': '1 Tahun Garansi Resmi Sony Indonesia',
      }),
      created_at: '2026-09-02T10:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670002',
      name: 'Keychron K2 Pro QMK Wireless Custom Mechanical Keyboard',
      slug: 'keychron-k2-pro-wireless-custom-keyboard',
      category_id: CAT_SETUP,
      description: 'Keyboard mekanikal kustom nirkabel berukuran 75% dengan dukungan penuh QMK/VIA. Menggunakan switch Keychron K Pro yang telah di-lube dari pabrik dan kompatibel dengan macOS serta Windows secara instan.',
      price: 1385000,
      original_price: 1650000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://www.tokopedia.com/search?q=Keychron%20K2%20Pro%20Official',
      button1_text: 'Beli di Tokopedia',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Layout': '75% (84 Tombol)',
        'Hot-Swappable': 'Ya, kompatibel 3-pin & 5-pin MX Mechanical Switches',
        'Keycaps': 'OSA Profile Double-Shot PBT Non-shine Through',
        'Konektivitas': 'Bluetooth 5.1 & Kabel Tipe-C',
        'Baterai': '4000mAh Rechargeable li-polymer battery',
      }),
      created_at: '2026-09-03T11:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670003',
      name: 'Pexio Regent Ergonomic Mesh High-Back Chair',
      slug: 'pexio-regent-ergonomic-mesh-chair',
      category_id: CAT_KERJA,
      description: 'Kursi ergonomis sandaran mesh bernapas premium dengan penopang punggung lumbal presisi. Dirancang untuk menopang postur tubuh ideal saat bekerja lebih dari 8 jam di depan komputer.',
      price: 1845000,
      original_price: 2450000,
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://shopee.co.id/search?keyword=Pexio%20Regent%20Ergonomic%20Chair',
      button1_text: 'Beli di Shopee',
      button2_url: 'https://www.tokopedia.com/search?q=Pexio%20Regent%20Ergonomic%20Chair',
      button2_text: 'Beli di Tokopedia',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Bahan Sandaran': 'Premium Breathable Korea Mesh',
        'Armrest': '3D Adjustable (Tinggi, Sudut, Maju-Mundur)',
        'Mekanisme Tilting': 'Multi-lock Recline System hingga 135 derajat',
        'Kapasitas Beban': 'Maksimal 125 kg',
        'Garansi': '2 Tahun Garansi Mekanisme & Roda Hidrolik',
      }),
      created_at: '2026-09-04T12:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670004',
      name: 'Philips Essential Airfryer XL Digital Connected',
      slug: 'philips-essential-airfryer-xl-digital',
      category_id: CAT_DAPUR,
      description: 'Teknologi Rapid Air memutar udara panas untuk memasak makanan renyah lezat dengan kadar lemak hingga 90% lebih sedikit. Dilengkapi layar sentuh digital dengan 7 menu preset siap pakai.',
      price: 985000,
      original_price: 1399000,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://www.tokopedia.com/search?q=Philips%20Airfryer%20XL%20Official',
      button1_text: 'Beli di Tokopedia',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Kapasitas Keranjang': '4.1 Liter (setara 0.8 kg kentang/ayam)',
        'Konsumsi Daya Listrik': '800 - 1400 Watt',
        'Kontrol': 'Digital Touch Screen dengan Auto-Shutoff',
        'Pembersihan': 'QuickClean dengan lapisan anti-lengket (Dishwasher safe)',
        'Garansi': '2 Tahun Garansi Resmi Philips Global',
      }),
      created_at: '2026-09-05T13:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670005',
      name: 'Stanley Quencher H2.0 FlowState 40oz Tumbler',
      slug: 'stanley-quencher-h20-40oz-tumbler',
      category_id: CAT_LIFESTYLE,
      description: 'Tumbler isolasi vakum dinding ganda berbahan baja tahan karat 90% daur ulang. Menjaga minuman tetap dingin dingin es berjam-jam dengan tutup canggih FlowState 3-posisi anti-bocor.',
      price: 649000,
      original_price: 799000,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://shopee.co.id/search?keyword=Stanley%20Quencher%2040oz%20Original',
      button1_text: 'Beli di Shopee',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Kapasitas': '40 oz (1.18 Liter)',
        'Material': '18/8 Stainless Steel (BPA-Free, Eco-Friendly)',
        'Retensi Suhu': 'Dingin 11 Jam / Es 48 Jam / Panas 7 Jam',
        'Fitur Khusus': 'Muat di tempat cangkir mobil standar (Car cup holder compatible)',
        'Tutup': 'FlowState 3-Way Rotating Lid dengan Sedotan Reusable',
      }),
      created_at: '2026-09-06T14:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f12345670006',
      name: 'Anker 735 GaNPrime 65W 3-Port Fast Wall Charger',
      slug: 'anker-735-ganprime-65w-fast-charger',
      category_id: CAT_GADGET,
      description: 'Adaptor pengisian daya cepat ringkas tiga port dengan arsitektur GaNPrime generasi terbaru. Mampu mengisi daya laptop, tablet, dan smartphone secara simultan dengan distribusi daya cerdas.',
      price: 489000,
      original_price: 650000,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      button1_url: 'https://www.tokopedia.com/search?q=Anker%20GaNPrime%2065W%20Official',
      button1_text: 'Beli di Tokopedia',
      is_featured: 1,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Total Daya': '65W Max GaN Output',
        'Port Interface': '2x USB-C Power Delivery + 1x USB-A PowerIQ 2.0',
        'Proteksi Suhu': 'ActiveShield 2.0 memantau suhu 3 juta kali per hari',
        'Ukuran': '38% lebih ringkas dari charger 67W original bawaan laptop',
        'Garansi': '18 Bulan Garansi Resmi Anker Indonesia',
      }),
      created_at: '2026-09-07T15:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
  ]);

  console.log('✅ 6 products seeded.');
};
