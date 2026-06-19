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
    const id = 3;
    const [orderRows] = await pool.execute(
      'SELECT o.*, c.name as client_name, c.email as client_email FROM orders o LEFT JOIN clients c ON c.id = o.client_id WHERE o.id = ?',
      [id]
    ) as any[];
    console.log(orderRows);
    
    if (orderRows.length > 0) {
      const [itemsRows] = await pool.execute(
        'SELECT oi.*, p.name as product_name, p.image as product_image FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?',
        [id]
      ) as any[];
      console.log(itemsRows);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
run();
