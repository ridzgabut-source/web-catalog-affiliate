// seeds/02_categories.js
// 6 kategori sesuai INITIAL_CATEGORIES dari src/api/mockData.js FE

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // Hapus data lama — URUTAN: products dulu karena ada FK ke categories
  // Seed ini hanya hapus categories; products di-handle oleh seed-nya sendiri
  // Untuk reset penuh: gunakan `npm run db:reset`
  await knex('products').del();
  await knex('categories').del();

  await knex('categories').insert([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560001',
      name: 'Audio & Headphone',
      slug: 'audio-headphone',
      description: 'Perangkat audio berkualitas tinggi untuk musik, podcast, dan panggilan kerja jernih.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560002',
      name: 'Setup Meja Kerja',
      slug: 'setup-meja-kerja',
      description: 'Perlengkapan estetik & fungsional untuk meningkatkan produktivitas ruang kerja modern.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560003',
      name: 'Perlengkapan Kerja',
      slug: 'perlengkapan-kerja',
      description: 'Kursi ergonomis dan penunjang postur tubuh sehat untuk jam kerja yang panjang.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560004',
      name: 'Peralatan Dapur',
      slug: 'peralatan-dapur',
      description: 'Perangkat masak modern dan praktis untuk memasak sehat tanpa ribet.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560005',
      name: 'Gaya Hidup',
      slug: 'gaya-hidup',
      description: 'Produk kebutuhan harian dan perlengkapan gaya hidup aktif yang fungsional dan awet.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234560006',
      name: 'Aksesoris Gadget',
      slug: 'aksesoris-gadget',
      description: 'Charger cepat, kabel tangguh, dan aksesoris esensial untuk perangkat harian Anda.',
      status: 'ACTIVE',
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-13T03:00:00.000Z',
    },
  ]);

  console.log('✅ 6 categories seeded.');
};
