// src/app.js
// Express application setup
// Middleware order: helmet → cors → body-parser → routes → 404 handler → error handler

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { error } = require('./helpers/response');

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
// helmet() mengaktifkan: X-Content-Type-Options, Referrer-Policy,
// X-DNS-Prefetch-Control, X-Download-Options, X-Permitted-Cross-Domain-Policies
// Frameguard (X-Frame-Options), HSTS (di production dengan HTTPS)
app.use(helmet());
app.use(cookieParser());

// ─── CORS ────────────────────────────────────────────────────────────────────
// Whitelist hanya URL frontend dari env — TIDAK menggunakan wildcard *
// Sesuai PRD §35 dan FE_HANDOFF.md §15.1
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (misal: curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy tidak mengizinkan origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parser ──────────────────────────────────────────────────────────────
// Batasi ukuran body 1mb — mencegah oversized request (PRD §41)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KoleksiKita Backend API',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// Route yang tidak ditemukan
app.use((req, res) => {
  error(res, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`, 404);
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Harus di-mount TERAKHIR — tangkap semua error dari next(err)
app.use(errorHandler);

module.exports = app;
