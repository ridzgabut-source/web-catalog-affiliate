// migrations/20260913_001_create_admins.js
// Tabel admins — penamaan konsisten di seluruh codebase (bukan 'users')

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('admins', (table) => {
    table.string('id').primary();                        // UUID v4
    table.string('email').unique().notNullable();        // Login identifier
    table.string('name').notNullable();
    table.string('password_hash').notNullable();         // bcryptjs hash — BUKAN plaintext
    table.string('role').notNullable().defaultTo('ADMIN');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('admins');
};
