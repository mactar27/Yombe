import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const authCookie = req.cookies.get('auth_user')
    if (!authCookie) {
      return NextResponse.json({ error: 'Vous devez être connecté pour passer commande' }, { status: 401 })
    }

    const userCookie = JSON.parse(authCookie.value)
    
    // 1. Fetch full user details from DB
    const [userRows] = await pool.execute('SELECT name, phone, email FROM users WHERE id = ?', [userCookie.id]) as any[]
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 })
    }
    const user = userRows[0]

    // 2. Find client_id
    let clientId = userCookie.id;
    const [clientRows] = await pool.execute('SELECT id FROM clients WHERE (phone = ? AND phone IS NOT NULL) OR (email = ? AND email IS NOT NULL) LIMIT 1', [user.phone, user.email]) as any[]
    
    if (clientRows.length > 0) {
      clientId = clientRows[0].id
    } else {
      // 3. Create client if not exists
      const [insertClient] = await pool.execute(
        'INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)',
        [user.name, user.phone, user.email]
      ) as any[]
      clientId = insertClient.insertId
    }

    const body = await req.json()
    const { items, total, address, phone } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 })
    }

    if (!address) {
      return NextResponse.json({ error: 'Adresse de livraison requise' }, { status: 400 })
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [orderResult] = await conn.execute(
        'INSERT INTO orders (client_id, status, total, delivery_address, phone) VALUES (?, ?, ?, ?, ?)',
        [clientId, 'pending', total, address, phone || user.phone]
      ) as any[]

      const orderId = orderResult.insertId

      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, size, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product.id, item.quantity, item.size || null, item.product.price]
        )
      }

      await conn.commit()
      return NextResponse.json({ success: true, orderId })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
  }
}
