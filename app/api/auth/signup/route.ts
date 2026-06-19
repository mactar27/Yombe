import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password } = await req.json()

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Nom, téléphone et mot de passe requis' }, { status: 400 })
    }

    const normalizedPhone = phone.replace(/\s+/g, '')

    // Ensure users table supports phone-based auth
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Check if phone already taken
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE REPLACE(phone, " ", "") = ?',
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
