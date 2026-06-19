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
    const newId = Date.now().toString();
    const name = 'Test Product';
    const description = null;
    const price = 7000;
    const image = null;
    const inStock = 1;
    const category = null;

    const [result] = await pool.execute(
      'INSERT INTO products (id, name, description, price, image, in_stock, category, audience, sizes, colors) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [newId, name, description, price, image, inStock, category, '[]', '[]', '[]']
    );
    console.log(result);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
run();
