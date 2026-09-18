// validators/categoryValidator.js
// Sesuai FE_HANDOFF.md §6.2 Data Dictionary

const Joi = require('joi');

// Schema untuk CREATE
const categoryCreateSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Nama kategori minimal 2 karakter.',
      'string.max': 'Nama kategori maksimal 50 karakter.',
      'any.required': 'Nama kategori wajib diisi.',
    }),

  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip (-).',
      'any.required': 'Slug wajib diisi.',
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Deskripsi kategori maksimal 500 karakter.',
    }),

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE')
    .optional()
    .default('ACTIVE')
    .messages({
      'any.only': 'Status harus ACTIVE atau INACTIVE.',
    }),
});

// Schema untuk UPDATE
const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional(),
  description: Joi.string().max(500).optional().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
}).min(1).messages({
  'object.min': 'Minimal satu field harus dikirim untuk update.',
});

module.exports = { categoryCreateSchema, categoryUpdateSchema };
