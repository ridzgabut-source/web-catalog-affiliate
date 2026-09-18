// routes/auth.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { loginLimiter, adminLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators/authValidator');
const authController = require('../controllers/authController');

// POST /api/v1/auth/login — rate limit ketat, validasi Joi
router.post('/login', loginLimiter, validate(loginSchema), authController.login);

// POST /api/v1/auth/logout — wajib autentikasi, rate limit admin
router.post('/logout', adminLimiter, auth, authController.logout);

// GET /api/v1/auth/me — wajib autentikasi
router.get('/me', adminLimiter, auth, authController.me);

module.exports = router;
