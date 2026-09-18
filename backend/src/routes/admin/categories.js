// routes/admin/categories.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { adminLimiter } = require('../../middleware/rateLimiter');
const validate = require('../../middleware/validate');
const { categoryCreateSchema, categoryUpdateSchema } = require('../../validators/categoryValidator');
const categoryController = require('../../controllers/admin/categoryController');

// Semua route admin dilindungi auth middleware + adminLimiter
// Urutan middleware: adminLimiter → auth → [validate] → controller

// GET /api/v1/admin/categories
router.get('/', adminLimiter, auth, categoryController.list);

// POST /api/v1/admin/categories
router.post('/', adminLimiter, auth, validate(categoryCreateSchema), categoryController.create);

// PUT /api/v1/admin/categories/:id
router.put('/:id', adminLimiter, auth, validate(categoryUpdateSchema), categoryController.update);

// DELETE /api/v1/admin/categories/:id
router.delete('/:id', adminLimiter, auth, categoryController.delete);

module.exports = router;
