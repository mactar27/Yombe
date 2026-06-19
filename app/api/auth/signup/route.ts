import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { normalizePhone } from '@/lib/normalize-phone'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json()

    if (!name || !password) {
      return NextResponse.json({ error: 'Nom et mot de passe requis' }, { status: 400 })
    }
    if (!phone && !email) {
      return NextResponse.json({ error: 'Un numéro de téléphone ou un email est requis' }, { status: 400 })
    }

    const normalizedPhone = phone ? normalizePhone(phone) : null
    const normalizedEmail = email ? email.trim().toLowerCase() : null

    // Check for duplicate phone
    if (normalizedPhone) {
      const [existing] = await pool.execute('SELECT id FROM users WHERE phone = ?', [normalizedPhone]) as any[]
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Ce numéro de téléphone est déjà utilisé' }, { status: 409 })
      }
    }

    // Check for duplicate email
    if (normalizedEmail) {
      const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [normalizedEmail]) as any[]
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
      }
    }

    const hash = await bcrypt.hash(password, 10)

    const [userResult] = await pool.execute(
      'INSERT INTO users (name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, normalizedPhone, normalizedEmail, hash, 'client']
    ) as any[]

    await pool.execute(
      'INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)',
      [name, normalizedPhone, normalizedEmail]
    )

    const userId = userResult.insertId

    const res = NextResponse.json({
      success: true,
      user: { id: userId, name, phone: normalizedPhone, email: normalizedEmail, role: 'client' },
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
