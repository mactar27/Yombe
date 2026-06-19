/**
 * Migration: add phone column to users, make login phone-based
 * Run: pnpm tsx scripts/migrate-phone-auth.ts
 */
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER || 'KSw7UUJWJpp5ptg.root',
  password: process.env.DB_PASSWORD || '4sZBSVZWw7Fcqvc5',
  database: process.env.DB_NAME || 'Yombe',
  ssl: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
})

async function run() {
  const conn = await pool.getConnection()

  // Add phone column if not exists
  try {
    await conn.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(50) UNIQUE`)
    console.log('✅ phone column added')
  } catch (e: any) {
    if (e.code === 'ER_DUP_FIELDNAME' || e.message?.includes('Duplicate column')) {
      console.log('ℹ️  phone column already exists')
    } else {
      throw e
    }
  }

  // Update admin user to have a phone number for testing
  await conn.query(`UPDATE users SET phone = '+221770000000' WHERE role = 'admin' AND (phone IS NULL OR phone = '')`)
  console.log('✅ admin phone updated')

  conn.release()
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
