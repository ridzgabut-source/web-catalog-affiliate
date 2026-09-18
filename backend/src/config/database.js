// src/config/database.js
// Singleton Knex instance menggunakan SQLite (sqlite3 — prebuilt binary, no native build required)

require('dotenv').config();
const knex = require('knex');
const path = require('path');

const dbPath = path.resolve(process.env.DB_PATH || './database.sqlite');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  // SQLite: aktifkan foreign key constraints via run setelah koneksi dibuat
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    },
  },
});

module.exports = db;
