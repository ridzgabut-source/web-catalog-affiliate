// helpers/response.js
// Standard response envelope builder sesuai FE_HANDOFF.md §4
// Success:    { success: true,  data: ...,  message: null }
// Error:      { success: false, data: null, message: "..." }
// Validation: { success: false, data: null, message: "...", errors: {...} }

/**
 * Kirim success response
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string|null} message
 * @param {number} statusCode
 */
function success(res, data = null, message = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

/**
 * Kirim error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {object|null} errors - field-level validation errors
 */
function error(res, message, statusCode = 500, errors = null) {
  const body = {
    success: false,
    data: null,
    message,
  };
  if (errors) {
    body.errors = errors;
  }
  return res.status(statusCode).json(body);
}

module.exports = { success, error };
