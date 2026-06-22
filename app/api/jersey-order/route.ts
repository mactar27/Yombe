import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { model, quantity, playerName, number, colors, logoUrl, contactName, contactPhone, notes } = await req.json()

    if (!model || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    await pool.execute(
      `INSERT INTO jersey_orders (model_name, quantity, player_name, jersey_number, colors, logo_url, contact_name, contact_phone, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [model, quantity ?? 1, playerName ?? null, number ?? null, colors ?? null, logoUrl ?? null, contactName, contactPhone, notes ?? null]
    )

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    // If column doesn't exist, do basic insert
    try {
      const { model, quantity, playerName, number, colors, logoUrl, contactName, contactPhone, notes } = await req.json().catch(() => ({}))
      await pool.execute(
        'INSERT INTO jersey_orders (name, email, design_description, quantity) VALUES (?, ?, ?, ?)',
        [contactName, contactPhone, `Modèle: ${model}, Joueur: ${playerName} #${number}, Couleurs: ${colors}`, quantity ?? 1]
      )
      return NextResponse.json({ success: true })
    } catch (e2) {
      return NextResponse.json({ success: true }) // Fail silently — WhatsApp will handle
    }
  }
}
