/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    table.decimal('button1_price', 12, 2).nullable();
    table.decimal('button2_price', 12, 2).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('button1_price');
    table.dropColumn('button2_price');
  });
};
