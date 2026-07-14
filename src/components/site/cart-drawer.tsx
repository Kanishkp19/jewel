"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { useRouter } from "@/lib/router"
import { formatPrice, siteConfig } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CartDrawer() {
  const cart = useCart()
  const { navigate } = useRouter()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const subtotal = mounted ? cart.subtotal() : 0
  const freeShippingAt = siteConfig.shipping.freeOver
  const remaining = Math.max(0, freeShippingAt - subtotal)
  const progress = Math.min(100, (subtotal / freeShippingAt) * 100)

  const goCheckout = () => {
    cart.close()
    navigate({ name: "checkout" })
  }

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70]"
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={cart.close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-luxe flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="font-serif text-xl">Your Cart</h2>
                <span className="text-sm text-muted-foreground">
                  ({mounted ? cart.count() : 0})
                </span>
              </div>
              <button onClick={cart.close} className="p-1.5 hover:text-accent">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {mounted && cart.items.length > 0 && (
              <div className="px-5 py-3 bg-champagne/40 border-b border-border">
                <p className="text-xs text-ink mb-2">
                  {remaining > 0 ? (
                    <>
                      You're{" "}
                      <span className="font-semibold text-accent-foreground">
                        {formatPrice(remaining)}
                      </span>{" "}
                      away from free shipping
                    </>
                  ) : (
                    <span className="font-medium text-accent-foreground">
                      ✦ You've unlocked free shipping!
                    </span>
                  )}
                </p>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-luxe">
              {mounted && cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="h-20 w-20 rounded-full bg-champagne/50 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-accent" />
                  </div>
                  <p className="font-serif text-xl mb-1">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Discover pieces that become heirlooms.
                  </p>
                  <Button
                    onClick={() => {
                      cart.close()
                      navigate({ name: "shop" })
                    }}
                    className="bg-ink text-cream hover:bg-ink/90 rounded-full"
                  >
                    Explore Collection
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 flex gap-4"
                      >
                        <button
                          onClick={() => {
                            cart.close()
                            navigate({ name: "product", slug: item.slug })
                          }}
                          className="relative h-24 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                        >
                          { }
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-base leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.metal}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center border border-border rounded-full">
                              <button
                                onClick={() =>
                                  cart.updateQty(item.id, item.quantity - 1)
                                }
                                className="p-1.5 hover:text-accent"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-2 text-sm w-7 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  cart.updateQty(item.id, item.quantity + 1)
                                }
                                className="p-1.5 hover:text-accent"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => cart.remove(item.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {mounted && cart.items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout.
                </p>
                <Button
                  onClick={goCheckout}
                  className="w-full bg-ink text-cream hover:bg-ink/90 rounded-full h-12 text-sm tracking-wider uppercase group"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <button
                  onClick={cart.close}
                  className="w-full text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
