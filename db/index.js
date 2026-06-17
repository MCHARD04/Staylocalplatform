const { Pool } = require('pg');

const useSSL = process.env.DATABASE_SSL !== 'false';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

pool.on('error', err => console.error('[Postgres] Unexpected pool error:', err.message));

module.exports = pool;
