// seeds/01_admins.js
// Seed admin: admin@koleksikita.com / admin123
// Password di-hash dengan bcryptjs (saltRounds = 12)
// CATATAN: Jalankan manual dengan `npm run db:seed` — TIDAK auto-run saat server start

const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'admin@koleksikita.com';
const ADMIN_PASSWORD = 'admin123';
const SALT_ROUNDS = 12;

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  // Hapus data lama (idempotent)
  await knex('admins').del();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  await knex('admins').insert([
    {
      id: '01913a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b',
      email: ADMIN_EMAIL,
      name: 'Owner KoleksiKita',
      password_hash: passwordHash,
      role: 'ADMIN',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  console.log(`✅ Admin seeded: ${ADMIN_EMAIL}`);
};
