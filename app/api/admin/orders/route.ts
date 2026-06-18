import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const search = searchParams.get('search') ?? '';
  const offset = (page - 1) * limit;
  const where = search ? 'WHERE CAST(o.id AS CHAR) LIKE ? OR c.name LIKE ?' : '';
  const values = search ? ['%' + search + '%', '%' + search + '%'] : [];
  const [rows] = await pool.execute(
    'SELECT o.*, c.name as client_name FROM orders o LEFT JOIN clients c ON c.id = o.client_id ' + where + ' ORDER BY o.id DESC LIMIT ' + limit + ' OFFSET ' + offset,
    values
  );
  const [cnt] = await pool.execute(
    'SELECT COUNT(*) as total FROM orders o LEFT JOIN clients c ON c.id = o.client_id ' + where,
    values
  );
  return NextResponse.json({ data: rows, total: (cnt as any)[0].total, page, limit });
}
