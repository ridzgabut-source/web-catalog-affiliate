// middleware/auth.js
// JWT verification middleware
// Injeksi req.admin jika token valid
// Return 401 jika token tidak ada, invalid, atau admin tidak ditemukan di DB

const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { error } = require('../helpers/response');

/**
 * Auth middleware — lindungi semua route admin & /auth/me /auth/logout
 */
async function auth(req, res, next) {
  try {
    // 1. Ambil token dari cookie, atau fallback dari header Authorization
    let token = req.cookies && req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return error(res, 'Autentikasi diperlukan. Token tidak valid atau tidak ditemukan.', 401);
    }

    // 2. Verify JWT signature & expiry
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return error(res, 'Sesi telah berakhir. Silakan login kembali.', 401);
      }
      return error(res, 'Token tidak valid.', 401);
    }

    // 3. Pastikan admin masih ada di database
    // (proteksi jika admin dihapus manual dari DB setelah token diterbitkan)
    const admin = await db('admins')
      .select('id', 'email', 'name', 'role')
      .where({ id: payload.id })
      .first();

    if (!admin) {
      return error(res, 'Akun tidak ditemukan.', 401);
    }

    // 4. Inject ke request — bisa diakses di controller
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = auth;
