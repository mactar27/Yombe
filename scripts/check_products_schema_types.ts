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
    const [cols] = await pool.query(`SHOW FULL COLUMNS FROM products`);
    console.log(cols.map((c: any) => `${c.Field}: ${c.Type}`).join('\n'));
  } catch (err: any) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}
run();
