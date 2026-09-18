// controllers/authController.js
// Authentication: login, logout, me
// Sesuai FE_HANDOFF.md §7 dan plan §9 (Authentication Flow)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { success, error } = require('../helpers/response');

/**
 * POST /api/v1/auth/login
 * Validasi kredensial admin → return JWT token
 *
 * SECURITY:
 * - Pesan error sengaja sama untuk email salah & password salah
 *   (mencegah user enumeration / username probing)
 * - Password hash selalu dikomparasi (bcrypt.compare) sebelum return error
 *   untuk mencegah timing attack berbasis cache
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Cari admin berdasarkan email (parameterized query via Knex)
    const admin = await db('admins')
      .select('id', 'email', 'name', 'role', 'password_hash')
      .where({ email: email.toLowerCase().trim() })
      .first();

    // Selalu jalankan bcrypt.compare untuk mencegah timing attack
    // Gunakan dummy hash jika admin tidak ditemukan
    const dummyHash = '$2a$12$invalidhashtopreventtimingattackXXXXXXXXXXXXXXXXXXXXXX';
    const hashToCompare = admin ? admin.password_hash : dummyHash;

    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    if (!admin || !isPasswordValid) {
      // Pesan generik — tidak membedakan email vs password salah
      return error(res, 'Email atau password salah.', 401);
    }

    // Log failed login jika admin ada tapi password salah (untuk audit)
    // (Kasus ini sudah ter-handle di atas dengan return, tapi log di server)

    // Sign JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Set HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return admin data (password_hash & token TIDAK disertakan)
    return success(
      res,
      {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      'Login berhasil.',
      200
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/logout
 * Stateless JWT logout — backend return 200
 *
 * BEHAVIOR (documented per plan):
 * Token revocation aktual terjadi di sisi client (FE hapus token dari localStorage).
 * Backend tidak menyimpan token blacklist untuk MVP.
 * Jika dibutuhkan force-logout di masa depan, dapat ditambahkan Redis token blacklist.
 *
 * Endpoint ini masih dilindungi auth middleware sehingga:
 * - Request tanpa token → 401 (dari auth middleware)
 * - Request dengan token valid → 200 (logout berhasil)
 */
async function logout(req, res, next) {
  try {
    // req.admin sudah diisi oleh auth middleware
    // Hapus cookie
    res.clearCookie('token');
    return success(res, null, 'Logout berhasil. Sesi telah diakhiri.');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/auth/me
 * Validasi session & return profil admin aktif
 * req.admin sudah diisi oleh auth middleware
 */
async function me(req, res, next) {
  try {
    return success(res, req.admin);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };
