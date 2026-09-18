/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    // Ubah affiliate_url jadi button1_url
    table.renameColumn('affiliate_url', 'button1_url');
    // Ubah marketplace_type jadi button1_text
    table.renameColumn('marketplace_type', 'button1_text');
    
    // Tambah tombol 2 opsional
    table.string('button2_url', 2048).nullable();
    table.string('button2_text', 100).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('products', (table) => {
    table.renameColumn('button1_url', 'affiliate_url');
    table.renameColumn('button1_text', 'marketplace_type');
    table.dropColumn('button2_url');
    table.dropColumn('button2_text');
  });
};
