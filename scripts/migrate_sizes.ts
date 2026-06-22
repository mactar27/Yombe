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
    console.log('Migrating sizes in products table...');
    const [products]: any = await pool.query('SELECT id, sizes, in_stock FROM products');
    
    for (const product of products) {
      if (!product.sizes) continue;
      
      let sizesObj: any = {};
      let parsedSizes: any = [];
      try {
        parsedSizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
      } catch (e) {
        continue;
      }

      // If it's already an object (not array), skip or convert
      if (typeof parsedSizes === 'object' && !Array.isArray(parsedSizes)) {
        continue; // Already migrated
      }

      if (Array.isArray(parsedSizes)) {
        // Distribute stock among sizes or just give them default if in_stock > 0
        const stockPerSize = product.in_stock > 0 ? 10 : 0; // arbitrary default for existing
        for (const size of parsedSizes) {
          sizesObj[size] = stockPerSize;
        }
      }

      await pool.query('UPDATE products SET sizes = ? WHERE id = ?', [JSON.stringify(sizesObj), product.id]);
    }

    console.log('Sizes migration completed.');

  } catch (e: any) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
