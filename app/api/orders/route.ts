import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, total, address, phone, clientName, clientEmail, userId } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 })
    }
    if (!address) {
      return NextResponse.json({ error: 'Adresse de livraison requise' }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ error: 'Numéro WhatsApp requis' }, { status: 400 })
    }

    // Try to get user from cookie if connected
    const authCookie = req.cookies.get('auth_user')
    let resolvedUserId = userId ?? null
    let resolvedName = clientName ?? 'Invité'
    let resolvedEmail = clientEmail ?? null

    if (authCookie) {
      try {
        const userCookie = JSON.parse(authCookie.value)
        resolvedUserId = userCookie.id
        const [userRows] = await pool.execute('SELECT name, email FROM users WHERE id = ?', [userCookie.id]) as any[]
        if (userRows.length > 0) {
          resolvedName = userRows[0].name
          resolvedEmail = userRows[0].email
        }
      } catch (e) {
        // ignore — treat as guest
      }
    }

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()

      const [orderResult] = await conn.execute(
        'INSERT INTO orders (client_id, client_name, client_email, status, total, delivery_address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [resolvedUserId, resolvedName, resolvedEmail, 'pending', total, address, phone]
      ) as any[]

      const orderId = orderResult.insertId

      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, size, price_at_purchase, selected_image) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.product.id, item.quantity, item.size || null, item.product.price, item.image || null]
        )

        // Mettre à jour le stock spécifique à la taille
        const [prodRows] = await conn.execute('SELECT sizes FROM products WHERE id = ? FOR UPDATE', [item.product.id]) as any[];
        if (prodRows.length > 0) {
          const product = prodRows[0];
          let sizesObj: any = null;
          try {
            sizesObj = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
          } catch(e) {}
          
          if (sizesObj && typeof sizesObj === 'object' && !Array.isArray(sizesObj)) {
            if (item.size && sizesObj[item.size] !== undefined) {
               sizesObj[item.size] = Math.max(0, Number(sizesObj[item.size]) - item.quantity);
            }
            // Recalculate total stock from all sizes
            const totalStock = Object.values(sizesObj).reduce((a: any, b: any) => Number(a) + Number(b), 0);
            const newInStock = (totalStock as number) > 0 ? 1 : 0;
            
            await conn.execute(
              'UPDATE products SET sizes = ?, in_stock = ? WHERE id = ?', 
              [JSON.stringify(sizesObj), newInStock, item.product.id]
            );
          }
        }
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
