// middleware/errorHandler.js
// Global Express error handler — tangkap semua error yang di-next(err)
// Di production: tidak bocorkan stack trace ke client
// Log detail ke server console

const { error } = require('../helpers/response');

/**
 * Global error handler middleware
 * Harus di-mount TERAKHIR di app.js setelah semua route
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log detail di server (termasuk stack trace) — JANGAN log password/token
  console.error('❌ Unhandled error:', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: isProduction ? '[hidden in production]' : err.stack,
  });

  // Handle known error types
  if (err.type === 'entity.parse.failed') {
    // JSON parse error dari body-parser
    return error(res, 'Format JSON tidak valid.', 400);
  }

  // Default: 500 Internal Server Error
  // Di production: pesan generik. Di dev: tampilkan message asli untuk debug.
  const message = isProduction
    ? 'Terjadi kesalahan pada server. Silakan coba lagi.'
    : err.message || 'Internal server error.';

  return error(res, message, err.statusCode || 500);
}

module.exports = errorHandler;
