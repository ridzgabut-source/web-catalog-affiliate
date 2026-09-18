// controllers/public/categoryController.js
// Public endpoints — hanya kategori ACTIVE, tanpa auth

const db = require('../../config/database');
const { success, error } = require('../../helpers/response');

/**
 * GET /api/v1/categories
 * Daftar semua kategori aktif + computed product_count
 */
async function list(req, res, next) {
  try {
    const categories = await db('categories')
      .select(
        'categories.id',
        'categories.name',
        'categories.slug',
        'categories.description',
        'categories.status',
        'categories.created_at',
        'categories.updated_at',
        // Computed product_count: hanya produk ACTIVE yang dihitung untuk public
        db.raw(
          '(SELECT COUNT(*) FROM products WHERE products.category_id = categories.id AND products.status = ?) as product_count',
          ['ACTIVE']
        )
      )
      .where('categories.status', 'ACTIVE')
      .orderBy('categories.name', 'asc');

    // Konversi product_count ke integer
    const result = categories.map((cat) => ({
      ...cat,
      product_count: Number(cat.product_count),
    }));

    return success(res, result, null, 200);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/categories/:slug
 * Detail satu kategori berdasarkan slug
 */
async function detail(req, res, next) {
  try {
    const { slug } = req.params;

    const category = await db('categories')
      .select(
        'categories.id',
        'categories.name',
        'categories.slug',
        'categories.description',
        'categories.status',
        'categories.created_at',
        'categories.updated_at',
        db.raw(
          '(SELECT COUNT(*) FROM products WHERE products.category_id = categories.id AND products.status = ?) as product_count',
          ['ACTIVE']
        )
      )
      .where({ 'categories.slug': slug })
      .first();

    if (!category) {
      return error(res, 'Kategori tidak ditemukan.', 404);
    }

    return success(res, {
      ...category,
      product_count: Number(category.product_count),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, detail };
