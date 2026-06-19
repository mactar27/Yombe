import pool from './lib/db';

async function test() {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', ['casquette-brodee']);
    console.log("Delete result:", result);
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    process.exit(0);
  }
}
test();
