import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { normalizePhone } from '@/lib/normalize-phone'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json()

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Nom, téléphone et mot de passe requis' }, { status: 400 })
    }

    const normalizedPhone = normalizePhone(phone)

    // Check if phone already taken
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [normalizedPhone]
    ) as any[]

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Ce numéro de téléphone est déjà utilisé' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)

    const [userResult] = await pool.execute(
      'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, normalizedPhone, hash, 'client']
    ) as any[]

    // Also insert into clients table
    await pool.execute(
      'INSERT INTO clients (name, phone) VALUES (?, ?)',
      [name, normalizedPhone]
    )

    const userId = userResult.insertId

    const res = NextResponse.json({
      success: true,
      user: { id: userId, name, phone: normalizedPhone, role: 'client' },
    })

    res.cookies.set('auth_user', JSON.stringify({ id: userId, name, role: 'client' }), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur lors de la création du compte' }, { status: 500 })
  }
}
