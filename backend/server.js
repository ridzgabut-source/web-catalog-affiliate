// server.js — Entry point
// 1. Load env vars
// 2. Run Knex migrations (idempotent)
// 3. Start Express server

require('dotenv').config();

const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Run migrations (idempotent — safe to run on every startup)
    // Seeds are NOT run here. Use: npm run db:seed
    console.log('⏳ Running database migrations...');
    await db.migrate.latest({
      directory: './src/database/migrations',
    });
    console.log('✅ Database migrations up to date.');

    app.listen(PORT, () => {
      console.log(`\n🚀 KoleksiKita Backend running`);
      console.log(`   ENV  : ${NODE_ENV}`);
      console.log(`   PORT : http://localhost:${PORT}`);
      console.log(`   API  : http://localhost:${PORT}/api/v1\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
