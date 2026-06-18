import mysql from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined
}

function createPool() {
  return mysql.createPool({
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
}

// Singleton — réutilise le pool en dev pour éviter les connexions multiples (HMR)
const pool = globalThis._mysqlPool ?? createPool()
if (process.env.NODE_ENV !== 'production') {
  globalThis._mysqlPool = pool
}

export default pool

export async function query<T = mysql.RowDataPacket[]>(
  sql: string,
  values?: unknown[]
): Promise<T> {
  const [rows] = await pool.execute(sql, values)
  return rows as T
}
