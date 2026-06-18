import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [params.id]);
  const product = (rows as any)[0];
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const fields: string[] = [];
  const values: any[] = [];
  const allowed = ['name','description','price','image','stock','category'];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'stock') {
        fields.push('in_stock = ?');
        values.push(Number(body[key]) > 0 ? 1 : 0);
      } else {
        fields.push(key + ' = ?');
        values.push(body[key]);
      }
    }
  }
  if (!fields.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });
  values.push(params.id);
  await pool.execute('UPDATE products SET ' + fields.join(',') + ' WHERE id = ?', values);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.execute('DELETE FROM products WHERE id = ?', [params.id]);
  return NextResponse.json({ success: true });
}
