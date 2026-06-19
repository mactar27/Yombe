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
  try {
    const [orders] = await pool.query('DESCRIBE orders');
    console.log('ORDERS:', orders);
    const [orderItems] = await pool.query('DESCRIBE order_items');
    console.log('ORDER_ITEMS:', orderItems);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
