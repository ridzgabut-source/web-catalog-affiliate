// routes/public/categories.js

const express = require('express');
const router = express.Router();
const { publicLimiter } = require('../../middleware/rateLimiter');
const categoryController = require('../../controllers/public/categoryController');

// GET /api/v1/categories
router.get('/', publicLimiter, categoryController.list);

// GET /api/v1/categories/:slug
router.get('/:slug', publicLimiter, categoryController.detail);

module.exports = router;
