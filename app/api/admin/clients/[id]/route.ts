import { NextResponse } from 'next/server';
import pool from '@/lib/db';
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.execute('DELETE FROM clients WHERE id = ?', [params.id]);
  return NextResponse.json({ success: true });
}
