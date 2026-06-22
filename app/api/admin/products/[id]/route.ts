import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

function categoryToAudience(category: string | null): string[] {
  if (!category) return []
  const map: Record<string, string[]> = {
    'Homme': ['homme'],
    'Femme': ['femme'],
    'Enfant': ['enfant'],
    'Unisexe': ['unisexe'],
    'Football': ['football'],
    'Accessoires': ['accessoires'],
    'Maillots de clubs': ['football'],
    'Maillots personnalisés': ['football'],
    "Maillots d'arbitres": ['football'],
    'Chaussures de football': ['football'],
    'Ballons': ['football'],
    'Cônes d\'entraînement': ['football'],
    'Cartons jaunes et rouges': ['football'],
  }
  return map[category] ?? []
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
  const product = (rows as any)[0];
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const fields: string[] = [];
  const values: any[] = [];
  const allowed = ['name','description','price','image','stock','category', 'sizes', 'colors', 'isNew', 'isPromo', 'rating'];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'stock') {
        fields.push('in_stock = ?');
        values.push(Number(body[key]) > 0 ? 1 : 0);
      } else if (key === 'isNew') {
        fields.push('is_new = ?');
        values.push(body[key] ? 1 : 0);
      } else if (key === 'isPromo') {
        fields.push('is_promo = ?');
        values.push(body[key] ? 1 : 0);
      } else if (key === 'sizes' || key === 'colors') {
        fields.push(key + ' = ?');
        values.push(Array.isArray(body[key]) ? JSON.stringify(body[key]) : '[]');
      } else if (key === 'category') {
        fields.push('category = ?');
        values.push(body[key]);
        // Also update audience based on category
        fields.push('audience = ?');
        values.push(JSON.stringify(categoryToAudience(body[key])));
      } else {
        fields.push(key + ' = ?');
        values.push(body[key]);
      }
    }
  }
  if (!fields.length) return NextResponse.json({ error: 'No fields' }, { status: 400 });
  values.push(id);
  await pool.execute('UPDATE products SET ' + fields.join(',') + ' WHERE id = ?', values);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}
