import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type CartItem = {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  image: string
  metal: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  add: (item: Omit<CartItem, "id" | "quantity">, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  subtotal: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (item, qty = 1) => {
        const id = `${item.productId}-${item.metal}`
        const existing = get().items.find((i) => i.id === id)
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + qty } : i
            ),
            isOpen: true,
          }))
        } else {
          set((s) => ({
            items: [...s.items, { ...item, id, quantity: qty }],
            isOpen: true,
          }))
        }
      },
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "provelaa-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
)

type WishlistState = {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "provelaa-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
