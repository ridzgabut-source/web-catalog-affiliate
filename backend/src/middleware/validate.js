// middleware/validate.js
// Wrapper Joi validation — memformat error menjadi field-per-field
// Mengembalikan HTTP 422 dengan envelope errors sesuai FE_HANDOFF.md §4.2

const { error } = require('../helpers/response');

/**
 * Factory function — buat middleware validasi dari Joi schema
 * @param {import('joi').ObjectSchema} schema - Joi schema untuk req.body
 * @returns {import('express').RequestHandler}
 *
 * Usage:
 *   router.post('/', validate(productCreateSchema), controller.create)
 */
function validate(schema) {
  return (req, res, next) => {
    const { error: validationError, value } = schema.validate(req.body, {
      abortEarly: false,     // Kumpulkan SEMUA error, bukan hanya error pertama
      allowUnknown: false,   // Tolak field yang tidak didefinisikan di schema
      stripUnknown: true,    // Hapus field yang tidak dikenal dari value
    });

    if (validationError) {
      // Format Joi errors menjadi { fieldName: ['pesan error'] }
      const errors = {};
      for (const detail of validationError.details) {
        // key dari Joi bisa nested (e.g., "specs.key") — ambil field pertama
        const field = detail.path.join('.');
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(detail.message);
      }

      return error(res, 'Validasi gagal. Periksa kembali data yang dikirim.', 422, errors);
    }

    // Ganti req.body dengan value yang sudah di-strip dan di-cast Joi
    req.body = value;
    next();
  };
}

module.exports = validate;
