import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const search = searchParams.get('search') ?? '';
  const offset = (page - 1) * limit;
  const where = search ? 'WHERE name LIKE ? OR email LIKE ?' : '';
  const values = search ? ['%' + search + '%', '%' + search + '%'] : [];
  const [rows] = await pool.execute(
    `SELECT c.*, 
     COALESCE(c.address, (SELECT delivery_address FROM orders WHERE client_id = c.id ORDER BY created_at DESC LIMIT 1)) as display_address 
     FROM clients c ` + where + ' ORDER BY c.id DESC LIMIT ' + limit + ' OFFSET ' + offset,
    values
  );
  const [cnt] = await pool.execute('SELECT COUNT(*) as total FROM clients c ' + where, values);
  return NextResponse.json({ data: rows, total: (cnt as any)[0].total, page, limit });
}

export async function POST(request: Request) {
  const { name, email, phone, address } = await request.json();
  if (!name || !email) return NextResponse.json({ error: 'name and email required' }, { status: 400 });
  const [r] = await pool.execute(
    'INSERT INTO clients (name,email,phone,address) VALUES (?,?,?,?)',
    [name, email, phone ?? null, address ?? null]
  );
  return NextResponse.json({ id: (r as any).insertId }, { status: 201 });
}
