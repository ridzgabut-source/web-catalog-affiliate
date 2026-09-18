// controllers/admin/categoryController.js
// Admin endpoints — CRUD kategori, semua status (ACTIVE + INACTIVE)
// WAJIB: DELETE tolak 409 jika kategori masih memiliki produk

const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { success, error } = require('../../helpers/response');
const { slugify } = require('../../helpers/slugify');

/**
 * GET /api/v1/admin/categories
 * Semua kategori (ACTIVE + INACTIVE) + computed product_count (semua status)
 */
async function list(req, res, next) {
  try {
    const categories = await db('categories')
      .select(
        'categories.*',
        db.raw(
          '(SELECT COUNT(*) FROM products WHERE products.category_id = categories.id) as product_count'
        )
      )
      .orderBy('categories.created_at', 'desc');

    const result = categories.map((cat) => ({
      ...cat,
      product_count: Number(cat.product_count),
    }));

    return success(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/admin/categories
 * Buat kategori baru
 */
async function create(req, res, next) {
  try {
    const { name, slug, description, status = 'ACTIVE' } = req.body;

    // Auto-generate slug jika tidak dikirim (tapi validator sudah mewajibkan slug)
    const finalSlug = slug || slugify(name);

    // Cek duplikat slug
    const existing = await db('categories').where({ slug: finalSlug }).first();
    if (existing) {
      return error(res, 'Validasi gagal. Periksa kembali data yang dikirim.', 422, {
        slug: [`Slug "${finalSlug}" sudah digunakan. Gunakan slug yang berbeda.`],
      });
    }

    const now = new Date().toISOString();
    const id = uuidv4();

    await db('categories').insert({
      id,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      status,
      created_at: now,
      updated_at: now,
    });

    const created = await db('categories').where({ id }).first();
    return success(res, { ...created, product_count: 0 }, 'Kategori berhasil dibuat.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/admin/categories/:id
 * Update kategori
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await db('categories').where({ id }).first();
    if (!existing) {
      return error(res, 'Kategori tidak ditemukan.', 404);
    }

    // Jika slug berubah, cek duplikat
    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugConflict = await db('categories')
        .where({ slug: req.body.slug })
        .whereNot({ id })
        .first();
      if (slugConflict) {
        return error(res, 'Validasi gagal.', 422, {
          slug: [`Slug "${req.body.slug}" sudah digunakan.`],
        });
      }
    }

    const updates = { ...req.body, updated_at: new Date().toISOString() };
    if (updates.name) updates.name = updates.name.trim();
    if (updates.description) updates.description = updates.description.trim();

    await db('categories').where({ id }).update(updates);

    const updated = await db('categories')
      .select(
        'categories.*',
        db.raw(
          '(SELECT COUNT(*) FROM products WHERE products.category_id = categories.id) as product_count'
        )
      )
      .where({ 'categories.id': id })
      .first();

    return success(res, { ...updated, product_count: Number(updated.product_count) }, 'Kategori berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/admin/categories/:id
 * Hapus kategori
 *
 * WAJIB: Tolak dengan HTTP 409 Conflict jika kategori masih memiliki produk
 * Jangan cascade-delete products — admin harus pindahkan produk dulu
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await db('categories').where({ id }).first();
    if (!existing) {
      return error(res, 'Kategori tidak ditemukan.', 404);
    }

    // Hitung produk yang menggunakan kategori ini (semua status)
    const productCountResult = await db('products')
      .where({ category_id: id })
      .count('id as total')
      .first();

    const productCount = Number(productCountResult?.total || 0);

    if (productCount > 0) {
      // HTTP 409 Conflict — sesuai FE_HANDOFF.md §2.2 dan PRD §18
      return error(
        res,
        `Kategori tidak dapat dihapus karena masih digunakan oleh ${productCount} produk. Pindahkan atau hapus produk tersebut terlebih dahulu.`,
        409
      );
    }

    await db('categories').where({ id }).delete();

    return success(res, null, 'Kategori berhasil dihapus.');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, delete: remove };
