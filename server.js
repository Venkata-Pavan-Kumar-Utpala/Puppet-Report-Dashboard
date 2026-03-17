/**
 * Puppet Report Dashboard - Main Server
 * Student: Venkata Pavan Kumar Utpala
 * Reg No:  23FE10CSE00388
 * Course:  CSE3253 DevOps [PE6]
 *
 * This server receives Puppet run reports from agents, stores them,
 * and serves a web dashboard showing node status and run history.
 */

'use strict';

const express = require('express');
const path    = require('path');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));        // Puppet reports can be large
app.use(express.text({ type: 'application/x-yaml', limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes ──────────────────────────────────────────────────────────────────
const reportsRouter  = require('./routes/reports');
const nodesRouter    = require('./routes/nodes');
const healthRouter   = require('./routes/health');
const dashboardRouter = require('./routes/dashboard');

app.use('/api/reports',   reportsRouter);
app.use('/api/nodes',     nodesRouter);
app.use('/api/health',    healthRouter);
app.use('/api/dashboard', dashboardRouter);

// Root → serve dashboard UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status || 500).json({
    error: { message: err.message || 'Internal Server Error', status: err.status || 500 },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[INFO] Puppet Report Dashboard running on http://localhost:${PORT}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[INFO] Report receiver: POST http://localhost:${PORT}/api/reports`);
});

module.exports = app;
