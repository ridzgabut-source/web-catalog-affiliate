// routes/public/products.js

const express = require('express');
const router = express.Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const productController = require('../../controllers/public/productController');

// GET /api/v1/products
router.get('/', publicLimiter, productController.list);

// GET /api/v1/products/:slug
// CATATAN: Route ini harus di bawah route spesifik lain jika ada (misal /products/featured)
// Saat ini tidak ada karena FE menggunakan query param ?featured=true
router.get('/:slug', publicLimiter, productController.detail);

module.exports = router;
