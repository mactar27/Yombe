import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const VALID_STATUSES = ['pending','paid','shipped','delivered','cancelled'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return NextResponse.json({ success: true });
}
