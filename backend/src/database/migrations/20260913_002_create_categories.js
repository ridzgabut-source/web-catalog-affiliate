// migrations/20260913_002_create_categories.js

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('categories', (table) => {
    table.string('id').primary();                                    // UUID v4
    table.string('name', 50).notNullable();                          // min 2, max 50 char
    table.string('slug').unique().notNullable();                     // url-safe, lowercase, UNIQUE INDEX
    table.text('description');                                       // max 500 char, optional
    table.string('status').notNullable().defaultTo('ACTIVE');        // ENUM: 'ACTIVE' | 'INACTIVE'
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  }).then(() =>
    knex.schema.raw('CREATE INDEX idx_categories_status ON categories(status)')
  );
  // slug UNIQUE INDEX dibuat otomatis oleh .unique()
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('categories');
};
