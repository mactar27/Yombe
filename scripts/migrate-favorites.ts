/**
 * Migration: add favorites table
 * Run: pnpm tsx scripts/migrate-favorites.ts
 */
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Yombe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  ssl: process.env.DB_HOST?.includes('tidbcloud') ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
})

async function run() {
  const conn = await pool.getConnection()

  // Create favorites table
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ favorites table created')
  } catch (e: any) {
    if (e.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  favorites table already exists')
    } else {
      throw e
    }
  }

  conn.release()
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
