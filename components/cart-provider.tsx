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
  updateSize: (oldKey: string, newSize: string) => void
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

  const updateSize = useCallback((oldKey: string, newSize: string) => {
    setItems((prev) => {
      const itemToUpdate = prev.find((item) => item.key === oldKey);
      if (!itemToUpdate) return prev;
      
      const newKey = `${itemToUpdate.product.id}__${newSize ?? ''}__${itemToUpdate.image ?? ''}`;
      
      const existingNewKeyItem = prev.find((item) => item.key === newKey && item.key !== oldKey);
      if (existingNewKeyItem) {
        return prev
          .map((item) => item.key === newKey ? { ...item, quantity: item.quantity + itemToUpdate.quantity } : item)
          .filter((item) => item.key !== oldKey);
      } else {
        return prev.map((item) => item.key === oldKey ? { ...item, size: newSize, key: newKey } : item);
      }
    });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return { items, count, subtotal, addItem, updateQuantity, updateSize, removeItem, clear, isOpen, setOpen }
  }, [items, addItem, updateQuantity, updateSize, removeItem, clear, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
