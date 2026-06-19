import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/queries'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const audiences = searchParams.getAll('audience')
    const sizes = searchParams.getAll('size')
    const colors = searchParams.getAll('color')
    const maxPrice = searchParams.get('maxPrice')
    const inStockOnly = searchParams.get('inStock') === '1'
    const sort = searchParams.get('sort') as 'popularite' | 'prix-asc' | 'prix-desc' | 'nouveautes' | null

    const products = await getProducts({
      audiences: audiences.length ? audiences : undefined,
      sizes: sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      inStockOnly,
      sort: sort ?? 'popularite',
    })

    return NextResponse.json({ products, total: products.length })
  } catch (error) {
    console.error('[API /products]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
