import { NextResponse } from 'next/server'
import { createJerseyOrder } from '@/lib/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { model, color, playerName, number, withLogo, details } = body

    if (!model || !color || !playerName) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const result = await createJerseyOrder({ model, color, playerName, number, withLogo, details })
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (error) {
    console.error('[API /jersey-orders]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
