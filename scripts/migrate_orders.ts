import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER || 'KSw7UUJWJpp5ptg.root',
    password: process.env.DB_PASSWORD || '4sZBSVZWw7Fcqvc5',
    database: process.env.DB_NAME || 'Yombe',
    ssl: { rejectUnauthorized: true, minVersion: 'TLSv1.2' }
  });

  try {
    // Create orders table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        client_id BIGINT NOT NULL,
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        total DECIMAL(10,2) NOT NULL,
        delivery_address TEXT,
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('orders checked');

    // Make sure delivery_address exists
    try {
      await pool.query('ALTER TABLE orders ADD COLUMN delivery_address TEXT');
    } catch(e: any) { /* ignore duplicate column */ }
    
    try {
      await pool.query('ALTER TABLE orders ADD COLUMN phone VARCHAR(50)');
    } catch(e: any) { /* ignore duplicate column */ }

    // Create order_items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        size VARCHAR(20),
        price_at_purchase DECIMAL(10,2) NOT NULL
      )
    `);
    console.log('order_items checked');
    
    // Change product_id to VARCHAR(100) in case it was BIGINT
    try {
      await pool.query('ALTER TABLE order_items MODIFY COLUMN product_id VARCHAR(100) NOT NULL');
    } catch(e: any) {}

    // Add size column if missing
    try {
      await pool.query('ALTER TABLE order_items ADD COLUMN size VARCHAR(20)');
    } catch(e: any) {}

  } catch (e: any) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
