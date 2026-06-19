"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { Product } from "@/lib/data"

export type CartItem = {
  product: Product
  quantity: number
  size?: string
  image?: string
  key: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (product: Product, size?: string, image?: string) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)

  const addItem = useCallback((product: Product, size?: string, image?: string) => {
    const key = `${product.id}__${size ?? ''}__${image ?? ''}`
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1, size, image, key }]
    })
    setOpen(true)
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return { items, count, subtotal, addItem, updateQuantity, removeItem, clear, isOpen, setOpen }
  }, [items, addItem, updateQuantity, removeItem, clear, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
