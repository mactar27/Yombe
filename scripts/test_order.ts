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
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const clientId = 30003; // Using Mactar's client id
      const total = 14000;
      const address = 'Kandialang';
      const phone = '773519128';

      const [orderResult] = await conn.execute(
        'INSERT INTO orders (client_id, status, total, delivery_address, phone) VALUES (?, ?, ?, ?, ?)',
        [clientId, 'pending', total, address, phone]
      ) as any[]

      const orderId = orderResult.insertId
      console.log('Order created:', orderId)

      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, size, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
        [orderId, 'ballon-match-officiel', 1, 'Taille 5', 12000]
      )
      console.log('Order items created')

      await conn.rollback() // don't actually save
      console.log('Success')
    } catch (err: any) {
      console.error('Error in transaction:', err.message)
    } finally {
      conn.release()
    }
  } catch (err: any) {
    console.error('Error connecting:', err.message);
  }
  process.exit(0);
}
run();
