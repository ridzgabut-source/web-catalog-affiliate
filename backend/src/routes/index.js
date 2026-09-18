// routes/index.js
// Mount semua route ke prefix /api/v1

const express = require('express');
const router = express.Router();

// Public routes
const publicProductsRouter = require('./public/products');
const publicCategoriesRouter = require('./public/categories');

// Auth routes
const authRouter = require('./auth');

// Admin routes
const adminProductsRouter = require('./admin/products');
const adminCategoriesRouter = require('./admin/categories');

// Mount public
router.use('/products', publicProductsRouter);
router.use('/categories', publicCategoriesRouter);

// Mount auth
router.use('/auth', authRouter);

// Mount admin (auth per-route di masing-masing router)
router.use('/admin/products', adminProductsRouter);
router.use('/admin/categories', adminCategoriesRouter);

module.exports = router;
