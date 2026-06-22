import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { normalizePhone } from '@/lib/normalize-phone'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe requis' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check for duplicate email
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [normalizedEmail]) as any[]
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)

    const [userResult] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, normalizedEmail, hash, 'client']
    ) as any[]



    const userId = userResult.insertId

    const res = NextResponse.json({
      success: true,
      user: { id: userId, name, email: normalizedEmail, role: 'client' },
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
