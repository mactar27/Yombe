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
    // 1. Add columns to users
    console.log('Adding columns to users...');
    try {
      await pool.query("ALTER TABLE users ADD COLUMN phone VARCHAR(50)");
    } catch(e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN address TEXT");
    } catch(e) {}
    
    // 2. Add role if missing (though it seems to exist)
    try {
      await pool.query("ALTER TABLE users ADD COLUMN role ENUM('admin', 'client') DEFAULT 'client'");
    } catch(e) {}

    // 3. Migrate clients to users
    console.log('Migrating clients to users...');
    const [clients]: any = await pool.query('SELECT * FROM clients');
    for (const client of clients) {
      // Check if user already exists
      const [existingUser]: any = await pool.query('SELECT id FROM users WHERE email = ?', [client.email]);
      if (existingUser.length === 0) {
        // Insert as client (no password for now, since they might be guest or we can set a dummy)
        await pool.query(
          'INSERT INTO users (name, email, password_hash, role, phone, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [client.name, client.email, 'guest_account', 'client', client.phone, client.address, client.created_at]
        );
      } else {
        // Update existing user with phone and address if missing
        await pool.query(
          'UPDATE users SET phone = COALESCE(phone, ?), address = COALESCE(address, ?) WHERE email = ?',
          [client.phone, client.address, client.email]
        );
      }
    }

    // 4. Update orders table to use user_id instead of client_id if needed,
    // Actually we'll make client_id nullable and add client_name, client_email, phone, delivery_address
    console.log('Updating orders table...');
    try {
      await pool.query("ALTER TABLE orders MODIFY COLUMN client_id BIGINT NULL");
    } catch(e) { console.error(e) }
    try {
      await pool.query("ALTER TABLE orders ADD COLUMN client_name VARCHAR(255)");
    } catch(e) {}
    try {
      await pool.query("ALTER TABLE orders ADD COLUMN client_email VARCHAR(255)");
    } catch(e) {}
    
    // 5. Update existing orders with client details
    const [orders]: any = await pool.query('SELECT o.id, c.name, c.email FROM orders o JOIN clients c ON o.client_id = c.id');
    for (const order of orders) {
      await pool.query('UPDATE orders SET client_name = ?, client_email = ? WHERE id = ?', [order.name, order.email, order.id]);
    }

    console.log('Migration completed.');

  } catch (e: any) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
