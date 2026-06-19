import { NextResponse } from 'next/server';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/products/ballon-match-officiel', { method: 'DELETE' });
    console.log("Status:", res.status);
    console.log("Text:", await res.text());
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
test();
