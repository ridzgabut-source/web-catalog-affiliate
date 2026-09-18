// middleware/rateLimiter.js
// Rate limiting per route group sesuai PRD §27 dan FE_HANDOFF.md §15.2
// publicLimiter  : GET /products, GET /categories       → 120 req/min/IP
// loginLimiter   : POST /auth/login                     → 10 req/min/IP (ketat)
// adminLimiter   : semua /admin/* + /auth/me, /logout   → 60 req/min/IP

const rateLimit = require('express-rate-limit');
const { error } = require('../helpers/response');

/**
 * Handler ketika rate limit tercapai
 * Mengembalikan response envelope standar (bukan default HTML)
 */
const rateLimitHandler = (req, res) => {
  return error(
    res,
    'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.',
    429
  );
};

/**
 * Public API limiter — untuk endpoint GET publik yang bisa diakses bot/crawler
 * Cukup longgar karena endpoint ini boleh di-crawl search engine
 */
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 menit
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => process.env.NODE_ENV === 'test', // Skip di mode test
});

/**
 * Login limiter — ketat untuk mencegah brute force
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 menit
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false, // Hitung semua request, termasuk yang berhasil
});

/**
 * Admin limiter — untuk endpoint admin yang sudah terproteksi auth
 */
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 menit
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { publicLimiter, loginLimiter, adminLimiter };
