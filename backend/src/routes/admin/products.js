// routes/admin/products.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { adminLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const { productCreateSchema, productUpdateSchema } = require('../../validators/productValidator');
const productController = require('../../controllers/admin/productController');

// GET /api/v1/admin/products
router.get('/', adminLimiter, auth, productController.list);

// POST /api/v1/admin/products
router.post('/', adminLimiter, auth, validate(productCreateSchema), productController.create);

// PUT /api/v1/admin/products/:id
// Digunakan juga untuk status toggle: { "status": "ACTIVE" } atau { "status": "INACTIVE" }
router.put('/:id', adminLimiter, auth, validate(productUpdateSchema), productController.update);

// DELETE /api/v1/admin/products/:id
router.delete('/:id', adminLimiter, auth, productController.delete);

module.exports = router;
