// validators/productValidator.js
// Sesuai FE_HANDOFF.md §6.1 Data Dictionary

const Joi = require('joi');

// Schema untuk CREATE (semua required field harus ada)
const productCreateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      'string.min': 'Nama produk minimal 3 karakter.',
      'string.max': 'Nama produk maksimal 150 karakter.',
      'any.required': 'Nama produk wajib diisi.',
    }),

  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip (-).',
      'any.required': 'Slug wajib diisi.',
    }),

  category_id: Joi.string()
    .required()
    .messages({
      'any.required': 'Kategori wajib dipilih.',
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Harga harus berupa angka.',
      'number.min': 'Harga tidak boleh negatif.',
      'any.required': 'Harga wajib diisi.',
    }),

  original_price: Joi.number()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Harga asli harus berupa angka.',
      'number.min': 'Harga asli tidak boleh negatif.',
    }),

  image: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .max(2048)
    .required()
    .messages({
      'string.uri': 'URL gambar tidak valid.',
      'string.max': 'URL gambar maksimal 2048 karakter.',
      'any.required': 'URL gambar wajib diisi.',
    }),

  // Tombol 1 WAJIB https://
  button1_url: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .max(2048)
    .required()
    .messages({
      'string.uri': 'URL Tombol 1 harus valid (http/https).',
      'string.max': 'URL Tombol 1 maksimal 2048 karakter.',
      'any.required': 'URL Tombol 1 wajib diisi.',
    }),

  button1_text: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .default('Beli Sekarang')
    .messages({
      'string.max': 'Teks Tombol 1 maksimal 100 karakter.',
    }),

  // Tombol 2 OPSIONAL
  button2_url: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .max(2048)
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'URL Tombol 2 harus valid (http/https).',
      'string.max': 'URL Tombol 2 maksimal 2048 karakter.',
    }),

  button2_text: Joi.string()
    .max(100)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Teks Tombol 2 maksimal 100 karakter.',
    }),

  is_featured: Joi.boolean()
    .optional()
    .default(false),

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE')
    .optional()
    .default('ACTIVE')
    .messages({
      'any.only': 'Status harus ACTIVE atau INACTIVE.',
    }),

  description: Joi.string()
    .optional()
    .allow(null, '')
    .max(5000),

  specs: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional()
    .allow(null),
});

// Schema untuk UPDATE (semua field optional — PATCH semantics via PUT)
const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(150).optional(),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional(),
  category_id: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  original_price: Joi.number().min(0).optional().allow(null),
  image: Joi.string().uri({ scheme: ['https', 'http'] }).max(2048).optional(),
  button1_url: Joi.string().uri({ scheme: ['https', 'http'] }).max(2048).optional(),
  button1_text: Joi.string().max(100).optional().allow(null, ''),
  button2_url: Joi.string().uri({ scheme: ['https', 'http'] }).max(2048).optional().allow(null, ''),
  button2_text: Joi.string().max(100).optional().allow(null, ''),
  is_featured: Joi.boolean().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
  description: Joi.string().optional().allow(null, '').max(5000),
  specs: Joi.object().pattern(Joi.string(), Joi.string()).optional().allow(null),
}).min(1).messages({
  'object.min': 'Minimal satu field harus dikirim untuk update.',
});

module.exports = { productCreateSchema, productUpdateSchema };
