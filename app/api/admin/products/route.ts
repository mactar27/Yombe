import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const search = searchParams.get('search') ?? '';
  const offset = (page - 1) * limit;
  const where = search ? 'WHERE name LIKE ? OR description LIKE ?' : '';
  const values = search ? ['%' + search + '%', '%' + search + '%'] : [];
  const [rows] = await pool.execute(
    'SELECT * FROM products ' + where + ' ORDER BY id DESC LIMIT ' + limit + ' OFFSET ' + offset,
    values
  );
  const [cnt] = await pool.execute('SELECT COUNT(*) as total FROM products ' + where, values);
  return NextResponse.json({ data: rows, total: (cnt as any)[0].total, page, limit });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, price, image, stock, category } = body;
  if (!name || price == null) return NextResponse.json({ error: 'name and price required' }, { status: 400 });
  const newId = Date.now().toString();
  const inStock = Number(stock ?? 0) > 0 ? 1 : 0;
  await pool.execute(
    'INSERT INTO products (id, name, description, price, image, in_stock, category, audience, sizes, colors) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [newId, name, description ?? null, Number(price), image ?? null, inStock, category ?? null, '[]', '[]', '[]']
  );
  return NextResponse.json({ id: newId }, { status: 201 });
}
