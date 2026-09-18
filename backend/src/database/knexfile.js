// src/database/knexfile.js
// Digunakan oleh CLI knex untuk migration dan seed

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const path = require('path');

/**
 * @type { import("knex").Knex.Config }
 */
module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '../../', process.env.DB_PATH || 'database.sqlite'),
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    },
  },
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
  },
};
