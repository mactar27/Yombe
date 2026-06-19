import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT key_name, value FROM settings');
    const settings: Record<string, string> = {};
    for (const row of rows as any[]) {
      settings[row.key_name] = row.value;
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[API GET settings]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { hero_image_1, hero_image_2 } = body;

    // Build values for insertion/update
    // Using ON DUPLICATE KEY UPDATE so it works whether row exists or not
    if (hero_image_1) {
      await pool.execute(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        ['hero_image_1', hero_image_1, hero_image_1]
      );
    }
    
    if (hero_image_2) {
      await pool.execute(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        ['hero_image_2', hero_image_2, hero_image_2]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API PATCH settings]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
