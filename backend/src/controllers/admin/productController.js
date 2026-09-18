// controllers/admin/productController.js
// Admin endpoints — CRUD produk, semua status (ACTIVE + INACTIVE)
// Termasuk status toggle via PUT (bukan endpoint terpisah)

const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { success, error } = require('../../helpers/response');
const { formatProduct } = require('../public/productController');
const { slugify } = require('../../helpers/slugify');

/**
 * Strip script tags dari teks input — proteksi XSS sebelum disimpan ke DB
 * @param {string|null} str
 */
function sanitizeText(str) {
  if (!str) return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
}

/**
 * GET /api/v1/admin/products
 * Semua produk (ACTIVE + INACTIVE) — untuk tabel admin
 * Support: page, per_page, status filter
 */
async function list(req, res, next) {
  try {
    const {
      page = '1',
      per_page = '50',
      limit,
      status,
      search,
      category,
      sort = 'newest',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const rawPerPage = parseInt(limit || per_page, 10) || 50;
    const perPage = Math.min(50, Math.max(1, rawPerPage));
    const offset = (pageNum - 1) * perPage;

    // Sort allowlist
    const SORT_MAP = {
      newest:     { col: 'products.created_at', dir: 'desc' },
      price_asc:  { col: 'products.price',      dir: 'asc'  },
      price_desc: { col: 'products.price',      dir: 'desc' },
    };
    const { col: sortCol, dir: sortDir } = SORT_MAP[sort] || SORT_MAP.newest;

    let query = db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name');

    // Filter status (admin bisa lihat semua jika tidak difilter)
    if (status && ['ACTIVE', 'INACTIVE'].includes(status)) {
      query = query.where('products.status', status);
    }

    // Search
    if (search && typeof search === 'string') {
      const searchTerm = search.trim().substring(0, 100);
      if (searchTerm) {
        query = query.where((builder) => {
          builder
            .whereILike('products.name', `%${searchTerm}%`)
            .orWhereILike('products.description', `%${searchTerm}%`);
        });
      }
    }

    // Category filter
    if (category && typeof category === 'string') {
      const cat = await db('categories').select('id').where('slug', category).orWhere('id', category).first();
      if (cat) query = query.where('products.category_id', cat.id);
    }

    const countResult = await query.clone().count('products.id as total').first();
    const total = Number(countResult?.total || 0);
    const totalPages = Math.ceil(total / perPage);

    const rows = await query.orderBy(sortCol, sortDir).limit(perPage).offset(offset);

    return success(res, {
      items: rows.map(formatProduct),
      pagination: { total, page: pageNum, per_page: perPage, total_pages: totalPages },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/admin/products
 * Buat produk baru
 */
async function create(req, res, next) {
  try {
    const body = req.body;

    // Validasi category_id exist
    const category = await db('categories').where({ id: body.category_id }).first();
    if (!category) {
      return error(res, 'Validasi gagal.', 422, {
        category_id: ['Kategori yang dipilih tidak ditemukan.'],
      });
    }

    // Cek duplikat slug
    const finalSlug = body.slug || slugify(body.name);
    const slugConflict = await db('products').where({ slug: finalSlug }).first();
    if (slugConflict) {
      return error(res, 'Validasi gagal.', 422, {
        slug: [`Slug "${finalSlug}" sudah digunakan produk lain.`],
      });
    }

    const now = new Date().toISOString();
    const id = uuidv4();

    const newProduct = {
      id,
      name: body.name.trim(),
      slug: finalSlug,
      category_id: body.category_id,
      description: sanitizeText(body.description) || null,
      price: body.price,
      original_price: body.original_price || null,
      image: body.image,
      button1_url: body.button1_url,
      button1_text: body.button1_text || 'Beli Sekarang',
      button2_url: body.button2_url || null,
      button2_text: body.button2_text || null,
      is_featured: body.is_featured ? 1 : 0,
      status: body.status || 'ACTIVE',
      specs: body.specs ? JSON.stringify(body.specs) : null,
      created_at: now,
      updated_at: now,
    };

    await db('products').insert(newProduct);

    // Fetch dengan JOIN untuk dapatkan category_name
    const created = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .where('products.id', id)
      .first();

    return success(res, formatProduct(created), 'Produk berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/admin/products/:id
 * Update produk atau toggle status
 * Sesuai FE_HANDOFF.md §3.2: status toggle menggunakan PUT dengan body { "status": "ACTIVE" }
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await db('products').where({ id }).first();
    if (!existing) {
      return error(res, 'Produk tidak ditemukan.', 404);
    }

    const body = req.body;

    // Validasi category_id jika dikirim
    if (body.category_id) {
      const category = await db('categories').where({ id: body.category_id }).first();
      if (!category) {
        return error(res, 'Validasi gagal.', 422, {
          category_id: ['Kategori yang dipilih tidak ditemukan.'],
        });
      }
    }

    // Cek slug conflict jika slug berubah
    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await db('products').where({ slug: body.slug }).whereNot({ id }).first();
      if (slugConflict) {
        return error(res, 'Validasi gagal.', 422, {
          slug: [`Slug "${body.slug}" sudah digunakan produk lain.`],
        });
      }
    }

    // Siapkan fields yang akan di-update
    const updates = {};
    const allowedFields = [
      'name', 'slug', 'category_id', 'description', 'price',
      'original_price', 'image', 'button1_url', 'button1_text',
      'button2_url', 'button2_text', 'is_featured', 'status',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.name) updates.name = updates.name.trim();
    if (updates.description !== undefined) updates.description = sanitizeText(updates.description) || null;
    if (updates.is_featured !== undefined) updates.is_featured = updates.is_featured ? 1 : 0;
    if (body.specs !== undefined) updates.specs = body.specs ? JSON.stringify(body.specs) : null;

    updates.updated_at = new Date().toISOString();

    await db('products').where({ id }).update(updates);

    const updated = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name')
      .where('products.id', id)
      .first();

    return success(res, formatProduct(updated), 'Produk berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/admin/products/:id
 * Hapus produk
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await db('products').where({ id }).first();
    if (!existing) {
      return error(res, 'Produk tidak ditemukan.', 404);
    }

    await db('products').where({ id }).delete();

    console.log(`[ADMIN] Product deleted: ${existing.name} (${id}) by admin ${req.admin?.email}`);

    return success(res, null, 'Produk berhasil dihapus.');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, delete: remove };
