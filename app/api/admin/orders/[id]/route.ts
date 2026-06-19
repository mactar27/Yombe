import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending','paid','shipped','delivered','cancelled'];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Get order and client info
  const [orderRows] = await pool.execute(
    'SELECT o.*, c.name as client_name, c.email as client_email FROM orders o LEFT JOIN clients c ON c.id = o.client_id WHERE o.id = ?',
    [id]
  ) as any[];
  
  if (orderRows.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  
  const order = orderRows[0];
  
  // Get order items
  const [itemsRows] = await pool.execute(
    'SELECT oi.*, p.name as product_name, p.image as product_image FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?',
    [id]
  ) as any[];
  
  return NextResponse.json({ order, items: itemsRows });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json();
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return NextResponse.json({ success: true });
}
