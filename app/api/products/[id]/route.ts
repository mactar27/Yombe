import { NextResponse } from 'next/server'
import { getProductById } from '@/lib/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)
    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch (error) {
    console.error('[API /products/[id]]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
