/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    table.string('button3_url', 2048).nullable();
    table.string('button3_text', 100).nullable();
    table.decimal('button3_price', 12, 2).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('button3_url');
    table.dropColumn('button3_text');
    table.dropColumn('button3_price');
  });
};
