const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true, minVersion: 'TLSv1.2' }
  });
  const [users] = await pool.query('DESCRIBE users');
  console.log('USERS:', users);
  const [clients] = await pool.query('DESCRIBE clients');
  console.log('CLIENTS:', clients);
  process.exit(0);
}
run();
