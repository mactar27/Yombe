import pool from './lib/db';

async function setup() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`settings\` (
        \`key_name\` varchar(100) NOT NULL,
        \`value\` text,
        PRIMARY KEY (\`key_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await pool.execute("INSERT IGNORE INTO settings (key_name, value) VALUES ('hero_image_1', '/placeholder.svg?height=640&width=480')");
    await pool.execute("INSERT IGNORE INTO settings (key_name, value) VALUES ('hero_image_2', '/placeholder.svg?height=640&width=480')");
    console.log("Settings table created and seeded.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
setup();
