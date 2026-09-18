// controllers/public/productController.js
// Public endpoints — hanya produk ACTIVE, tanpa auth
// Mendukung: search, category filter, sort allowlist, featured filter, pagination

const db = require('../../config/database');
const { success, error } = require('../../helpers/response');

// Sort allowlist — TIDAK menerima nama kolom SQL mentah dari request
// Sesuai FE_HANDOFF.md §9
const SORT_MAP = {
  newest:     { col: 'products.created_at', dir: 'desc' },
  price_asc:  { col: 'products.price',      dir: 'asc'  },
  price_desc: { col: 'products.price',      dir: 'desc' },
};
const DEFAULT_SORT = 'newest';

/**
 * Sanitasi deskripsi: strip tag <script> dan event handler
 * Ini di sisi output — penyimpanan sudah disanitasi di admin controller
 */
function sanitizeForOutput(str) {
  if (!str) return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

/**
 * Format product row dari DB ke response format FE
 * - is_featured: INTEGER 0/1 → boolean
 * - specs: JSON string → object
 * - category_name: dari JOIN
 */
function formatProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id,
    category_name: row.category_name || null,
    description: sanitizeForOutput(row.description),
    price: row.price,
    original_price: row.original_price || null,
    image: row.image,
    affiliate_url: row.button1_url, // For backwards compatibility if any frontend still uses it temporarily
    button1_url: row.button1_url,
    button1_text: row.button1_text || null,
    button2_url: row.button2_url || null,
    button2_text: row.button2_text || null,
    is_featured: row.is_featured === 1 || row.is_featured === true,
    status: row.status,
    specs: row.specs ? (() => { try { return JSON.parse(row.specs); } catch { return null; } })() : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * GET /api/v1/products
 * Query params: search, category, sort, featured, page, per_page
 */
async function list(req, res, next) {
  try {
    const {
      search,
      category,
      sort = DEFAULT_SORT,
      featured,
      page = '1',
      per_page = '6',
      limit, // alias untuk per_page (digunakan FE di beberapa tempat)
    } = req.query;

    // Validasi & normalisasi pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const rawPerPage = parseInt(limit || per_page, 10) || 6;
    const perPage = Math.min(50, Math.max(1, rawPerPage)); // cap 1–50
    const offset = (pageNum - 1) * perPage;

    // Validasi sort — gunakan default jika tidak ada di allowlist
    const sortKey = SORT_MAP[sort] ? sort : DEFAULT_SORT;
    const { col: sortCol, dir: sortDir } = SORT_MAP[sortKey];

    // Base query — JOIN kategori untuk ambil category_name (hindari N+1)
    let query = db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select(
        'products.*',
        'categories.name as category_name'
      )
      .where('products.status', 'ACTIVE');

    // Filter: search (LIKE, parameterized via Knex — bukan string concatenation)
    if (search && typeof search === 'string') {
      const searchTerm = search.trim().substring(0, 100); // max 100 char
      if (searchTerm) {
        query = query.where((builder) => {
          builder
            .whereILike('products.name', `%${searchTerm}%`)
            .orWhereILike('products.description', `%${searchTerm}%`);
        });
      }
    }

    // Filter: category (slug atau id)
    if (category && typeof category === 'string') {
      const cat = await db('categories')
        .select('id')
        .where('slug', category)
        .orWhere('id', category)
        .first();
      if (cat) {
        query = query.where('products.category_id', cat.id);
      }
      // Jika kategori tidak ditemukan, hasil akan kosong (bukan error)
    }

    // Filter: featured
    if (featured === 'true') {
      query = query.where('products.is_featured', 1);
    }

    // Hitung total untuk pagination (clone query sebelum offset/limit)
    const countResult = await query.clone().count('products.id as total').first();
    const total = Number(countResult?.total || 0);
    const totalPages = Math.ceil(total / perPage);

    // Ambil data dengan sort + pagination
    const rows = await query
      .orderBy(sortCol, sortDir)
      .limit(perPage)
      .offset(offset);

    const items = rows.map(formatProduct);

    return success(res, {
      items,
      pagination: {
        total,
        page: pageNum,
        per_page: perPage,
        total_pages: totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products/:slug
 * Detail satu produk aktif berdasarkan slug
 * Produk INACTIVE tidak bisa diakses via public endpoint (return 404)
 */
async function detail(req, res, next) {
  try {
    const { slug } = req.params;

    const row = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select(
        'products.*',
        'categories.name as category_name'
      )
      .where('products.slug', slug)
      .where('products.status', 'ACTIVE')
      .first();

    if (!row) {
      return error(res, 'Produk tidak ditemukan.', 404);
    }

    return success(res, formatProduct(row));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, detail, formatProduct };
