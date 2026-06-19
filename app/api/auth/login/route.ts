import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { normalizePhone } from '@/lib/normalize-phone'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Téléphone et mot de passe requis' }, { status: 400 })
    }

    const normalized = normalizePhone(phone)

    const [rows] = await pool.execute(
      'SELECT id, name, phone, password_hash, role FROM users WHERE phone = ?',
      [normalized]
    ) as any[]

    const user = rows[0]
    if (!user) {
      return NextResponse.json({ error: 'Numéro ou mot de passe incorrect' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Numéro ou mot de passe incorrect' }, { status: 401 })
    }

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
    })

    res.cookies.set('auth_user', JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
