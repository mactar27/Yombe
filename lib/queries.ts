import { query } from './db'
import type { RowDataPacket } from 'mysql2'
import type { Product, Testimonial } from './data'

// ─── Helper : parse JSON fields from DB rows ────────────────────────────────

function parseProduct(row: RowDataPacket): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    description: row.description,
    category: row.category,
    audience: typeof row.audience === 'string' ? JSON.parse(row.audience) : row.audience,
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors,
    image: row.image || '/placeholder.svg',
    isNew: Boolean(row.is_new),
    isPromo: Boolean(row.is_promo),
    inStock: Boolean(row.in_stock),
    rating: row.rating,
  }
}

function parseTestimonial(row: RowDataPacket): Testimonial {
  return {
    name: row.name,
    role: row.role,
    quote: row.quote,
    avatar: row.avatar || '/placeholder.svg',
    rating: row.rating,
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export type ProductFilters = {
  audiences?: string[]
  sizes?: string[]
  colors?: string[]
  maxPrice?: number
  inStockOnly?: boolean
  sort?: 'popularite' | 'prix-asc' | 'prix-desc' | 'nouveautes'
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const rows = await query<RowDataPacket[]>('SELECT * FROM products')
  let products = rows.map(parseProduct)

  // Client-side-style filtering (works fine for the current data volume)
  if (filters.audiences?.length) {
    products = products.filter((p) =>
      filters.audiences!.some((a) => p.audience.includes(a as Product['audience'][number]))
    )
  }
  if (filters.sizes?.length) {
    products = products.filter((p) => filters.sizes!.some((s) => p.sizes.includes(s)))
  }
  if (filters.colors?.length) {
    products = products.filter((p) => filters.colors!.some((c) => p.colors.includes(c)))
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!)
  }
  if (filters.inStockOnly) {
    products = products.filter((p) => p.inStock)
  }

  switch (filters.sort) {
    case 'prix-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'prix-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'nouveautes':
      products.sort((a, b) => Number(b.isNew) - Number(a.isNew))
      break
    default:
      products.sort((a, b) => b.rating - a.rating)
  }

  return products
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await query<RowDataPacket[]>(
    `SELECT * FROM products ORDER BY rating DESC, is_new DESC LIMIT ${Number(limit)}`
  )
  return rows.map(parseProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await query<RowDataPacket[]>('SELECT * FROM products WHERE id = ? LIMIT 1', [id])
  if (!rows.length) return null
  return parseProduct(rows[0])
}

export async function getMaxPrice(): Promise<number> {
  const rows = await query<RowDataPacket[]>('SELECT MAX(price) as max FROM products')
  return rows[0]?.max ?? 50000
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await query<RowDataPacket[]>('SELECT * FROM testimonials ORDER BY id')
  return rows.map(parseTestimonial)
}

// ─── Jersey Orders ────────────────────────────────────────────────────────────

export type JerseyOrderInput = {
  model: string
  color: string
  playerName: string
  number: string
  withLogo: boolean
  details?: string
}

export async function createJerseyOrder(data: JerseyOrderInput): Promise<{ id: number }> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO jersey_orders (model, color, player_name, number, with_logo, details)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.model, data.color, data.playerName, data.number, data.withLogo ? 1 : 0, data.details || null]
  )
  return { id: (result as unknown as { insertId: number }).insertId }
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export type ContactMessageInput = {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function createContactMessage(data: ContactMessageInput): Promise<{ id: number }> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.firstName, data.lastName || null, data.email, data.phone || null, data.subject || null, data.message]
  )
  return { id: (result as unknown as { insertId: number }).insertId }
}

// ─── User Orders ─────────────────────────────────────────────────────────────

export type Order = {
  id: number
  clientId: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  createdAt: Date
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const rows = await query<RowDataPacket[]>(
    `SELECT id, client_id as clientId, status, total, created_at as createdAt
     FROM orders WHERE client_id = ?
     ORDER BY created_at DESC`,
    [userId]
  )
  return rows as Order[]
}

// ─── User Favorites ─────────────────────────────────────────────────────────

export async function getUserFavorites(userId: number): Promise<Product[]> {
  const rows = await query<RowDataPacket[]>(
    `SELECT p.* FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [userId]
  )
  return rows.map(parseProduct)
}

export async function addFavorite(userId: number, productId: string): Promise<void> {
  await query(
    `INSERT INTO favorites (user_id, product_id) VALUES (?, ?)`,
    [userId, productId]
  )
}

export async function removeFavorite(userId: number, productId: string): Promise<void> {
  await query(
    `DELETE FROM favorites WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  )
}

export async function isFavorite(userId: number, productId: string): Promise<boolean> {
  const rows = await query<RowDataPacket[]>(
    `SELECT id FROM favorites WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  )
  return rows.length > 0
}
