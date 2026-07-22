const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'newsletter',
  password: String(process.env.DB_PASSWORD || 'changeme'),
  database: process.env.DB_NAME || 'newsletter',
});

module.exports = pool;