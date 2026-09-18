// migrations/20260913_003_create_products.js

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('products', (table) => {
    table.string('id').primary();                                       // UUID v4
    table.string('name', 150).notNullable();                            // min 3, max 150 char
    table.string('slug').unique().notNullable();                        // url-safe, UNIQUE INDEX
    table.string('category_id').notNullable()
      .references('id').inTable('categories')
      .onDelete('RESTRICT');                                            // Tolak delete kategori yang masih dipakai
    table.text('description');                                          // optional, disanitasi
    table.float('price').notNullable();                                 // >= 0, IDR
    table.float('original_price');                                      // optional, >= 0
    table.string('image', 2048).notNullable();                          // URL valid
    table.string('affiliate_url', 2048).notNullable();                  // wajib https://
    table.string('marketplace_type', 20);                               // ENUM: shopee|tokopedia|tiktok|generic
    table.integer('is_featured').notNullable().defaultTo(0);            // SQLite 0/1 boolean
    table.string('status').notNullable().defaultTo('ACTIVE');           // ENUM: ACTIVE | INACTIVE
    table.text('specs');                                                // JSON string, optional
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Additional indexes for performance
  await knex.schema.raw('CREATE INDEX idx_products_category_id ON products(category_id)');
  await knex.schema.raw('CREATE INDEX idx_products_status ON products(status)');
  await knex.schema.raw('CREATE INDEX idx_products_is_featured ON products(is_featured)');
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};
