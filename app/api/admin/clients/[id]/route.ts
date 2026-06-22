import { NextResponse } from 'next/server';
import pool from '@/lib/db';
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.execute("DELETE FROM users WHERE id = ? AND role = 'client'", [id]);
  return NextResponse.json({ success: true });
}
