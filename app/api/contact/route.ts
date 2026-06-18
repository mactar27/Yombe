import { NextResponse } from 'next/server'
import { createContactMessage } from '@/lib/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const result = await createContactMessage({ firstName, lastName, email, phone, subject, message })
    return NextResponse.json({ success: true, id: result.id }, { status: 201 })
  } catch (error) {
    console.error('[API /contact]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
